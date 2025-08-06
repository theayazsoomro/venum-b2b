"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/constants/Product";
import { Products } from "@/data/Products";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  // Sample product data
  const products: Product[] = Products;
  const { addItem } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants: Variants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const cardVariants: Variants = {
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

  // Function to handle adding product to cart
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.image,
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="">
        {/* Section Header */}
        <motion.section
          className="relative h-96 bg-blue-600 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
              alt="Blog Background"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <div className="flex items-center space-x-4 mb-4"></div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                All Products
              </h1>
            </motion.div>
          </div>
        </motion.section>

        {/* Product Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto px-4 sm:px-6 lg:px-8 mt-12"
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              className="flex-shrink-0 w-full "
              variants={cardVariants}
              onMouseEnter={() => setHoveredProduct(product._id)}
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
                <Link href={`/product/${product._id}`}>
                  <div className="relative mb-1 overflow-hidden rounded-tr-xl rounded-tl-xl">
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
                        opacity: hoveredProduct === product._id ? 1 : 0,
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
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Quote
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
