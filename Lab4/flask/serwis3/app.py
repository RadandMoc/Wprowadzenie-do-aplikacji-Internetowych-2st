from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'

def query_db(query, args=(), one=False):
    with sqlite3.connect(DATABASE) as conn:
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        conn.commit()
        return (rv[0] if rv else None) if one else rv

@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    orders = query_db("SELECT * FROM orders WHERE user_id = ?", [user_id])
    return jsonify([{"id": row[0], "user_id": row[1], "book_id": row[2], "quantity": row[3]} for row in orders])

@app.route('/api/orders', methods=['POST'])
def add_order():
    data = request.json
    book = query_db("SELECT id FROM books WHERE id = ?", [data['book_id']], one=True)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    query_db("INSERT INTO orders (user_id, book_id, quantity) VALUES (?, ?, ?)", 
             [data['user_id'], data['book_id'], data['quantity']])
    return jsonify({"message": "Order added"}), 201

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    query_db("DELETE FROM orders WHERE id = ?", [order_id])
    return jsonify({"message": "Order deleted"}), 200

@app.route('/api/orders/<int:order_id>', methods=['PATCH'])
def update_order(order_id):
    data = request.json
    query_db("UPDATE orders SET quantity = ? WHERE id = ?", 
             [data['quantity'], order_id])
    return jsonify({"message": "Order updated"}), 200


import bcrypt

app = Flask(__name__)
DATABASE = 'database.db'

def query_db(query, args=(), one=False):
    with sqlite3.connect(DATABASE) as conn:
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        conn.commit()
        return (rv[0] if rv else None) if one else rv

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    try:
        query_db("INSERT INTO users (email, password) VALUES (?, ?)", 
                 [data['email'], hashed_password])
        return jsonify({"message": "User registered"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already in use"}), 400

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    user = query_db("SELECT * FROM users WHERE email = ?", [data['email']], one=True)
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user[2]):
        return jsonify({"message": "Login successful", "user_id": user[0]}), 200
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
