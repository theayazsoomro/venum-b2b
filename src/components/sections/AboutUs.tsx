"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

const AboutSection = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: ["easeOut"],
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images Section */}
          <motion.div className="relative" variants={itemVariants}>
            <div className="grid grid-cols-2 gap-6">
              {/* Main large image */}
              <motion.div className="col-span-2 relative h-96 rounded-lg overflow-hidden shadow-2xl shadow-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Modern corporate gym facility with state-of-the-art equipment"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.div variants={itemVariants}>
              <motion.h2
                className="text-5xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                About{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FitCorp
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 leading-relaxed mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                We're revolutionizing corporate wellness through innovative
                fitness solutions. As industry pioneers, we design and implement
                comprehensive gym facilities that transform workplace culture,
                boost employee satisfaction, and drive measurable business
                results. From Fortune 500 companies to growing startups, we
                create fitness environments that inspire healthier, more
                productive teams.
              </motion.p>
            </motion.div>

            {/* CTA Section */}
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/about">Read More</Link>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
