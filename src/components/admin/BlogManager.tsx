"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { calculateReadTime } from "@/utils/readTime";

const Backend_Url = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  readTime: string;
  category: string;
  tags: string[];
  youtubeUrl?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  youtubeUrl?: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  readTime: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
}

const BlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    youtubeUrl: "",
    author: {
      name: "",
      avatar: "/default-avatar.jpg",
      bio: "",
    },
    readTime: "5 min read",
    category: "",
    tags: [],
    status: "published",
    featured: false,
  });

  const blogCategories = [
    "Technology",
    "Business",
    "Industry News",
    "Product Updates",
    "Tutorials",
    "Company News",
    "Market Analysis",
    "Tips & Tricks",
  ];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create axios instance with auth header
  const createAuthAxios = (contentType = "application/json") => {
    const token = getAuthToken();
    return axios.create({
      baseURL: Backend_Url,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": contentType,
      },
    });
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection and convert to base64
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({
          type: 'error',
          content: 'File size must be less than 5MB',
        });
        setTimeout(() => setMessage({ type: "", content: "" }), 3000);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMessage({
          type: 'error',
          content: 'Please select a valid image file',
        });
        setTimeout(() => setMessage({ type: "", content: "" }), 3000);
        return;
      }
      
      try {
        const base64Image = await fileToBase64(file);
        setFormData({ ...formData, image: base64Image });
        setImagePreview(base64Image);
        setSelectedFile(file);
        setMessage({
          type: 'success',
          content: 'Image uploaded successfully!',
        });
        setTimeout(() => setMessage({ type: "", content: "" }), 3000);
      } catch (error) {
        console.error('Error processing image:', error);
        setMessage({
          type: 'error',
          content: 'Error processing image. Please try again.',
        });
        setTimeout(() => setMessage({ type: "", content: "" }), 3000);
      }
    }
  };

  // Remove selected image
  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview("");
    setSelectedFile(null);
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const authAxios = createAuthAxios();
      const response = await authAxios.get("/blogs/admin/all");
      setBlogs(response.data.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setMessage({
        type: "error",
        content: "Failed to fetch blogs",
      });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Frontend validation
    if (!formData.image) {
      setMessage({
        type: "error",
        content: "Please upload an image for the blog",
      });
      setTimeout(() => setMessage({ type: "", content: "" }), 5000);
      setIsSubmitting(false);
      return;
    }

    if (!formData.author.name) {
      setMessage({
        type: "error",
        content: "Please provide author name",
      });
      setTimeout(() => setMessage({ type: "", content: "" }), 5000);
      setIsSubmitting(false);
      return;
    }

    try {
      const authAxios = createAuthAxios();
      
      // Calculate read time automatically based on content
      const calculatedReadTime = calculateReadTime(formData.content);
      const blogDataWithReadTime = {
        ...formData,
        readTime: calculatedReadTime,
      };
      
      if (editingBlog) {
        // Update existing blog
        await authAxios.put(`/blogs/${editingBlog._id}`, blogDataWithReadTime);
        setMessage({
          type: "success",
          content: "Blog updated successfully!",
        });
      } else {
        // Create new blog
        console.log('Sending blog data:', blogDataWithReadTime); // Debug log
        await authAxios.post("/blogs", blogDataWithReadTime);
        setMessage({
          type: "success",
          content: "Blog created successfully!",
        });
      }

      resetForm();
      await fetchBlogs();
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    } catch (error) {
      console.error("Error submitting blog:", error);
      const errorMessage = "Failed to submit blog";
      setMessage({
        type: "error",
        content: errorMessage,
      });
      setTimeout(() => setMessage({ type: "", content: "" }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      image: blog.image,
      youtubeUrl: blog.youtubeUrl || "",
      author: blog.author,
      readTime: blog.readTime,
      category: blog.category,
      tags: blog.tags,
      status: blog.status,
      featured: blog.featured,
    });
    setImagePreview(blog.image);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const authAxios = createAuthAxios();
        await authAxios.delete(`/blogs/${id}`);
        
        setMessage({
          type: "success",
          content: "Blog deleted successfully!",
        });
        await fetchBlogs();
        setTimeout(() => setMessage({ type: "", content: "" }), 3000);
      } catch (error) {
        console.error("Error deleting blog:", error);
        setMessage({
          type: "error",
          content: "Failed to delete blog",
        });
        setTimeout(() => setMessage({ type: "", content: "" }), 5000);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image: "",
      youtubeUrl: "",
      author: {
        name: "",
        avatar: "/default-avatar.jpg",
        bio: "",
      },
      readTime: "5 min read",
      category: "",
      tags: [],
      status: "published",
      featured: false,
    });
    setEditingBlog(null);
    setShowModal(false);
    setSelectedFile(null);
    setImagePreview("");
  };

  // Handle tags input
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    setFormData({ ...formData, tags });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create New Blog
        </motion.button>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {message.content && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter((b) => b.status === "published").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter((b) => b.status === "draft").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter((b) => b.featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 relative">
                          <Image
                            src={blog.image || "/placeholder-blog.jpg"}
                            alt={blog.title}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-blog.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {blog.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : blog.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.featured ? "⭐ Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingBlog ? "Edit Blog" : "Create New Blog"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the blog post"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      rows={10}
                      required
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your blog content here..."
                    />
                    {formData.content && (
                      <div className="mt-2 text-sm text-gray-500">
                        Estimated read time: <span className="font-medium text-blue-600">
                          {calculateReadTime(formData.content)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {blogCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Image * (Max 5MB)
                    </label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="blogImageUpload"
                        disabled={!!formData.image}
                      />
                      <label
                        htmlFor="blogImageUpload"
                        className={`cursor-pointer ${
                          formData.image ? "cursor-not-allowed opacity-50" : ""
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
                          {formData.image
                            ? "Image uploaded successfully!"
                            : "Click to upload blog image or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm text-green-600 font-medium">
                          Image uploaded successfully!
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Image
                              src={imagePreview}
                              alt="Blog preview"
                              width={120}
                              height={80}
                              className="w-30 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-blog.jpg";
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove Image
                          </button>
                        </div>
                        {selectedFile && (
                          <div className="text-sm text-gray-600">
                            File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add a YouTube video to display with this blog post
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Author name"
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Bio
                    </label>
                    <input
                      type="text"
                      value={formData.author.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author, bio: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Short bio about the author"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "draft" | "published" | "archived",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Mark as Featured
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingBlog
                      ? "Update Blog"
                      : "Create Blog"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;