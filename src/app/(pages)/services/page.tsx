"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import {
  Code,
  BriefcaseBusiness,
  Factory,
  Truck,
  ChartNoAxesCombined,
  Box,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: {
    startingPrice: number;
    unit: string;
    minOrder?: number;
  };
  deliveryTime: string;
  category:
    | "consultation"
    | "development"
    | "manufacturing"
    | "logistics"
    | "custom";
  icon: string | React.ReactNode;
  popular?: boolean;
}

interface CustomProductRequest {
  productType: string;
  quantity: number;
  specifications: string;
  budget: string;
  timeline: string;
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  additionalNotes: string;
  productImages: string[]; // Added images array
}

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customRequest, setCustomRequest] = useState<CustomProductRequest>({
    productType: "",
    quantity: 1,
    specifications: "",
    budget: "",
    timeline: "",
    contactInfo: {
      name: "",
      email: "",
      company: "",
      phone: "",
    },
    additionalNotes: "",
    productImages: [], // Initialize empty images array
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const services: Service[] = [
    {
      id: "1",
      title: "Business Consultation",
      description:
        "Strategic business consulting to optimize your operations and growth potential.",
      features: [
        "Market Analysis & Research",
        "Business Process Optimization",
        "Growth Strategy Development",
        "Competitive Analysis",
        "ROI Assessment",
      ],
      pricing: { startingPrice: 150, unit: "per hour" },
      deliveryTime: "1-2 weeks",
      category: "consultation",
      icon: <BriefcaseBusiness className="w-6 h-6" />,
      popular: true,
    },
    {
      id: "2",
      title: "Custom Software Development",
      description:
        "Tailored software solutions designed to meet your specific business requirements.",
      features: [
        "Custom Web Applications",
        "Mobile App Development",
        "API Integration",
        "Database Design",
        "Ongoing Support & Maintenance",
      ],
      pricing: { startingPrice: 5000, unit: "per project", minOrder: 1 },
      deliveryTime: "4-12 weeks",
      category: "development",
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: "3",
      title: "Product Manufacturing",
      description:
        "High-quality manufacturing services for your product specifications.",
      features: [
        "Prototype Development",
        "Mass Production",
        "Quality Control Testing",
        "Packaging Solutions",
        "Supply Chain Management",
      ],
      pricing: { startingPrice: 2, unit: "per unit", minOrder: 500 },
      deliveryTime: "6-16 weeks",
      category: "manufacturing",
      icon: <Factory className="w-6 h-6" />,
    },
    {
      id: "4",
      title: "Logistics & Distribution",
      description:
        "Comprehensive logistics solutions to streamline your supply chain.",
      features: [
        "Warehousing Services",
        "Inventory Management",
        "Global Shipping",
        "Order Fulfillment",
        "Real-time Tracking",
      ],
      pricing: { startingPrice: 50, unit: "per shipment" },
      deliveryTime: "24-72 hours",
      category: "logistics",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      id: "5",
      title: "Digital Marketing Services",
      description:
        "Comprehensive digital marketing to boost your online presence and sales.",
      features: [
        "SEO Optimization",
        "Social Media Management",
        "Content Marketing",
        "PPC Advertising",
        "Analytics & Reporting",
      ],
      pricing: { startingPrice: 1500, unit: "per month" },
      deliveryTime: "2-4 weeks setup",
      category: "consultation",
      icon: <ChartNoAxesCombined className="w-6 h-6" />,
    },
    {
      id: "6",
      title: "Bulk Custom Products",
      description:
        "Large-scale custom product manufacturing with competitive bulk pricing.",
      features: [
        "Minimum 1000+ units",
        "Custom Design & Branding",
        "Premium Materials",
        "Bulk Pricing Discounts",
        "Dedicated Account Manager",
      ],
      pricing: { startingPrice: 1.5, unit: "per unit", minOrder: 1000 },
      deliveryTime: "8-20 weeks",
      category: "custom",
      icon: <Box className="w-6 h-6" />,
      popular: true,
    },
  ];

  const categories = [
    { id: "all", name: "All Services", icon: "🔧" },
    {
      id: "consultation",
      name: "Consultation",
      icon: <BriefcaseBusiness className="w-6 h-6" />,
    },
    {
      id: "development",
      name: "Development",
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      icon: <Factory className="w-6 h-6" />,
    },
    { id: "logistics", name: "Logistics", icon: <Truck className="w-6 h-6" /> },
    {
      id: "custom",
      name: "Custom Products",
      icon: <Box className="w-6 h-6" />,
    },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection with validation
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const currentImageCount =
      customRequest.productImages.length + selectedFiles.length;
    const remainingSlots = 5 - currentImageCount;

    if (files.length > remainingSlots) {
      setSubmitMessage(
        `You can only upload ${remainingSlots} more image(s). Maximum 5 images allowed.`
      );
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        setSubmitMessage(`${file.name} is not a valid image file.`);
        setTimeout(() => setSubmitMessage(""), 3000);
      }
      if (!isValidSize) {
        setSubmitMessage(`${file.name} is too large. Maximum size is 5MB.`);
        setTimeout(() => setSubmitMessage(""), 3000);
      }

      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Convert files to base64 and add to form data
    try {
      const base64Images = await Promise.all(
        validFiles.map((file) => fileToBase64(file))
      );

      setCustomRequest((prev) => ({
        ...prev,
        productImages: [...prev.productImages, ...base64Images],
      }));

      // Create previews
      setImagePreviews((prev) => [...prev, ...base64Images]);
    } catch (error) {
      console.error("Error processing images:", error);
      setSubmitMessage("Error processing images. Please try again.");
      setTimeout(() => setSubmitMessage(""), 3000);
    }

    // Clear input
    event.target.value = "";
  };

  // Remove selected image
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setCustomRequest((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  };

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email to backend with correct data structure
      const response = await axios.post(`${backendUrl}/contact/send-email`, {
        productType: customRequest.productType,
        quantity: customRequest.quantity,
        specifications: customRequest.specifications,
        budget: customRequest.budget,
        timeline: customRequest.timeline,
        contactInfo: customRequest.contactInfo,
        additionalNotes: customRequest.additionalNotes,
        productImages: customRequest.productImages,
      });

      if (response.data.success) {
        setSubmitMessage(
          "Thank you! We'll review your custom product request and get back to you within 24 hours with a detailed quote."
        );

        // Reset form
        setCustomRequest({
          productType: "",
          quantity: 1,
          specifications: "",
          budget: "",
          timeline: "",
          contactInfo: {
            name: "",
            email: "",
            company: "",
            phone: "",
          },
          additionalNotes: "",
          productImages: [],
        });

        // Reset image states
        setSelectedFiles([]);
        setImagePreviews([]);
        setUploadProgress([]);

        setTimeout(() => {
          setShowCustomForm(false);
          setSubmitMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error("Error submitting custom request:", error);
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function
  const resetCustomForm = () => {
    setCustomRequest({
      productType: "",
      quantity: 1,
      specifications: "",
      budget: "",
      timeline: "",
      contactInfo: {
        name: "",
        email: "",
        company: "",
        phone: "",
      },
      additionalNotes: "",
      productImages: [],
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setUploadProgress([]);
    setShowCustomForm(false);
    setSubmitMessage("");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-blue-300">Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Comprehensive B2B solutions designed to accelerate your business
              growth and optimize operations
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCustomForm(true)}
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Custom Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Browse Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 flex rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  layout
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col h-full"
                >
                  {service.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      Popular
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">{service.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {service.title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {service.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{service.description}</p>

                    <div className="space-y-4 mb-6 flex-1">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Key Features:
                        </h4>
                        <ul className="space-y-1">
                          {service.features
                            .slice(0, 3)
                            .map((feature, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 flex items-center"
                              >
                                <span className="text-green-500 mr-2">✓</span>
                                {feature}
                              </li>
                            ))}
                          {service.features.length > 3 && (
                            <li className="text-sm text-gray-500 italic">
                              +{service.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500">Delivery:</span>
                          <span className="font-medium ml-1">
                            {service.deliveryTime}
                          </span>
                        </div>
                        {service.pricing.minOrder && (
                          <div>
                            <span className="text-gray-500">Min Order:</span>
                            <span className="font-medium ml-1">
                              {service.pricing.minOrder}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* This section will be pushed to the bottom */}
                    <div className="border-t pt-4 mt-auto">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-3xl font-bold text-blue-600">
                            ${service.pricing.startingPrice}
                          </span>
                          <span className="text-gray-500 ml-1">
                            {service.pricing.unit}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Starting from
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/services/${service.id}`}
                          className="text-center flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Reach us
                        </Link>
                        {/* <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Details
                        </motion.button> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Bulk Custom Products Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bulk Custom Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Need large quantities of custom products? We specialize in bulk
              manufacturing with competitive pricing and premium quality
              assurance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Minimum Order Quantities
                    </h3>
                    <p className="text-gray-600">
                      Starting from 1,000 units with scalable pricing tiers for
                      larger volumes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Bulk Pricing Benefits
                    </h3>
                    <p className="text-gray-600">
                      Up to 40% savings compared to standard pricing. Volume
                      discounts start at 2,500+ units.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Fast Turnaround
                    </h3>
                    <p className="text-gray-600">
                      Dedicated production lines ensure 8-20 week delivery for
                      most custom products.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Quality Guarantee
                    </h3>
                    <p className="text-gray-600">
                      Rigorous quality control with 99.5% defect-free rate and
                      full warranty coverage.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCustomForm(true)}
                className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Request Bulk Quote
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Volume Pricing Tiers
              </h3>
              <div className="space-y-4">
                {[
                  {
                    range: "1,000 - 2,499 units",
                    discount: "15% off",
                    price: "$1.50/unit",
                  },
                  {
                    range: "2,500 - 4,999 units",
                    discount: "25% off",
                    price: "$1.25/unit",
                  },
                  {
                    range: "5,000 - 9,999 units",
                    discount: "35% off",
                    price: "$1.00/unit",
                  },
                  {
                    range: "10,000+ units",
                    discount: "40% off",
                    price: "$0.85/unit",
                    popular: true,
                  },
                ].map((tier, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      tier.popular
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {tier.range}
                        </p>
                        <p className="text-sm text-gray-600">{tier.discount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {tier.price}
                        </p>
                        {tier.popular && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by 500+ businesses worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🏆",
                title: "10+ Years Experience",
                desc: "Industry expertise across multiple sectors",
              },
              {
                icon: "🌍",
                title: "Global Reach",
                desc: "Serving clients in 50+ countries worldwide",
              },
              {
                icon: "⚡",
                title: "Fast Delivery",
                desc: "Average 2-3 weeks faster than competitors",
              },
              {
                icon: "💯",
                title: "99.8% Satisfaction",
                desc: "Customer satisfaction rate with repeat business",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-600">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Product Request Modal */}
      <AnimatePresence>
        {showCustomForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={resetCustomForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Custom Product Request
                    </h2>
                    <p className="text-gray-600">
                      Tell us about your bulk custom product needs
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetCustomForm}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>

                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg ${
                      submitMessage.includes("Thank you")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}

                <form onSubmit={handleCustomSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={customRequest.productType}
                        onChange={(e) =>
                          setCustomRequest({
                            ...customRequest,
                            productType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Custom branded electronics, Promotional items..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={customRequest.quantity}
                        onChange={(e) =>
                          setCustomRequest({
                            ...customRequest,
                            quantity: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minimum 1,000 units"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Specifications *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={customRequest.specifications}
                      onChange={(e) =>
                        setCustomRequest({
                          ...customRequest,
                          specifications: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed specifications: dimensions, materials, colors, features, branding requirements, etc."
                    />
                  </div>

                  {/* Product Images Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Reference Images (Max 5 images, 5MB each)
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload images of similar products, sketches, or design
                      concepts to help us understand your requirements better.
                    </p>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="productImageUpload"
                        disabled={customRequest.productImages.length >= 5}
                      />
                      <label
                        htmlFor="productImageUpload"
                        className={`cursor-pointer ${
                          customRequest.productImages.length >= 5
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        <div className="text-gray-400 mb-2">
                          <svg
                            className="mx-auto h-12 w-12"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                          {customRequest.productImages.length >= 5
                            ? "Maximum 5 images reached"
                            : "Click to upload images or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB (
                          {customRequest.productImages.length}/5)
                        </p>
                      </label>
                    </div>

                    {/* Image Preview Grid */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={preview}
                              alt={`Product reference ${index + 1}`}
                              width={120}
                              height={120}
                              className="h-24 w-full object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ✕
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        value={customRequest.budget}
                        onChange={(e) =>
                          setCustomRequest({
                            ...customRequest,
                            budget: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $15,000">
                          $5,000 - $15,000
                        </option>
                        <option value="$15,000 - $50,000">
                          $15,000 - $50,000
                        </option>
                        <option value="$50,000 - $100,000">
                          $50,000 - $100,000
                        </option>
                        <option value="$100,000+">$100,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline *
                      </label>
                      <select
                        required
                        value={customRequest.timeline}
                        onChange={(e) =>
                          setCustomRequest({
                            ...customRequest,
                            timeline: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select timeline</option>
                        <option value="ASAP (Rush order)">
                          ASAP (Rush order)
                        </option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="3-4 months">3-4 months</option>
                        <option value="4-6 months">4-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customRequest.contactInfo.name}
                          onChange={(e) =>
                            setCustomRequest({
                              ...customRequest,
                              contactInfo: {
                                ...customRequest.contactInfo,
                                name: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={customRequest.contactInfo.email}
                          onChange={(e) =>
                            setCustomRequest({
                              ...customRequest,
                              contactInfo: {
                                ...customRequest.contactInfo,
                                email: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={customRequest.contactInfo.company}
                          onChange={(e) =>
                            setCustomRequest({
                              ...customRequest,
                              contactInfo: {
                                ...customRequest.contactInfo,
                                company: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={customRequest.contactInfo.phone}
                          onChange={(e) =>
                            setCustomRequest({
                              ...customRequest,
                              contactInfo: {
                                ...customRequest.contactInfo,
                                phone: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      value={customRequest.additionalNotes}
                      onChange={(e) =>
                        setCustomRequest({
                          ...customRequest,
                          additionalNotes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional requirements, questions, or special considerations..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetCustomForm}
                      className="px-8 py-3 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join thousands of satisfied clients who trust us with their
              business needs. Get your free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCustomForm(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Free Quote
              </motion.button>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
