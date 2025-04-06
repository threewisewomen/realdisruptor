"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CarGamePage from "@/components/car";

// --- Reusable Bento Item Component ---
interface BentoItemProps {
  children: React.ReactNode;
  className?: string; // To allow passing grid span classes etc.
  customDelay?: number; // Optional custom delay for animation
}

const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className = "",
  customDelay = 0,
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + customDelay * 0.1, // Base delay + staggered delay
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      className={`
        bg-gradient-to-br from-white/80 to-gray-100/70 backdrop-blur-lg
        rounded-xl border border-gray-200/80 shadow-sm
        p-4 sm:p-6
        overflow-hidden relative // Added for potential internal absolute positioning
        ${className}
      `}
      style={{
        // Add a subtle inner shadow for depth, reminiscent of older UI elements
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.02)",
      }}
    >
      {children}
    </motion.div>
  );
};

// --- SearchForm Component (Slightly Restyled) ---
function SearchForm({ query }: { query: string }) {
  const [inputValue, setInputValue] = useState(query || "");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted (placeholder):", inputValue);
    // Add actual search logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 w-full"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search academic papers..."
        className="flex-grow w-full px-4 py-2.5 text-sm text-gray-800
                   bg-white/80 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent
                   placeholder-gray-500 transition duration-200 ease-in-out"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700
                   bg-gradient-to-b from-gray-100 to-gray-200
                   border border-gray-300/90 rounded-md
                   hover:from-white hover:to-gray-100 hover:border-gray-400/70
                   active:from-gray-200 active:to-gray-300 active:shadow-inner
                   transition duration-150 ease-in-out shadow-sm whitespace-nowrap"
      >
        Navigate
      </button>
    </form>
  );
}

// --- Main Page Component ---
export default function FuturePortfolioPage() {
  const [query, setQuery] = useState("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // Stagger animation for child BentoItems
      },
    },
  };

  return (
    // Use a subtle gradient background, reminiscent of older OS wallpapers but cleaner
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Bento Item 1: Main Title, Intro & Search (Largest) */}
        <BentoItem
          className="sm:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between"
          customDelay={0}
        >
          <div>
            {/* Small decorative element */}
            <div className="w-10 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4 opacity-80"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
              Ideas Come to Life
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Spot outlier academic papers that rise unexpectedly in influence.
              Navigate the currents of innovation.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Be part of the discovery and showcase your ideas for{" "}
              <strong className="font-semibold text-blue-600">
                Decentralized Peer Review
              </strong>
              .
            </p>
          </div>
          {/* Search form at the bottom of this item */}
          <div className="mt-auto">
            {" "}
            {/* Pushes search form to bottom */}
            <SearchForm query={query} />
          </div>
        </BentoItem>

        {/* Bento Item 2: News Snippet 1 */}
        <BentoItem className="sm:col-span-1 lg:col-span-1" customDelay={1}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Recent Discoveries
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
            <li className="hover:text-blue-600 transition-colors duration-150 cursor-pointer">
              Breakthrough in AI protein folding prediction...
            </li>
            <li className="hover:text-blue-600 transition-colors duration-150 cursor-pointer">
              New study links gut microbiome to mood regulation...
            </li>
            <li className="line-through text-gray-400">
              Old theory on dark matter challenged...
            </li>
          </ul>
          <a
            href="#"
            className="text-xs text-blue-500 hover:underline mt-3 block"
          >
            More News...
          </a>
        </BentoItem>

        {/* Bento Item 3: Trending Topics */}
        <BentoItem className="sm:col-span-1 lg:col-span-1" customDelay={2}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Trending Topics
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Quantum Computing",
              "LLMs",
              "CRISPR",
              "Renewable Energy",
              "Blockchain Research",
            ].map((topic) => (
              <span
                key={topic}
                className="text-xs bg-gray-200/70 text-gray-700 px-2 py-0.5 rounded-full cursor-default"
              >
                {topic}
              </span>
            ))}
          </div>
        </BentoItem>

        {/* Bento Item 4: Community Spotlight / Placeholder */}
        <BentoItem className="sm:col-span-1 lg:col-span-1" customDelay={3}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Community Spotlight
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Highlighting innovative pre-prints and discussions from the
            community.
          </p>
          {/* Placeholder graphic/icon */}
          <div className="w-full h-16 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-md flex items-center justify-center mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </BentoItem>

        {/* Bento Item 5: Another Feature / Placeholder */}
        <BentoItem className="sm:col-span-1 lg:col-span-1" customDelay={4}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Submit Your Work
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Contribute to the growing knowledge base and participate in
            decentralized peer review.
          </p>
          <button
            className="mt-3 w-full px-4 py-2 text-xs font-medium text-white
                   bg-blue-600 border border-blue-700 rounded-md
                   hover:bg-blue-700
                   active:bg-blue-800 active:shadow-inner
                   transition duration-150 ease-in-out shadow-sm"
          >
            Learn More & Submit
          </button>
        </BentoItem>
      </motion.div>
      <CarGamePage />
    </div>
  );
}
