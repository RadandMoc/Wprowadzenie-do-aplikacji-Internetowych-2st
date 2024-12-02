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

@app.route('/api/books', methods=['GET'])
def get_books():
    books = query_db("SELECT * FROM books")
    return jsonify([{"id": row[0], "title": row[1], "author": row[2], "year": row[3]} for row in books])

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = query_db("SELECT * FROM books WHERE id = ?", [book_id], one=True)
    if book:
        return jsonify({"id": book[0], "title": book[1], "author": book[2], "year": book[3]})
    return jsonify({"error": "Book not found"}), 404

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    query_db("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", 
             [data['title'], data['author'], data['year']])
    return jsonify({"message": "Book added"}), 201

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    query_db("DELETE FROM books WHERE id = ?", [book_id])
    return jsonify({"message": "Book deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
