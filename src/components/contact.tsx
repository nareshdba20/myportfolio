"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, BookOpen } from "lucide-react";
import { portfolio } from "@/data/portfolio";

const links = [
  { label: "GitHub",   href: portfolio.github,   icon: Github,   desc: "See my code",      hover: "hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white" },
  { label: "LinkedIn", href: portfolio.linkedin,  icon: Linkedin, desc: "Let's connect",    hover: "hover:border-blue-400 dark:hover:border-blue-500/40 hover:text-blue-700 dark:hover:text-blue-300" },
  { label: "Blog",     href: portfolio.blog,      icon: BookOpen, desc: "Read my writing",  hover: "hover:border-violet-400 dark:hover:border-violet-500/40 hover:text-violet-700 dark:hover:text-violet-300" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="contact" className="py-28 px-5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// contact</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">Let&apos;s Connect</h2>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">Open to interesting conversations, collaboration, and new opportunities.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all duration-200 ${link.hover}`}>
              <link.icon size={18} />
              <div className="text-left">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{link.label}</p>
                <p className="text-xs text-zinc-500">{link.desc}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
