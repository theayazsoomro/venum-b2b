"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Users, TrendingUp, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
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
      className={`relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
        ></motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        ></motion.div>
      </div>

      {/* Grid Pattern Overlay */}
      {/* <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.3 }}
      ></motion.div> */}

      <div className="relative container mx-auto sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div className="space-y-8" variants={slideInLeft}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 text-sm font-medium"
              variants={scaleUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200">
                Powering 10,000+ Fitness Facilities
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={staggerContainer}>
              <motion.h1
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
                variants={fadeInUp}
              >
                Equip Your Gym
                <motion.span
                  className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  variants={fadeInUp}
                >
                  for Success
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
                variants={fadeInUp}
              >
                Scale your fitness business with our comprehensive wholesale
                marketplace. Premium equipment, competitive pricing, and
                seamless procurement for gyms of all sizes.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Link
                  href="/get-started"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-lg "
                >
                  <motion.span
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Buy Bulk Now
                  </motion.span>
                  <motion.div
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.button
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-lg transition-all duration-200"
                variants={fadeInUp}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="mr-2 w-5 h-5" />
                Schedule Consultation
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center space-x-8 text-sm text-gray-400"
              variants={staggerContainer}
            >
              <motion.div
                className="flex items-center space-x-2"
                variants={fadeInUp}
              >
                <Shield className="w-5 h-5 text-green-400" />
                <span>Top Notch Quality</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                variants={fadeInUp}
              >
                <Users className="w-5 h-5 text-blue-400" />
                <span>Bulk Pricing Available</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                variants={fadeInUp}
              >
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Flexible Payment Terms</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div className="relative" variants={slideInRight}>
            <motion.div
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Mock Dashboard */}
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* Header */}
                <motion.div
                  className="flex items-center justify-between"
                  variants={fadeInUp}
                >
                  <h3 className="text-lg font-semibold text-white">
                    Sales Dashboard
                  </h3>
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-3 h-3 bg-red-400 rounded-full"
                      variants={scaleUp}
                    ></motion.div>
                    <motion.div
                      className="w-3 h-3 bg-yellow-400 rounded-full"
                      variants={scaleUp}
                    ></motion.div>
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      variants={scaleUp}
                    ></motion.div>
                  </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={staggerContainer}
                >
                  <motion.div
                    className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30"
                    variants={fadeInUp}
                  >
                    <motion.div
                      className="text-2xl font-bold text-blue-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      $2.4M
                    </motion.div>
                    <div className="text-sm text-blue-200">Monthly Revenue</div>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30"
                    variants={fadeInUp}
                  >
                    <motion.div
                      className="text-2xl font-bold text-green-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1.4,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      +156%
                    </motion.div>
                    <div className="text-sm text-green-200">Growth Rate</div>
                  </motion.div>
                </motion.div>

                {/* Chart Placeholder */}
                <motion.div
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20"
                  variants={fadeInUp}
                >
                  <motion.div
                    className="flex items-end space-x-2 h-32"
                    variants={staggerContainer}
                  >
                    {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 95].map(
                      (height, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-t from-purple-400 to-pink-400 rounded-t flex-1 opacity-70"
                          style={{ height: `${height}%` }}
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 0.7 }}
                          transition={{
                            delay: 1.5 + index * 0.1,
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100,
                          }}
                          whileHover={{
                            scaleY: 1.1,
                            opacity: 1,
                            boxShadow: "0 4px 15px rgba(168, 85, 247, 0.4)",
                          }}
                        ></motion.div>
                      )
                    )}
                  </motion.div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div className="space-y-3" variants={staggerContainer}>
                  <motion.h4
                    className="text-sm font-medium text-gray-300"
                    variants={fadeInUp}
                  >
                    Recent Orders
                  </motion.h4>
                  {[
                    {
                      company: "FitZone Franchise",
                      amount: "$45,750",
                      status: "Delivered",
                    },
                    {
                      company: "PowerGym Network",
                      amount: "$28,900",
                      status: "In Transit",
                    },
                    {
                      company: "Elite Fitness Co.",
                      amount: "$67,250",
                      status: "Processing",
                    },
                  ].map((order, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-white/10"
                      variants={fadeInUp}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.company}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.amount}
                        </div>
                      </div>
                      <motion.span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : order.status === "Processing"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {order.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 2,
                }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 2.5,
                }}
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section - Client Logos */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.p
            className="text-center text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            Trusted by leading fitness brands
          </motion.p>
          <motion.div
            className="flex items-center justify-center md:flex-row flex-col Ffl space-x-12 opacity-60"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              "GOLD'S GYM",
              "PLANET FITNESS",
              "LA FITNESS",
              "GOD'S GYM",
              "LIFETIME FITNESS",
            ].map((company, index) => (
              <motion.div
                key={index}
                className="text-2xl font-bold text-gray-500"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.1,
                  color: "#9CA3AF",
                  opacity: 1,
                }}
                transition={{ delay: 2.4 + index * 0.1 }}
              >
                {company}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
