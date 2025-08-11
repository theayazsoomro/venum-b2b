import express from "express";
import { upload, uploadToCloudinary } from "../utils/imageUpload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/upload/blog-image - Upload single blog image (Admin only)
router.post("/blog-image", auth, upload.single("image"), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No image file provided",
      });
    }

    // Upload to Cloudinary with blog-specific settings
    const imageUrl = await uploadToCloudinaryBlog(req.file.buffer, req.file.originalname);

    res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Error uploading blog image:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Image upload failed",
    });
  }
});

// Custom upload function for blog images
const uploadToCloudinaryBlog = async (buffer, filename) => {
  try {
    const { v2: cloudinary } = await import('cloudinary');
    
    // Explicitly configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'venum-b2b/blogs',
          public_id: `blog_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          transformation: [
            { width: 1200, height: 800, crop: "limit", quality: "auto:good" },
            { format: "webp" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary blog upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary blog upload success:', result.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error.message);
    throw new Error(`Blog image upload failed: ${error.message}`);
  }
};

export default router;