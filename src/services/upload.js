import cloudinary from "../lib/cloudinary.js";
import prisma from "../lib/prisma.js";
import { Readable } from "stream";

export const uploadImage = async (fileBuffer, originalName, mimeType, size) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return reject(error);
        }

        try {
          const savedImage = await prisma.upload.create({
            data: {
              filename: result.public_id, // Usamos el public_id como nombre de archivo
              originalName: originalName,
              cloudinaryUrl: result.secure_url,
              publicId: result.public_id,
              size: size,
              mimeType: mimeType,
            },
          });
          resolve(savedImage);
        } catch (dbError) {
          reject(dbError);
        }
      }
    );

    const stream = Readable.from(fileBuffer);
    stream.pipe(uploadStream);
  });
};
