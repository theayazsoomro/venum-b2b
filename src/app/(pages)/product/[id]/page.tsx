"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { Variants, motion } from "framer-motion";

interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface ProductSpec {
  label: string;
  value: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SingleProductPage({ params }: PageProps) {
  const { id } = use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sample product data
  const product = {
    id: id,
    name: "Commercial Treadmill Pro X1",
    category: "Cardio Equipment",
    brand: "FitnessPro",
    sku: "FP-TM-PRO-X1",
    price: 3299,
    originalPrice: 4199,
    inStock: true,
    stockCount: 24,
    description:
      "The Commercial Treadmill Pro X1 is engineered for high-traffic commercial environments. Featuring a powerful 15HP motor, advanced cushioning system, and intuitive touchscreen display, this treadmill delivers exceptional performance and durability for your fitness facility.",
    features: [
      "15HP Continuous Duty Motor",
      '22" HD Touchscreen Display',
      "Advanced Cushioning System",
      "Heart Rate Monitoring",
      "Bluetooth Connectivity",
      "USB Charging Ports",
      "Emergency Stop System",
      "Commercial Grade Construction",
    ],
    specifications: [
      { label: "Motor Power", value: "15HP Continuous Duty" },
      { label: "Speed Range", value: "0.5 - 12 MPH" },
      { label: "Incline Range", value: "0 - 15%" },
      { label: "Running Surface", value: '22" x 60"' },
      { label: "Maximum User Weight", value: "400 lbs" },
      { label: "Dimensions", value: '85" L x 37" W x 65" H' },
      { label: "Weight", value: "425 lbs" },
      { label: "Warranty", value: "5 Years Parts, 2 Years Labor" },
    ],
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
        alt: "Treadmill Front View",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
        alt: "Console Display",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        alt: "Side Profile",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
        alt: "Motor Assembly",
      },
    ],
    bulkPricing: [
      { quantity: "1-4 units", price: 3299, savings: 0 },
      { quantity: "5-9 units", price: 3099, savings: 200 },
      { quantity: "10-19 units", price: 2899, savings: 400 },
      { quantity: "20+ units", price: 2699, savings: 600 },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        ></motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav className="mb-8" variants={fadeInUp}>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/collections"
              className="hover:text-blue-600 transition-colors"
            >
              Collections
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/collections/${product.category
                .toLowerCase()
                .replace(" ", "-")}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {/* Main Image */}
            <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-square relative">
                <Image
                  width={400}
                  height={400}
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                      isWishlisted
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white/80 text-gray-700 border-white/40 hover:bg-white"
                    }`}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white/80 backdrop-blur-sm border border-white/40 rounded-full hover:bg-white transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    width={400}
                    height={400}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Product Title and Price */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span
                  className={`font-semibold ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {product.inStock && (
                  <span className="ml-2">({product.stockCount} available)</span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white transition-all duration-200 ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="p-2 bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                !product.inStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!product.inStock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </motion.button>

            {/* Product Details Tabs */}
            <div className="mt-6">
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  onClick={() => setSelectedTab("description")}
                  className={`py-2 px-4 text-sm font-medium ${
                    selectedTab === "description"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setSelectedTab("features")}
                  className={`py-2 px-4 text-sm font-medium ${
                    selectedTab === "features"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setSelectedTab("specifications")}
                  className={`py-2 px-4 text-sm font-medium ${
                    selectedTab === "specifications"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setSelectedTab("bulkPricing")}
                  className={`py-2 px-4 text-sm font-medium ${
                    selectedTab === "bulkPricing"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Bulk Pricing
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {selectedTab === "description" && (
                  <motion.p
                    className="text-gray-700"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    {product.description}
                  </motion.p>
                )}
                {selectedTab === "features" && (
                  <motion.ul
                    className="list-disc pl-5 space-y-2 text-gray-700"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </motion.ul>
                )}
                {selectedTab === "specifications" && (
                  <motion.table
                    className="min-w-full divide-y divide-gray-200"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specification
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {spec.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
                {selectedTab === "bulkPricing" && (
                  <motion.table
                    className="min-w-full divide-y divide-gray-200"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Savings
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.bulkPricing.map((pricing, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {pricing.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${pricing.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {pricing.savings > 0
                              ? `$${pricing.savings.toFixed(2)} OFF`
                              : "No Savings"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
