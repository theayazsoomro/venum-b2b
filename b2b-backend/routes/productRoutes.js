import express from "express";
const router = express.Router();
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/imageUpload.js";

// GET /api/products - Get all products with filtering, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.category) {
      filter.category = new RegExp(req.query.category, "i");
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice)
        filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
    });
  }
});

// GET /api/products/:id - Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
    });
  }
});

// POST /api/products - Create with better error handling
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins and managers can create products.",
      });
    }

    const productData = { ...req.body };

    // Handle base64 images from frontend
    if (
      req.body.images &&
      Array.isArray(req.body.images) &&
      req.body.images.length > 0
    ) {
      console.log(`Processing ${req.body.images.length} base64 images...`); // Debug log

      const imageUrls = [];
      for (let i = 0; i < req.body.images.length; i++) {
        const base64Image = req.body.images[i];

        if (base64Image && base64Image.startsWith("data:image/")) {
          try {
            // Extract buffer from base64
            const base64Data = base64Image.split(",")[1];
            if (!base64Data) {
              throw new Error("Invalid base64 image data");
            }

            const buffer = Buffer.from(base64Data, "base64");
            console.log(
              `Uploading image ${i + 1}, buffer size:`,
              buffer.length
            ); // Debug log

            const imageUrl = await uploadToCloudinary(
              buffer,
              `img_${i + 1}_${Date.now()}`
            );
            imageUrls.push(imageUrl);
          } catch (imageError) {
            console.error(
              `Error processing image ${i + 1}:`,
              imageError.message
            );
            // Continue with other images instead of failing completely
          }
        }
      }

      productData.images = imageUrls;
      console.log(`Successfully uploaded ${imageUrls.length} images`); // Debug log
    }

    // Remove the problematic validation - let schema handle it
    delete productData.originalPrice; // Temporarily remove to test

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Product with this SKU already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create product",
    });
  }
});

// PUT /api/products/:id - Update with image handling
router.put("/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins and managers can update products.",
      });
    }

    const productData = { ...req.body };

    // Get existing product to handle image deletion
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Handle new images
    if (req.body.images && Array.isArray(req.body.images)) {
      const imageUrls = [];
      for (const base64Image of req.body.images) {
        if (base64Image.startsWith("data:image/")) {
          const buffer = Buffer.from(base64Image.split(",")[1], "base64");
          const imageUrl = await uploadToCloudinary(
            buffer,
            `img_${Date.now()}`
          );
          imageUrls.push(imageUrl);
        } else if (base64Image.startsWith("http")) {
          // Keep existing Cloudinary URLs
          imageUrls.push(base64Image);
        }
      }
      productData.images = imageUrls;

      // Delete removed images from Cloudinary
      const removedImages = existingProduct.images.filter(
        (img) => !imageUrls.includes(img)
      );
      for (const imageUrl of removedImages) {
        await deleteFromCloudinary(imageUrl);
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    // Handle validation and other errors...
  }
});

// DELETE /api/products/:id - Delete with image cleanup
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins can delete products.",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        await deleteFromCloudinary(imageUrl);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete product",
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.findByCategory(req.params.category)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments({
      category: new RegExp(req.params.category, "i"),
      status: "active",
    });

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products by category",
    });
  }
});

export default router;
