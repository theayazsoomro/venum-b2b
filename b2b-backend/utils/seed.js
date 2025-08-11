import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";
dotenv.config();

// Sample products data
const sampleProducts = [
  {
    name: "Professional Laptop",
    price: 1299.99,
    originalPrice: 1499.99,
    description:
      "High-performance laptop perfect for business professionals. Features Intel i7 processor, 16GB RAM, and 512GB SSD.",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593642532973-d31b1c4f5d6f?w=400&h=300&fit=crop",
    ],
    stock: 50,
    sku: "LAP-001",
    status: "active",
  },
  {
    name: "Wireless Bluetooth Headphones",
    price: 199.99,
    originalPrice: 249.99,
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593642532973-d31b1c4f5d6f?w=400&h=300&fit=crop",
    ],
    stock: 100,
    sku: "HEAD-001",
    status: "active",
  },
  {
    name: "Office Desk Chair",
    price: 299.99,
    description:
      "Ergonomic office chair with lumbar support and adjustable height.",
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593642532973-d31b1c4f5d6f?w=400&h=300&fit=crop",
    ],
    stock: 30,
    sku: "CHAIR-001",
    status: "active",
  },
  {
    name: "Smartphone Case",
    price: 29.99,
    originalPrice: 39.99,
    description:
      "Protective smartphone case with shock absorption and wireless charging compatibility.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593642532973-d31b1c4f5d6f?w=400&h=300&fit=crop",
    ],
    stock: 200,
    sku: "CASE-001",
    status: "active",
  },
  {
    name: "LED Monitor 27 inch",
    price: 349.99,
    description: "4K LED monitor with IPS panel and USB-C connectivity.",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593642532973-d31b1c4f5d6f?w=400&h=300&fit=crop",
    ],
    stock: 25,
    sku: "MON-001",
    status: "active",
  },
];

// Sample users data
const sampleUsers = [
  {
    email: "admin@example.com",
    password: "test123",
    role: "admin",
  },
  {
    email: "manager@example.com",
    password: "test123",
    role: "manager",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Existing data cleared");

    // Create users
    console.log("Creating sample users...");
    // Let the User model's pre-save hook handle password hashing
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create products
    console.log("Creating sample products...");
    const createdProducts = await Product.create(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    console.log("\n=== Seed Data Summary ===");
    console.log("Users created:");
    createdUsers.forEach((user) => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    console.log("\nProducts created:");
    createdProducts.forEach((product) => {
      console.log(`  - ${product.name} (${product.sku}) - $${product.price}`);
    });

    console.log("\n=== Login Credentials ===");
    console.log("Admin: admin@example.com / test123");
    console.log("Manager: manager@example.com / test123");
    console.log("Buyer: buyer@example.com / test123");

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();

export default seedDatabase;
