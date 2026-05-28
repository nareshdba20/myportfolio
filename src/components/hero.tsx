"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, BookOpen, ArrowDown } from "lucide-react";
import { portfolio } from "@/data/portfolio";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 dot-grid" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
      >
        {/* Avatar */}
        <motion.div variants={item} className="mb-8 relative">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <span className="font-bold text-2xl text-gradient">NG</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 blur-xl opacity-30 -z-10" />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-3"
        >
          {portfolio.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-base sm:text-lg text-zinc-400 font-medium mb-6 max-w-xl leading-relaxed"
        >
          {portfolio.tagline}
        </motion.p>

        {/* Badges */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            {portfolio.currentRole}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
            {portfolio.yearsOfExp} yrs experience
          </span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
            📍 {portfolio.location}
          </span>
        </motion.div>

        {/* Links */}
        <motion.div variants={item} className="flex items-center gap-3">
          <a
            href={portfolio.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:border-violet-500/50 hover:bg-zinc-800 transition-all duration-200"
          >
            <Github size={15} /> GitHub
          </a>
          <a
            href={portfolio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:border-blue-500/50 hover:bg-zinc-800 transition-all duration-200"
          >
            <Linkedin size={15} /> LinkedIn
          </a>
          <a
            href={portfolio.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 border border-violet-500 text-sm font-semibold text-white hover:bg-violet-500 transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            <BookOpen size={15} /> Blog
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-xs font-medium tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
