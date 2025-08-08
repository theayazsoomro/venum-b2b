import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  originalPrice: {
    type: Number,
    min: [0, "Original price cannot be negative"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
    maxlength: [100, "Category name cannot exceed 100 characters"],
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [50, "SKU cannot exceed 50 characters"],
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "Status must be either active or inactive",
    },
    default: "active",
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

// Virtual for imageUrl (backward compatibility)
productSchema.virtual("imageUrl").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Indexes for better performance
productSchema.index({ name: "text", description: "text" }); // Text search index

// Pre-save middleware to generate SKU if not provided
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    this.sku = `PRD-${randomSuffix}`;
  }
  next();
});

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category: new RegExp(category, "i"), status: "active" });
};

// Instance method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// Instance method to get bulk price
productSchema.methods.getBulkPrice = function (quantity) {
  if (!this.bulkPricing || this.bulkPricing.length === 0) {
    return this.price;
  }

  // Sort bulk pricing by minQuantity in descending order
  const sortedPricing = this.bulkPricing.sort(
    (a, b) => b.minQuantity - a.minQuantity
  );

  // Find the applicable bulk pricing
  for (let pricing of sortedPricing) {
    if (quantity >= pricing.minQuantity) {
      return pricing.pricePerUnit;
    }
  }

  return this.price;
};

export default mongoose.model("Product", productSchema);
