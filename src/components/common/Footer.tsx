"use client";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
  FileText,
  Shield,
  Users,
  Award,
} from "lucide-react";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const socialVariants = {
    hover: {
      scale: 1.1,
      transition: { stiffness: 300 },
    },
  };

  const linkVariants = {
    hover: {
      x: 5,
      color: "#2563eb",
      transition: { duration: 0.2 },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 bg-blue-600 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-600 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <motion.h2
                className="text-3xl font-bold text-white"
                whileHover={{ scale: 1.02 }}
              >
                Venum B2B
              </motion.h2>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering businesses with innovative technology solutions,
                strategic consulting, and enterprise-grade services to drive
                growth and operational excellence.
              </p>

              {/* Trust indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <motion.div
                  className="flex items-center space-x-2 text-gray-400"
                  whileHover={{ scale: 1.05, color: "#60a5fa" }}
                >
                  <Shield size={20} />
                  <span className="text-sm">SOC 2 Certified</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 text-gray-400"
                  whileHover={{ scale: 1.05, color: "#60a5fa" }}
                >
                  <Award size={20} />
                  <span className="text-sm">ISO 27001</span>
                </motion.div>
              </div>

              <div className="flex space-x-4 pt-2">
                {[
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Mail, href: "#", label: "Email" },
                ].map(({ Icon, href, label }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 border border-slate-700 hover:border-blue-500"
                    variants={socialVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Solutions */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Solutions</h3>
              <div className="space-y-3">
                {[
                  "Enterprise Software",
                  "Cloud Migration",
                  "Data Analytics",
                  "AI & Automation",
                  "Cybersecurity",
                ].map((solution, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                    variants={linkVariants}
                  >
                    {solution}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <div className="space-y-3">
                {[
                  "About Us",
                  "Leadership",
                  "Careers",
                  "Case Studies",
                  "Partners",
                ].map((item, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                    variants={linkVariants}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Resources & Support */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <div className="space-y-3">
                {[
                  "Documentation",
                  "API Reference",
                  "Support Center",
                  "Training",
                  "Webinars",
                ].map((resource, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                    variants={linkVariants}
                  >
                    {resource}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-slate-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div className="flex items-center space-x-3 text-gray-400">
                <MapPin size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium">Headquarters</p>
                  <p className="text-sm">
                    123 Business Plaza, Suite 500
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-center space-x-3 text-gray-400">
                <Phone size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium">Sales</p>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
              </motion.div>

              <motion.div className="flex items-center space-x-3 text-gray-400">
                <Users size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium">Support</p>
                  <p className="text-sm">24/7 Enterprise Support</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-slate-700 bg-slate-900/50"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>&copy; 2024 Venum B2B. All rights reserved.</p>
                <div className="flex space-x-6">
                  <motion.a
                    href="#"
                    className="hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Privacy Policy
                  </motion.a>
                  <motion.a
                    href="#"
                    className="hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Terms of Service
                  </motion.a>
                  <motion.a
                    href="#"
                    className="hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Cookie Policy
                  </motion.a>
                </div>
              </div>

              {/* <motion.button
                onClick={scrollToTop}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <ArrowUp size={18} />
              </motion.button> */}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
