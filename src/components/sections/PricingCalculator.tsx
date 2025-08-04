"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";

interface PricingTier {
  min: number;
  max: number;
  discount: number;
  name: string;
  color: string;
}

interface ProductType {
  id: string;
  name: string;
  unitPrice: number;
  icon: string;
  description: string;
  minOrder: number;
}

const BulkPricingCalculator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("gym-gloves");
  const [quantity, setQuantity] = useState<number>(100);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<string>("");
  const [savings, setSavings] = useState<number>(0);

  const productTypes: ProductType[] = [
    {
      id: "gym-gloves",
      name: "Gym Gloves",
      unitPrice: 12.99,
      icon: "🧤",
      description: "Premium workout gloves with grip padding",
      minOrder: 50,
    },
    {
      id: "resistance-bands",
      name: "Resistance Bands",
      unitPrice: 8.5,
      icon: "🎯",
      description: "High-quality resistance training bands",
      minOrder: 100,
    },
    {
      id: "yoga-mats",
      name: "Yoga Mats",
      unitPrice: 24.99,
      icon: "🧘",
      description: "Non-slip premium yoga mats",
      minOrder: 25,
    },
    {
      id: "protein-shakers",
      name: "Protein Shakers",
      unitPrice: 6.75,
      icon: "🥤",
      description: "BPA-free protein shaker bottles",
      minOrder: 200,
    },
    {
      id: "gym-towels",
      name: "Gym Towels",
      unitPrice: 4.25,
      icon: "🏃",
      description: "Microfiber quick-dry gym towels",
      minOrder: 500,
    },
    {
      id: "water-bottles",
      name: "Water Bottles",
      unitPrice: 9.99,
      icon: "💧",
      description: "Insulated stainless steel bottles",
      minOrder: 100,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      min: 1,
      max: 49,
      discount: 0,
      name: "Retail",
      color: "from-gray-400 to-gray-500",
    },
    {
      min: 50,
      max: 99,
      discount: 15,
      name: "Small Bulk",
      color: "from-blue-400 to-blue-500",
    },
    {
      min: 100,
      max: 499,
      discount: 25,
      name: "Medium Bulk",
      color: "from-purple-400 to-purple-500",
    },
    {
      min: 500,
      max: 999,
      discount: 35,
      name: "Large Bulk",
      color: "from-green-400 to-green-500",
    },
    {
      min: 1000,
      max: Infinity,
      discount: 45,
      name: "Wholesale",
      color: "from-yellow-400 to-yellow-500",
    },
  ];

  useEffect(() => {
    const selectedProductData = productTypes.find(
      (p) => p.id === selectedProduct
    );
    if (!selectedProductData) return;

    const tier = pricingTiers.find(
      (t) => quantity >= t.min && quantity <= t.max
    );

    if (tier) {
      const discountAmount =
        (selectedProductData.unitPrice * tier.discount) / 100;
      const discountedUnitPrice =
        selectedProductData.unitPrice - discountAmount;
      const total = discountedUnitPrice * quantity;
      const totalSavings = discountAmount * quantity;

      setDiscount(tier.discount);
      setUnitPrice(discountedUnitPrice);
      setTotalPrice(total);
      setCurrentTier(tier.name);
      setSavings(totalSavings);
    }
  }, [selectedProduct, quantity]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const currentTierData = pricingTiers.find(
    (t) => quantity >= t.min && quantity <= t.max
  );
  const selectedProductData = productTypes.find(
    (p) => p.id === selectedProduct
  );

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Bulk Pricing{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant bulk pricing for gym products. Order more and save big
            with our wholesale pricing tiers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Select Your Products
            </h3>

            {/* Product Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Choose Product Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productTypes.map((product) => (
                  <motion.button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product.id);
                      if (quantity < product.minOrder) {
                        setQuantity(product.minOrder);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      selectedProduct === product.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{product.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          ${product.unitPrice}/unit
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Min: {product.minOrder} units
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Quantity:{" "}
                <span className="text-blue-600">
                  {quantity.toLocaleString()} units
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={ 1}
                  max="1000"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>500</span>
                  <span>1,000</span>
                </div>
              </div>
            </div>

            {/* Quick Quantity Buttons */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Quick Select
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[50, 100, 500, 1000].map((qty) => (
                  <motion.button
                    key={qty}
                    onClick={() => setQuantity(qty)}
                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 text-sm ${
                      quantity === qty
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {qty.toLocaleString()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Tier Display */}
            {currentTierData && (
              <motion.div
                className={`bg-gradient-to-r ${currentTierData.color} rounded-2xl p-6 text-white mb-6`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">
                      {currentTierData.name} Pricing
                    </h4>
                    <p className="text-white/90">
                      {currentTierData.discount > 0
                        ? `${currentTierData.discount}% bulk discount applied`
                        : "Retail pricing"}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {currentTierData.discount > 0 ? "💰" : "🛒"}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Pricing Display */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Price Breakdown Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Price Breakdown
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Product</span>
                  <span className="font-semibold">
                    {selectedProductData?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Retail Price per Unit</span>
                  <span className="font-semibold">
                    ${selectedProductData?.unitPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold">
                    {quantity.toLocaleString()} units
                  </span>
                </div>
                {discount > 0 && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 text-green-600">
                      <span>Bulk Discount ({currentTier})</span>
                      <span className="font-semibold">-{discount}%</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 text-blue-600">
                      <span>Your Price per Unit</span>
                      <span className="font-semibold">
                        ${unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <motion.div
                className="bg-blue-600 rounded-2xl p-6 text-white"
                key={totalPrice}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <p className="text-blue-200 mb-2">Total Order Value</p>
                  <p className="text-4xl font-bold mb-2">
                    ${totalPrice.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-sm">
                    ${unitPrice.toFixed(2)} per unit
                  </p>
                  {savings > 0 && (
                    <div className="mt-4 bg-green-500/20 rounded-xl p-3">
                      <p className="text-green-300 text-lg font-semibold">
                        💰 You Save: ${savings.toLocaleString()}
                      </p>
                      <p className="text-green-200 text-sm">
                        vs. retail pricing
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Pricing Tiers Overview */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Volume Discounts
              </h3>
              <div className="space-y-3">
                {pricingTiers.map((tier, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      tier.name === currentTier
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-gray-900">
                        {tier.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        (
                        {tier.min === 2500
                          ? "2,500+"
                          : `${tier.min.toLocaleString()}-${tier.max.toLocaleString()}`}{" "}
                        units)
                      </span>
                    </div>
                    <span
                      className={`font-bold ${
                        tier.discount > 0 ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {tier.discount > 0 ? `-${tier.discount}%` : "Retail"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-bold shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Quote
              </motion.button>
              <motion.button
                className="bg-white border-2 border-blue-500 text-blue-600 py-4 px-6 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300"
                whileHover={{ scale: 1.02, }}
                whileTap={{ scale: 0.98 }}
              >
                View Items
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default BulkPricingCalculator;
