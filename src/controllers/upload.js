import * as uploadService from "../services/upload.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const { originalname, mimetype, size, buffer } = req.file;
    const result = await uploadService.uploadImage(
      buffer,
      originalname,
      mimetype,
      size
    );
    res.status(201).json({ message: "Image uploaded successfully", data: result });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
