import { Book } from "./paintDB.js";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const port = 3000;

// Middleware do weryfikacji JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Pobranie wszystkich książek
app.get("/api/book", async (req, res) => {
  const books = await Book.findAll();
  res.send(books);
});

// Pobranie książki po ID
app.get("/api/book/:id", async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);

  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ error: "Book not found" });
  }
});

// Dodanie nowej książki (zabezpieczone JWT)
app.post("/api/book", authenticateToken, async (req, res) => {
  const { title, author, year } = req.body;
  const book = await Book.create({ title, author, year });

  res.send({ id: book.id });
});

// Usunięcie książki (zabezpieczone JWT)
app.delete("/api/book/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByPk(id);

  if (book) {
    await book.destroy();
    res.send({ message: "Book deleted successfully" });
  } else {
    res.status(404).send({ error: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Service 1 running on port ${port}`);
});
