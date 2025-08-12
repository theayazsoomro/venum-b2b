"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import axios from "axios";
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/utils/youtube";
import { UserRound } from "lucide-react";

const Backend_Url = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  createdAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  youtubeUrl?: string;
  status: string;
  featured: boolean;
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
  _id: string;
  blogId: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface CommentFormData {
  name: string;
  email: string;
  content: string;
}

const SingleBlogPage: React.FC = () => {
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentFormData, setCommentFormData] = useState<CommentFormData>({
    name: "",
    email: "",
    content: "",
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [email, setEmail] = useState<string>("");

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);

        // Fetch the specific blog post
        const response = await axios.get(`${Backend_Url}/blogs/${params.id}`);

        if (response.data.status === "success") {
          setBlogPost(response.data.data.blog);

          // Fetch related posts (other blogs from same category, excluding current)
          const relatedResponse = await axios.get(
            `${Backend_Url}/blogs?category=${response.data.data.blog.category}&limit=3`
          );

          if (relatedResponse.data.status === "success") {
            const related = relatedResponse.data.data.blogs
              .filter((blog: BlogPost) => blog._id !== params.id)
              .slice(0, 3)
              .map((blog: BlogPost) => ({
                id: blog._id,
                title: blog.title,
                excerpt: blog.excerpt,
                image: blog.image,
                publishedAt: blog.createdAt,
                readTime: blog.readTime,
              }));
            setRelatedPosts(related);
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await axios.get(
          `${Backend_Url}/comments/blog/${params.id}`
        );

        if (response.data.status === "success") {
          setComments(response.data.data.comments || []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (params.id) {
      fetchBlogPost();
      fetchComments();
    }
  }, [params.id]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen mt-16 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show 404 if no blog post found
  if (!blogPost) {
    notFound();
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !commentFormData.name.trim() ||
      !commentFormData.email.trim() ||
      !commentFormData.content.trim()
    ) {
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await axios.post(`${Backend_Url}/comments`, {
        blogId: params.id,
        author: {
          name: commentFormData.name,
          email: commentFormData.email,
        },
        content: commentFormData.content,
      });

      if (response.data.status === "success") {
        // Add the new comment to the list
        setComments([response.data.data.comment, ...comments]);
        // Reset form
        setCommentFormData({ name: "", email: "", content: "" });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle newsletter subscription
  const handleSubscribeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(
        `${Backend_Url}/contact/subscribe-newsletter`,
        { email }
      );

      if (response.data.success) {
        alert("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("Something went wrong. Please try again.");
    }
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
            src={blogPost.image}
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
              <span className="text-blue-200">{blogPost.readTime}</span>
              <span className="text-blue-200">•</span>
              <span className="text-blue-200">
                {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
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
                <p className="text-blue-600 text-sm font-medium">Author</p>
                <p className="text-gray-600 text-sm mt-1">
                  {blogPost.author.bio || "Blog contributor"}
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

            {/* YouTube Video */}
            {blogPost.youtubeUrl &&
              extractYouTubeVideoId(blogPost.youtubeUrl) && (
                <motion.div
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Related Video
                  </h3>
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
                  >
                    <iframe
                      src={getYouTubeEmbedUrl(
                        extractYouTubeVideoId(blogPost.youtubeUrl)!
                      )}
                      title="YouTube video player"
                      className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

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
              <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={commentFormData.name}
                      onChange={(e) =>
                        setCommentFormData({
                          ...commentFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={commentFormData.email}
                      onChange={(e) =>
                        setCommentFormData({
                          ...commentFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment *
                  </label>
                  <textarea
                    required
                    value={commentFormData.content}
                    onChange={(e) =>
                      setCommentFormData({
                        ...commentFormData,
                        content: e.target.value,
                      })
                    }
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {commentFormData.content.length}/1000
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: isSubmittingComment ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmittingComment ? 1 : 0.98 }}
                >
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </motion.button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      className="flex space-x-4 p-4 bg-gray-50 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <UserRound className="text-black w-8 h-8" />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {comment.author.name}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {comment.status === "pending" && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email || ""}
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-100 focus:outline-none border-1 border-white/30 bg-blue-700 placeholder-gray-200 "
                />
                <motion.button
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscribeSubmit}
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
                {relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <motion.div
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
                        <span>{post.readTime}</span>
                      </div>
                    </motion.div>
                  </Link>
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
