"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

const Backend_Url = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  youtubeUrl?: string;
  createdAt: string;
  readTime: string;
  category: string;
  tags: string[];
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const blogsPerPage = 12;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: blogsPerPage.toString(),
        });
        
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }
        
        const response = await axios.get(`${Backend_Url}/blogs?${params}`);
        
        if (response.data.status === "success") {
          const blogsData = response.data.data.blogs.map((blog: Blog) => ({
            _id: blog._id,
            title: blog.title,
            excerpt: blog.excerpt,
            image: blog.image,
            author: blog.author,
            createdAt: blog.createdAt,
            readTime: blog.readTime,
            category: blog.category,
            tags: blog.tags,
          }));
          
          setBlogs(blogsData);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Use sample data as fallback
        setBlogs(sampleBlogs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, selectedCategory]);

  // Sample blog data as fallback
  const sampleBlogs: Blog[] = [
    {
      _id: "1",
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
      createdAt: "2025-03-15",
      readTime: "5 min read",
      category: "Technology",
      tags: ["Web Development", "Technology", "Future", "Trends"],
    },
    {
      _id: "2",
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
      createdAt: "2025-03-10",
      readTime: "7 min read",
      category: "React",
      tags: ["React", "Performance", "Optimization"],
    },
    {
      _id: "3",
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
      createdAt: "2025-03-05",
      readTime: "4 min read",
      category: "Design",
      tags: ["UI", "UX", "Design", "User Experience"],
    },
  ];

  // Get unique categories for filtering
  const categories = Array.from(new Set(blogs.map(blog => blog.category)));

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

        {/* Filters */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto px-4 sm:px-6 lg:px-8"
          >
            {blogs.map((blog) => (
              <motion.article
                key={blog._id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              >
                <Link href={`/blog/${blog._id}`}>
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
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

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
