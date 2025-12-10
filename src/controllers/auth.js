import * as authService from "../services/auth.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await authService.registerUser(username, email, password);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.loginUser(email, password);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
