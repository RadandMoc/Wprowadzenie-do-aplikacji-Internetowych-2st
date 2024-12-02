import { Order } from "./paintDB.js";
import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const port = 3001;

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

// Pobranie wszystkich zamówień
app.get("/api/orders/all", async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch orders" });
  }
});

// Pobranie wszystkich zamówień użytkownika
app.get("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({ where: { userId } });
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch user's orders" });
  }
});

// Dodanie zamówienia (zabezpieczone JWT)
app.post("/api/orders", authenticateToken, async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    const response = await axios.get(`http://localhost:3000/api/book/${bookId}`);
    if (!response.data) {
      return res.status(404).send({ error: "Book not found" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch book information" });
  }

  try {
    const newOrder = await Order.create({ userId, bookId, quantity });
    res.status(201).send({ id: newOrder.id });
  } catch (error) {
    res.status(500).send({ error: "Failed to create order" });
  }
});

// Usunięcie zamówienia (zabezpieczone JWT)
app.delete("/api/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);

  if (order) {
    await order.destroy();
    res.send({ message: "Order deleted successfully" });
  } else {
    res.status(404).send({ error: "Order not found" });
  }
});

// Edycja zamówienia (zabezpieczone JWT)
app.patch("/api/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const orderPatch = req.body;
  const order = await Order.findByPk(id);

  if (order) {
    await order.update(orderPatch);
    res.send({ message: "Order updated successfully" });
  } else {
    res.status(404).send({ error: "Order not found" });
  }
});

app.listen(port, () => {
  console.log(`Service 2 running on port ${port}`);
});
