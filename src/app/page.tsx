import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import { projects, portfolio } from "@/data/portfolio";
import { getPosts, formatDate, stripHtml } from "@/lib/wordpress";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

export default async function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const posts = await getPosts({ per_page: 3 });

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />

      {/* Featured Projects */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">// work</p>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {featured.map((project) => (
              <div
                key={project.name}
                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{project.icon}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <Github size={14} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">{project.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="py-20 px-5 bg-zinc-50/80 dark:bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">// writing</p>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Recent Posts</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1">
              All posts <ArrowUpRight size={14} />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-sm">Could not load posts right now.</div>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 py-5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors text-sm mb-1 truncate"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className="text-xs text-zinc-500 line-clamp-1">{stripHtml(post.excerpt.rendered)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-zinc-400 font-mono">{formatDate(post.date)}</span>
                    <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-violet-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">Let&apos;s Connect</h2>
            <p className="text-sm text-zinc-500">Open to interesting work, conversations, and collaboration.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={`mailto:${portfolio.email}`} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20">
              Email me
            </a>
            <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
