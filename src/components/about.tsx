"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { n: "5+", label: "Years Experience" },
  { n: "8", label: "Projects Built" },
  { n: "5", label: "DB Platforms" },
  { n: "∞", label: "Daily Learnings" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 px-5">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// about</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-12 tracking-tight">Who I am</h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-3 space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            <p>
              I&apos;m a <span className="text-zinc-900 dark:text-white font-medium">Computer Engineer and Database Administrator</span> with over
              five years of experience building and shipping real products. Currently working as a Software Engineer at{" "}
              <span className="text-violet-600 dark:text-violet-400 font-medium">Evozn Inc</span>, where I focus on full-stack development,
              cloud infrastructure, and product design.
            </p>
            <p>
              My background spans backend systems, relational and NoSQL databases, cloud deployments on AWS, and building thoughtful UIs.
              I care deeply about both the technical and human sides of engineering — writing clean systems and making products people actually enjoy using.
            </p>
            <p>
              I document everything I learn on my blog{" "}
              <a href="https://focusondb.wordpress.com/" target="_blank" rel="noopener noreferrer"
                className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 underline underline-offset-4 transition-colors">
                Focus on DB
              </a>{" "}
              — a running journal of database internals, backend engineering, and the technical problems I solve day-to-day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.25 }}
            className="md:col-span-2 grid grid-cols-2 gap-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-center hover:border-violet-400/40 dark:hover:border-violet-500/30 transition-colors">
                <p className="text-3xl font-extrabold text-gradient mb-1">{s.n}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
