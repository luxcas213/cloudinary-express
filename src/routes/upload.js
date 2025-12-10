import express from "express";
import upload from "../middleware/upload.js";
import { uploadFile, listFiles, getFile } from "../controllers/upload.js";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", listFiles);
router.get("/:id", authenticateToken, getFile);
router.post("/", authenticateToken, upload.single("image"), uploadFile);

export default router;
