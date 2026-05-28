"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20 hover:border-violet-400 dark:hover:border-violet-400/50",
  blue:   "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-400/50",
  pink:   "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-500/20 hover:border-pink-400 dark:hover:border-pink-400/50",
  green:  "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-400/50",
};

const headerColorMap: Record<string, string> = {
  violet: "text-violet-600 dark:text-violet-400",
  blue:   "text-blue-600 dark:text-blue-400",
  pink:   "text-pink-600 dark:text-pink-400",
  green:  "text-emerald-600 dark:text-emerald-400",
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="py-28 px-5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// skills</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Tech Stack</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
            >
              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-4 font-mono", headerColorMap[group.color])}>
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: gi * 0.1 + si * 0.04 }}
                    className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-default", colorMap[group.color])}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
