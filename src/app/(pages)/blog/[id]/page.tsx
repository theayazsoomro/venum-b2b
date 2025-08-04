"use client";

import { motion, Variants } from "framer-motion";
import { useEffect } from "react";

const blogVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function BlogPage() {
  useEffect(() => {
    document.title = "Blog - My Website";
  }, []);

  return (
    <motion.div
      className="max-w-3xl mx-auto py-42 px-4"
      initial="hidden"
      animate="visible"
      variants={blogVariants}
    >
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Welcome to the Blog
      </motion.h1>

      <motion.article
        className="prose lg:prose-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold">
          How I Built My Portfolio with Next.js
        </h2>
        <p>
          Building a personal portfolio site with <strong>Next.js</strong>,{" "}
          <strong>TypeScript</strong>, and <strong>Framer Motion</strong> has
          been a great experience. It allowed me to structure my code well and
          add animations that felt smooth and intentional.
        </p>
        <p>
          Using the <code>App Router</code> architecture helped me better manage
          routing and data fetching, while Tailwind CSS made styling fast and
          efficient.
        </p>
        <p>Stay tuned for more posts on frontend and full-stack development!</p>
      </motion.article>
    </motion.div>
  );
}
