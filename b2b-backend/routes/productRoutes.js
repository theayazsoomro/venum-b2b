import express from "express";
const router = express.Router();
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

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

// POST /api/products - Create a new product (admin/manager only)
router.post("/", async (req, res) => {
  try {
    // Check if user has permission to create products
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins and managers can create products.",
      });
    }

    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Validate originalPrice vs price
    if (
      productData.originalPrice &&
      productData.originalPrice < productData.price
    ) {
      return res.status(400).json({
        status: "error",
        message: "Original price cannot be less than current price",
      });
    }

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
      message: "Failed to create product",
    });
  }
});

// PUT /api/products/:id - Update a product (admin/manager only)
router.put("/:id", async (req, res) => {
  try {
    // Check if user has permission to update products
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins and managers can update products.",
      });
    }

    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Validate originalPrice vs price
    if (
      productData.originalPrice &&
      productData.originalPrice < productData.price
    ) {
      return res.status(400).json({
        status: "error",
        message: "Original price cannot be less than current price",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Error updating product:", error);

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
      message: "Failed to update product",
    });
  }
});

// DELETE /api/products/:id - Delete a product (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user has permission to delete products
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only admins can delete products.",
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

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
