"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  // Sample blog data
  const blogs = [
    {
      id: 1,
      title: "The Future of Web Development",
      excerpt:
        "Exploring the latest trends and technologies shaping the future of web development in 2025.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "John Doe",
        avatar: "/author-1.jpg",
        bio: "Full-stack developer with 8+ years of experience in modern web technologies.",
      },
      date: "March 15, 2025",
      readTime: "5 min read",
      category: "Technology",
      tags: ["Web Development", "Technology", "Future", "Trends"],
    },
    {
      id: 2,
      title: "Mastering React Performance",
      excerpt:
        "Learn advanced techniques to optimize your React applications for better performance.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "Jane Smith",
        avatar: "/author-2.jpg",
        bio: "React specialist and performance optimization expert.",
      },
      date: "March 10, 2025",
      readTime: "7 min read",
      category: "React",
      tags: ["React", "Performance", "Optimization"],
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      excerpt:
        "Essential design principles every developer should know to create better user experiences.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "Mike Johnson",
        avatar: "/author-3.jpg",
        bio: "UI/UX designer with a passion for creating intuitive user experiences.",
      },
      date: "March 5, 2025",
      readTime: "4 min read",
      category: "Design",
      tags: ["UI", "UX", "Design", "User Experience"],
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      excerpt:
        "Essential design principles every developer should know to create better user experiences.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "Mike Johnson",
        avatar: "/author-3.jpg",
        bio: "UI/UX designer with a passion for creating intuitive user experiences.",
      },
      date: "March 5, 2025",
      readTime: "4 min read",
      category: "Design",
      tags: ["UI", "UX", "Design", "User Experience"],
    },
  ];

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
                All Blogs
              </h1>
            </motion.div>
          </div>
        </motion.section>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto px-4 sm:px-6 lg:px-8 mt-12"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              <Link href={`/blog/${blog.id}`}>
                <motion.div variants={cardHoverVariants}>
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Blog Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{blog.author.name}</span>
                        <span>•</span>
                        <span>{blog.date}</span>
                      </div>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Blogs Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        ></motion.div>
      </div>
    </section>
  );
}
