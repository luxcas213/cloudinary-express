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

export const listFiles = async (req, res) => {
  try {
    const files = await uploadService.getAllUploads();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await uploadService.getUploadById(id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
