import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./paintDB.js";

dotenv.config();
const app = express();
app.use(express.json());
const port = 3002;

// Middleware do autoryzacji
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ error: "Invalid token" });
    req.user = user;
    next();
  });
};


// Rejestracja użytkownika
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).send({ id: newUser.id });
  } catch (error) {
    res.status(500).send({ error: "Failed to register user" });
  }
});

// Logowanie użytkownika
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).send({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(403).send({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token });
});

// Przykładowy endpoint zabezpieczony JWT
app.get("/api/protected", authenticateToken, (req, res) => {
  res.send({ message: `Hello user ${req.user.id}, you are authorized!` });
});

app.listen(port, () => {
  console.log(`Service 3 running on port ${port}`);
});

console.log(process.env.JWT_SECRET);