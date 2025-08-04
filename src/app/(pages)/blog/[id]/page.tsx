"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featuredImage: string;
  relatedPosts: RelatedPost[];
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readTime: number;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  publishedAt: string;
  avatar: string;
}

const SingleBlogPage: React.FC = () => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      content:
        "Great insights on bulk purchasing! This really helped us optimize our gym equipment procurement process.",
      publishedAt: "2024-08-01",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: "2",
      author: "Mike Chen",
      content:
        "The ROI calculations you mentioned are spot on. We've seen similar results with our corporate wellness program.",
      publishedAt: "2024-08-02",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  ]);
  const [newComment, setNewComment] = useState<string>("");

  // Mock blog post data
  const blogPost: BlogPost = {
    id: "1",
    title:
      "The Complete Guide to Bulk Gym Equipment Purchasing for Corporate Wellness Programs",
    excerpt:
      "Learn how to optimize your corporate wellness budget while maximizing employee satisfaction through strategic bulk equipment purchasing.",
    content: `
    <p>Corporate wellness programs have become a cornerstone of modern workplace culture, with companies investing billions annually to keep their workforce healthy and productive. One of the most effective strategies for building a comprehensive wellness program is strategic bulk purchasing of gym equipment.</p>

    <h2>Understanding the Corporate Wellness Landscape</h2>
    <p>The corporate wellness industry has experienced unprecedented growth, with market size reaching $58 billion globally. Companies are recognizing that employee health directly impacts productivity, retention, and overall business success.</p>

    <p>When planning your corporate gym setup, consider these key factors:</p>
    <ul>
      <li><strong>Employee Demographics:</strong> Age groups, fitness levels, and preferences</li>
      <li><strong>Available Space:</strong> Square footage and layout constraints</li>
      <li><strong>Budget Allocation:</strong> Initial investment vs. long-term maintenance costs</li>
      <li><strong>Usage Patterns:</strong> Peak hours and equipment rotation</li>
    </ul>

    <h2>The Economics of Bulk Purchasing</h2>
    <p>Smart procurement can reduce equipment costs by 30-45% compared to retail purchases. Our data shows that companies ordering 500+ units typically achieve the best price-to-value ratio.</p>

    <blockquote>
      "We reduced our equipment costs by 40% through strategic bulk purchasing, allowing us to invest the savings in additional wellness programs." - Jennifer Martinez, HR Director at TechCorp
    </blockquote>

    <h2>Essential Equipment Categories for Corporate Gyms</h2>
    <p>Based on usage analytics from 200+ corporate installations, here are the most popular equipment categories:</p>

    <h3>1. Cardio Equipment (35% of budget)</h3>
    <p>Treadmills, ellipticals, and stationary bikes remain the foundation of any corporate gym. These machines accommodate various fitness levels and are perfect for stress relief during lunch breaks.</p>

    <h3>2. Strength Training (30% of budget)</h3>
    <p>Adjustable dumbbells, resistance bands, and functional trainers provide comprehensive strength training options without requiring extensive space.</p>

    <h3>3. Accessories & Small Equipment (20% of budget)</h3>
    <p>Yoga mats, resistance bands, kettlebells, and foam rollers are cost-effective additions that maximize versatility.</p>

    <h3>4. Recovery & Wellness (15% of budget)</h3>
    <p>Massage chairs, stretching areas, and recovery tools help employees unwind and prevent injuries.</p>

    <h2>Implementation Best Practices</h2>
    <p>Successful corporate gym implementations follow these proven strategies:</p>

    <h3>Phase 1: Assessment and Planning</h3>
    <p>Conduct employee surveys to understand preferences and usage patterns. This data drives equipment selection and layout decisions.</p>

    <h3>Phase 2: Strategic Procurement</h3>
    <p>Leverage bulk purchasing power to negotiate better terms. Consider leasing options for expensive cardio equipment to preserve capital.</p>

    <h3>Phase 3: Installation and Training</h3>
    <p>Professional installation ensures safety and longevity. Staff training programs maximize equipment utilization and minimize maintenance issues.</p>

    <h2>Measuring Success and ROI</h2>
    <p>Track these key metrics to demonstrate program value:</p>
    <ul>
      <li>Employee participation rates (target: 40-60%)</li>
      <li>Reduced healthcare claims (average: 15-25% decrease)</li>
      <li>Improved employee satisfaction scores</li>
      <li>Decreased absenteeism rates</li>
    </ul>

    <p>Companies typically see full ROI within 18-24 months through reduced healthcare costs and improved productivity.</p>

    <h2>Future Trends in Corporate Wellness</h2>
    <p>The industry is evolving toward more personalized, technology-integrated solutions. Wearable device integration, AI-powered workout recommendations, and virtual training programs are becoming standard features.</p>

    <p>As we move forward, the most successful corporate wellness programs will be those that combine strategic equipment procurement with comprehensive employee engagement strategies.</p>
    `,
    author: {
      name: "David Rodriguez",
      role: "Corporate Wellness Specialist",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "David has over 10 years of experience designing corporate wellness programs for Fortune 500 companies. He specializes in equipment procurement and employee engagement strategies.",
    },
    publishedAt: "2024-08-04",
    readTime: 8,
    category: "Corporate Wellness",
    tags: [
      "Bulk Purchasing",
      "Corporate Gym",
      "Equipment",
      "ROI",
      "Wellness Programs",
    ],
    featuredImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    relatedPosts: [
      {
        id: "2",
        title: "5 Essential Gym Equipment Pieces Every Corporate Office Needs",
        excerpt:
          "Discover the must-have equipment that delivers maximum impact for your corporate wellness program.",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
        publishedAt: "2024-07-28",
        readTime: 5,
      },
      {
        id: "3",
        title:
          "ROI Calculator: Measuring the Success of Your Corporate Gym Investment",
        excerpt:
          "Learn how to calculate and demonstrate the return on investment for your workplace fitness program.",
        image:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop",
        publishedAt: "2024-07-25",
        readTime: 6,
      },
      {
        id: "4",
        title: "Employee Engagement Strategies for Corporate Fitness Programs",
        excerpt:
          "Proven tactics to increase participation and maximize the impact of your workplace wellness initiatives.",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
        publishedAt: "2024-07-22",
        readTime: 7,
      },
    ],
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment,
      publishedAt: new Date().toISOString().split("T")[0],
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen mt-16 bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative h-96 bg-blue-600 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <Image
            src={blogPost.featuredImage}
            alt={blogPost.title}
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
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {blogPost.category}
              </span>
              <span className="text-blue-200">•</span>
              <span className="text-blue-200">
                {blogPost.readTime} min read
              </span>
              <span className="text-blue-200">•</span>
              <span className="text-blue-200">
                {new Date(blogPost.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {blogPost.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              {blogPost.excerpt}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <motion.article className="lg:col-span-2" variants={itemVariants}>
            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Image
                src={blogPost.author.avatar}
                alt={blogPost.author.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {blogPost.author.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  {blogPost.author.role}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {blogPost.author.bio}
                </p>
              </div>
              <motion.button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isBookmarked
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </motion.button>
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
                style={{
                  fontSize: "18px",
                  lineHeight: "1.8",
                  color: "#374151",
                }}
              />
            </div>

            {/* Tags */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 cursor-pointer transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <motion.button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="#comments">Post Comment</Link>
                </motion.button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="flex space-x-4 p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* <Image
                      src={comment.avatar}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    /> */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {comment.author}
                        </h4>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside className="space-y-8" variants={itemVariants}>
            {/* Newsletter Signup */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Get the latest insights on corporate wellness and bulk equipment
                purchasing.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-100 focus:outline-none border-1 border-white/30 bg-blue-700 placeholder-gray-200 "
                />
                <motion.button
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Related Articles
              </h3>
              <div className="space-y-6">
                {blogPost.relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="group cursor-pointer"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Share This Article
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["LinkedIn", "Twitter", "Facebook", "Email"].map(
                  (platform) => (
                    <motion.button
                      key={platform}
                      className="flex items-center justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {platform}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
};

export default SingleBlogPage;
