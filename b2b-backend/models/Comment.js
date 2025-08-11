import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: [true, "Blog ID is required"],
    index: true,
  },
  author: {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Author email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    avatar: {
      type: String,
      default: function() {
        // Generate a default avatar based on email using Gravatar-style hash
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(this.email.toLowerCase()).digest('hex');
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3B82F6&color=fff&size=40`;
      }
    },
  },
  content: {
    type: String,
    required: [true, "Comment content is required"],
    trim: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "approved", "rejected"],
      message: "Status must be pending, approved, or rejected",
    },
    default: "approved", // Auto-approve for now, can be changed to "pending" if moderation is needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // For potential reply functionality in future
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
});

// Indexes for better performance
commentSchema.index({ blogId: 1, createdAt: -1 });
commentSchema.index({ status: 1 });
commentSchema.index({ "author.email": 1 });

// Pre-save middleware to update updatedAt
commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find approved comments for a blog
commentSchema.statics.findApprovedByBlog = function (blogId, limit = 50) {
  return this.find({ 
    blogId, 
    status: "approved",
    parentCommentId: null // Only root comments for now
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get comment count for a blog
commentSchema.statics.getCommentCount = function (blogId) {
  return this.countDocuments({ 
    blogId, 
    status: "approved",
    parentCommentId: null 
  });
};

// Instance method to check if comment can be edited/deleted
commentSchema.methods.canModify = function (email) {
  return this.author.email === email.toLowerCase();
};

export default mongoose.model("Comment", commentSchema);