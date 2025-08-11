import express from "express";
import Blog from "../models/Blog.js";
import auth from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const validateBlog = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required and must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required"),
  body("excerpt")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Excerpt is required and must be between 1 and 300 characters"),
  body("image")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Image is required"),
  body("author.name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Author name is required"),
  body("category")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category is required and must be between 1 and 50 characters"),
  body("readTime")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Read time is required"),
];

// GET /api/blogs - Get all published blogs with pagination and filters
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured;

    let query = { status: "published" };

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (featured === "true") {
      query.featured = true;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// GET /api/blogs/:id - Get single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid blog ID",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// GET /api/blogs/category/:category - Get blogs by category
router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.findByCategory(req.params.category)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({
      category: new RegExp(req.params.category, "i"),
      status: "published",
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        blogs,
        category: req.params.category,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// POST /api/blogs - Create new blog (Admin only)
router.post("/", auth, validateBlog, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required.",
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blogData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt,
      image: req.body.image,
      author: {
        name: req.body.author.name,
        avatar: req.body.author.avatar || "/default-avatar.jpg",
        bio: req.body.author.bio || "",
      },
      readTime: req.body.readTime,
      category: req.body.category,
      tags: req.body.tags || [],
      status: req.body.status || "published",
      featured: req.body.featured || false,
    };

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      status: "success",
      message: "Blog created successfully",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// PUT /api/blogs/:id - Update blog (Admin only)
router.put("/:id", auth, validateBlog, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required.",
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Update blog data
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.excerpt = req.body.excerpt;
    blog.image = req.body.image;
    blog.author = {
      name: req.body.author.name,
      avatar: req.body.author.avatar || blog.author.avatar,
      bio: req.body.author.bio || blog.author.bio,
    };
    blog.readTime = req.body.readTime;
    blog.category = req.body.category;
    blog.tags = req.body.tags || blog.tags;
    blog.status = req.body.status || blog.status;
    blog.featured = req.body.featured !== undefined ? req.body.featured : blog.featured;

    await blog.save();

    res.status(200).json({
      status: "success",
      message: "Blog updated successfully",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid blog ID",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// DELETE /api/blogs/:id - Delete blog (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required.",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid blog ID",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// GET /api/blogs/admin/all - Get all blogs for admin (including drafts)
router.get("/admin/all", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const category = req.query.category;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;