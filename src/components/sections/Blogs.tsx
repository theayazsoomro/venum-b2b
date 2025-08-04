"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types/blogs";

interface BlogsSectionProps {
  blogs?: Omit<Blog, 'content'>[];
}

const BlogsSection: React.FC<BlogsSectionProps> = ({ blogs: propBlogs }) => {
  // Sample blog data - replace with your actual data source
  const defaultBlogs: Omit<Blog, 'content'>[] = [
    {
      id: 1,
      title: "The Future of Web Development",
      excerpt: "Exploring the latest trends and technologies shaping the future of web development in 2025.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "John Doe",
        avatar: "/author-1.jpg",
        bio: "Full-stack developer with 8+ years of experience in modern web technologies."
      },
      date: "March 15, 2025",
      readTime: "5 min read",
      category: "Technology",
      tags: ["Web Development", "Technology", "Future", "Trends"]
    },
    {
      id: 2,
      title: "Mastering React Performance",
      excerpt: "Learn advanced techniques to optimize your React applications for better performance.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "Jane Smith",
        avatar: "/author-2.jpg",
        bio: "React specialist and performance optimization expert."
      },
      date: "March 10, 2025",
      readTime: "7 min read",
      category: "React",
      tags: ["React", "Performance", "Optimization"]
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      excerpt: "Essential design principles every developer should know to create better user experiences.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      author: {
        name: "Mike Johnson",
        avatar: "/author-3.jpg",
        bio: "UI/UX designer with a passion for creating intuitive user experiences."
      },
      date: "March 5, 2025",
      readTime: "4 min read",
      category: "Design",
      tags: ["UI", "UX", "Design", "User Experience"]
    }
  ];

  const blogs = propBlogs || defaultBlogs;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants: Variants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, tutorials, and industry trends.
          </p>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
        >
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              View All Articles
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogsSection;