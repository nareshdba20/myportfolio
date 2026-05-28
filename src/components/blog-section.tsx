"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, BookOpen, Pencil, Database } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export default function BlogSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="blog" className="py-28 px-5 bg-zinc-900/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs font-medium text-violet-400 uppercase tracking-widest mb-3">
            // blog
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Writing & Docs
          </h2>
          <p className="text-zinc-500 text-sm">
            Documenting daily engineering work, database internals, and 5+ years of learnings.
          </p>
        </motion.div>

        <motion.a
          href={portfolio.blog}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="group block bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <BookOpen size={18} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors">
                    {portfolio.blogName}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">focusondb.wordpress.com</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                A running log of database administration, backend engineering, and the technical problems
                I solve day-to-day. My goal is to document everything — so that what took me hours to
                figure out takes you minutes.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Pencil size={12} />
                  Daily engineering notes
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Database size={12} />
                  Database deep-dives
                </div>
              </div>
            </div>
            <div className="shrink-0 w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 flex items-center justify-center transition-all duration-300">
              <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
