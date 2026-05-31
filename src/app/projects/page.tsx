import Footer from "@/components/footer";
import { projects } from "@/data/portfolio";
import { Github, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Projects — Naresh Gowda",
  description: "Production systems, side experiments, and open-source work.",
};

const statusConfig = {
  work: { label: "Work Project", className: "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20" },
  side: { label: "Side Project", className: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20" },
  "open-source": { label: "Open Source", className: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20" },
};

export default function ProjectsPage() {
  const work = projects.filter((p) => p.status === "work");
  const side = projects.filter((p) => p.status === "side" || p.status === "open-source");

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">
        <div className="mb-12">
          <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// projects</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">From production systems to side experiments — shipping code that matters.</p>
        </div>

        {/* Work Projects */}
        <div className="mb-12">
          <h2 className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">Work Projects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {work.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>

        {/* Side Projects */}
        <div>
          <h2 className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Side Projects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {side.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const status = statusConfig[project.status];
  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{project.icon}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border mt-0.5 ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.github && project.github !== "#" && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Github size={14} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
          {project.name}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-500 text-xs leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 font-mono">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
