const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());

// Pobierz wszystkie książki
app.get('/api/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) return res.status(500).send(err.message); // Obsługa błędu
        res.json(rows || []); // Zwraca pustą tablicę, jeśli brak danych
    });
});


// Pobierz książkę po ID
app.get('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) return res.status(404).send('Książka nie znaleziona');
        res.json(row);
    });
});

// Dodaj nową książkę
app.post('/api/books', (req, res) => {
    const { title, author, year } = req.body;
    db.run('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', [title, author, year], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID });
    });
});

// Usuń książkę
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.send(`Książka o ID ${id} została usunięta`);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));

//const path = require('path');
//app.use(express.static(path.join(__dirname, 'public')));
