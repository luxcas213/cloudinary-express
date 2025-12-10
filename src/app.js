import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import index from "./routes/index.js";
import auth from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import prisma from "./lib/prisma.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/index", index);
app.use("/auth", auth);
app.use("/upload", uploadRouter);


if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

export default app;