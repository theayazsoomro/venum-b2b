import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Blog content is required"],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, "Blog excerpt is required"],
    trim: true,
    maxlength: [300, "Excerpt cannot exceed 300 characters"],
  },
  image: {
    type: String,
    required: [true, "Blog image is required"],
  },
  youtubeUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        // YouTube URL validation regex
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}(\S+)?$/i.test(v);
      },
      message: "Please enter a valid YouTube URL"
    }
  },
  author: {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "/default-avatar.jpg",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, "Author bio cannot exceed 200 characters"],
    },
  },
  readTime: {
    type: String,
    required: [true, "Read time is required"],
    default: "5 min read",
  },
  category: {
    type: String,
    required: [true, "Blog category is required"],
    trim: true,
    maxlength: [50, "Category cannot exceed 50 characters"],
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: [30, "Tag cannot exceed 30 characters"],
    },
  ],
  status: {
    type: String,
    enum: {
      values: ["draft", "published", "archived"],
      message: "Status must be draft, published, or archived",
    },
    default: "published",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
blogSchema.index({ title: "text", content: "text" }); // Text search index
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ featured: 1 });

// Pre-save middleware to update updatedAt
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find published blogs
blogSchema.statics.findPublished = function (limit = null) {
  const query = this.find({ status: "published" }).sort({ createdAt: -1 });
  return limit ? query.limit(limit) : query;
};

// Static method to find blogs by category
blogSchema.statics.findByCategory = function (category) {
  return this.find({ 
    category: new RegExp(category, "i"), 
    status: "published" 
  }).sort({ createdAt: -1 });
};

// Static method to find featured blogs
blogSchema.statics.findFeatured = function (limit = 3) {
  return this.find({ 
    status: "published", 
    featured: true 
  }).sort({ createdAt: -1 }).limit(limit);
};

// Instance method to mark as featured
blogSchema.methods.markAsFeatured = function () {
  this.featured = true;
  return this.save();
};

// Instance method to unmark as featured
blogSchema.methods.unmarkAsFeatured = function () {
  this.featured = false;
  return this.save();
};

export default mongoose.model("Blog", blogSchema);