import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Skills from "@/components/skills";
import { workExperience, portfolio } from "@/data/portfolio";
import { MapPin, Mail, Linkedin, Github } from "lucide-react";

export const metadata = {
  title: "About — Naresh Gowda",
  description: "Software Engineer, Database Administrator, and Cloud & DevOps specialist with 7+ years of experience.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Nav />

      <div className="max-w-5xl mx-auto px-5 pt-28 pb-20">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// about</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6">About Me</h1>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><MapPin size={13} /> {portfolio.location}</span>
            <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"><Mail size={13} /> {portfolio.email}</a>
            <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin size={13} /> LinkedIn</a>
            <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors"><Github size={13} /> GitHub</a>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-16 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
            <p>
              I&apos;m a <span className="text-zinc-900 dark:text-white font-medium">Software Engineer and Database Administrator</span> with{" "}
              <span className="text-violet-600 dark:text-violet-400 font-medium">7+ years of experience</span> delivering enterprise-scale
              and AI-enabled applications. I specialize in database systems, cloud infrastructure, and full-stack development.
            </p>
            <p>
              Currently working as a <span className="text-zinc-900 dark:text-white font-medium">Database & DevOps Engineer at Evozn Inc</span>,
              where I build CI/CD pipelines, manage cloud databases across AWS, and ship production-grade platforms. My background spans
              relational and NoSQL databases, AWS cloud deployments, container orchestration, and SRE practices.
            </p>
            <p>
              I care deeply about reliability, performance, and the human side of engineering — writing clean systems that people
              can trust. I document everything I learn on my blog{" "}
              <a href={portfolio.blog} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 underline underline-offset-4 transition-colors">
                Focus on DB
              </a>{" "}
              — a running journal of database internals, backend engineering, and problems I solve day-to-day.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "7+", label: "Years Experience" },
              { n: "9+", label: "Projects Built" },
              { n: "40TB+", label: "DB Managed" },
              { n: "100+", label: "DB Migrations" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-center hover:border-violet-400/40 dark:hover:border-violet-500/30 transition-colors">
                <p className="text-2xl font-extrabold text-gradient mb-1">{s.n}</p>
                <p className="text-[11px] text-zinc-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience Timeline */}
        <div className="mb-16">
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// experience</p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-8">Work Experience</h2>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-zinc-200 dark:bg-zinc-800" />

            <div className="space-y-8">
              {workExperience.map((job) => (
                <div key={job.company + job.period} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 ${job.current ? "bg-violet-500 border-violet-500" : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-600"}`} />

                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-violet-300 dark:hover:border-violet-500/30 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{job.role}</h3>
                        <p className="text-violet-600 dark:text-violet-400 text-xs font-medium">{job.company} · {job.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.current && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium border border-emerald-200 dark:border-emerald-500/20">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Current
                          </span>
                        )}
                        <span className="font-mono text-[11px] text-zinc-400">{job.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {job.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          <span className="text-violet-400 mt-0.5 shrink-0">▸</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// skills</p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-8">Tech Stack</h2>
          <Skills />
        </div>

      </div>

      <Footer />
    </main>
  );
}
