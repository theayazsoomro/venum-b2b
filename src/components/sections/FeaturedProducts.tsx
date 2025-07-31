"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import { Products } from "@/data/Products";
import { Product } from "@/constants/Product"; // Importing Product interface

interface FeaturedProductsProps {
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // products data
  const products: Product[] = Products;

  const itemsPerView = 3;
  const maxSlide = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      className={`relative bg-white/95 overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
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

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <motion.h2
            className="text-2xl lg:text-4xl font-bold text-slate-800 mb-6"
            variants={itemVariants}
          >
            Featured Products
          </motion.h2>
        </motion.div>

        {/* Carousel Container */}
        <motion.div className="relative" variants={itemVariants}>
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
            <motion.button
              onClick={prevSlide}
              className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
            <motion.button
              onClick={nextSlide}
              className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Products Carousel */}
          <div className="rounded-2xl">
            <motion.div
              className="flex gap-8"
              animate={{ x: `${-currentSlide * (100 / itemsPerView)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm border border-white/40 shadow-xl h-full rounded-xl"
                    whileHover={{
                      y: -10,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Product Image */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative mb-6 overflow-hidden rounded-tr-xl rounded-tl-xl">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-72 object-cover"
                        />

                        {/* Hover Actions */}
                        <motion.div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-4"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: hoveredProduct === product.id ? 1 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        ></motion.div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="space-y-4 p-4">
                      <div>
                        <p className="text-sm text-blue-600 font-medium mb-1">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {product.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Bulk pricing available
                          </p>
                        </div>

                        <motion.button
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <Link href="/contact">Add to Quote</Link>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center space-x-4"
            variants={itemVariants}
          >
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg "
            >
              <span>View All Products</span>
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>

            <motion.button
              className="inline-flex items-center px-8 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 text-gray-800 rounded-xl font-semibold text-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="mr-2 w-5 h-5" />
              Get Bulk Quote
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedProducts;
