"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20 hover:border-violet-400/50",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/20 hover:border-blue-400/50",
  pink: "bg-pink-500/10 text-pink-300 border-pink-500/20 hover:border-pink-400/50",
  green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:border-emerald-400/50",
};

const headerColorMap: Record<string, string> = {
  violet: "text-violet-400",
  blue: "text-blue-400",
  pink: "text-pink-400",
  green: "text-emerald-400",
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="py-28 px-5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs font-medium text-violet-400 uppercase tracking-widest mb-3">
            // skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tech Stack
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
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
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-default",
                      colorMap[group.color]
                    )}
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
