import sqlite3

def init_db():
    with sqlite3.connect('database.db') as conn:
        with open('schema.sql', 'r') as f:
            conn.executescript(f.read())
    print("Baza danych została zainicjalizowana!")

if __name__ == '__main__':
    init_db()
