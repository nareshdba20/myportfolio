"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/portfolio";

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="py-28 px-5 bg-zinc-900/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs font-medium text-violet-400 uppercase tracking-widest mb-3">
            // projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Things I&apos;ve Built
          </h2>
          <p className="text-zinc-500 text-sm">
            From side experiments to production systems — shipping code that matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 card-hover flex flex-col gap-4 overflow-hidden"
            >
              {/* Gradient accent top */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start justify-between">
                <span className="text-3xl">{project.icon}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                      aria-label="Live site"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-violet-300 transition-colors">
                  {project.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/50 text-[11px] font-medium text-zinc-400 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
