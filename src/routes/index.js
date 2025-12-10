import express from "express";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/secure", authenticateToken, (req, res) => {
  res.send("secure");
});

export default router;