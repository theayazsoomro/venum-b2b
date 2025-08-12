"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const benefits: BenefitItem[] = [
    {
      icon: "📊",
      title: "Market Insights",
      description: "Weekly fitness industry trends and market analysis",
    },
    {
      icon: "💰",
      title: "Exclusive Deals",
      description: "Early access to bulk pricing and special offers",
    },
    {
      icon: "🚀",
      title: "New Products",
      description: "First to know about our latest gym equipment releases",
    },
    {
      icon: "📚",
      title: "Business Tips",
      description: "Expert advice on gym management and operations",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/contact/subscribe-newsletter`,
        {
          email,
        }
      );

      if (response.data.success) {
        setIsSubscribed(true);
      } else {
        throw new Error(response.data.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-3xl text-white">✓</span>
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome Aboard! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You&apos;re now part of our exclusive B2B community. Get ready for
              valuable insights, exclusive deals, and the latest gym industry
              updates delivered straight to your inbox.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-green-600">
              <span className="flex items-center text-sm">
                <span className="mr-2">📧</span>
                Weekly updates
              </span>
              <span className="flex items-center text-sm">
                <span className="mr-2">🎁</span>
                Exclusive offers
              </span>
              <span className="flex items-center text-sm">
                <span className="mr-2">📈</span>
                Industry insights
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <motion.div className="text-white space-y-8" variants={itemVariants}>
            <div>
              <motion.h2
                className="text-5xl font-bold mb-6 leading-tight"
                variants={itemVariants}
              >
                Stay Ahead in the{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Fitness Industry
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-blue-100 leading-relaxed"
                variants={itemVariants}
              >
                Join 5,000+ gym owners and fitness professionals who trust our
                weekly insights to make smarter business decisions and stay
                competitive in the market.
              </motion.p>
            </div>

            {/* Newsletter Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold rounded-lg shadow-xl transition-all duration-200 disabled:opacity-70"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </div>
                    ) : (
                      "Subscribe Now"
                    )}
                  </motion.button>
                </div>
                <p className="text-blue-300 text-sm">
                  🔒 We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </motion.div>
          </motion.div>

          {/* Visual Side */}
          <motion.div className="relative" variants={itemVariants}>
            <div className="relative">
              {/* Main Newsletter Preview */}
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto transform rotate-3"
                variants={imageVariants}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    FitBiz Weekly
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Gym equipment newsletter feature"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold text-sm">
                        This Week&apos;s Focus
                      </p>
                      <p className="text-xs opacity-90">
                        Equipment Trends 2024
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Market Update
                        </p>
                        <p className="text-xs text-gray-600">
                          Q4 fitness equipment sales surge 23%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Featured Deal
                        </p>
                        <p className="text-xs text-gray-600">
                          Bulk resistance bands - 40% off
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Industry Insight
                        </p>
                        <p className="text-xs text-gray-600">
                          Corporate wellness trends to watch
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
