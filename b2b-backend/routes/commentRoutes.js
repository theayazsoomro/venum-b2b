import express from "express";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const validateComment = [
  body("author.name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name is required and must be between 1 and 100 characters"),
  body("author.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content is required and must be between 1 and 1000 characters"),
];

// GET /api/comments/blog/:blogId - Get all approved comments for a blog
router.get("/blog/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Get comments with pagination
    const comments = await Comment.find({
      blogId,
      status: "approved",
      parentCommentId: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.getCommentCount(blogId);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
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

// POST /api/comments - Create new comment
router.post("/", validateComment, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { blogId, author, content } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog || blog.status !== "published") {
      return res.status(404).json({
        status: "error",
        message: "Blog not found or not published",
      });
    }

    const commentData = {
      blogId,
      author: {
        name: author.name,
        email: author.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=3B82F6&color=fff&size=40`,
      },
      content,
    };

    const comment = new Comment(commentData);
    await comment.save();

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }
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

// GET /api/comments/:commentId - Get single comment
router.get("/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid comment ID",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// PUT /api/comments/:commentId - Update comment (only by original author)
router.put("/:commentId", validateComment, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if the user can modify this comment
    if (!comment.canModify(req.body.author.email)) {
      return res.status(403).json({
        status: "error",
        message: "You can only edit your own comments",
      });
    }

    // Update only the content (prevent changing author info)
    comment.content = req.body.content;
    comment.status = "approved"; // Re-approve after edit
    await comment.save();

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid comment ID",
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

// DELETE /api/comments/:commentId - Delete comment (only by original author)
router.delete("/:commentId", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required to delete comment",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if the user can modify this comment
    if (!comment.canModify(email)) {
      return res.status(403).json({
        status: "error",
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid comment ID",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// GET /api/comments/stats/:blogId - Get comment statistics for a blog
router.get("/stats/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    const stats = {
      total: await Comment.getCommentCount(blogId),
      pending: await Comment.countDocuments({
        blogId,
        status: "pending",
      }),
      approved: await Comment.countDocuments({
        blogId,
        status: "approved",
      }),
      rejected: await Comment.countDocuments({
        blogId,
        status: "rejected",
      }),
    };

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching comment stats:", error);
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

export default router;