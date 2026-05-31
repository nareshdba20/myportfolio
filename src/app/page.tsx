import Footer from "@/components/footer";
import { projects, portfolio } from "@/data/portfolio";
import { getPosts, formatDate, stripHtml } from "@/lib/wordpress";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, BookOpen, Mail } from "lucide-react";

export default async function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const posts = await getPosts({ per_page: 3 });

  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 sm:px-12 py-20 max-w-3xl">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Hi, I&apos;m{" "}
          <span className="text-violet-600 dark:text-violet-400 font-semibold">Naresh Gowda</span>
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-2">
          I build{" "}
          <span className="text-blue-500 dark:text-blue-400">databases</span> and
        </h1>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-emerald-500 dark:text-emerald-400 leading-[1.1] mb-8">
          cloud infra
        </h1>

        <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          Database & DevOps Engineer ·{" "}
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Evozn Inc</span>
        </p>

        <div className="max-w-xl space-y-3 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-10">
          <p>
            Software Engineer with <span className="text-zinc-900 dark:text-white font-medium">7+ years</span> of experience
            delivering enterprise-scale systems, cloud migrations, and AI-enabled platforms.
            I care about reliability, performance, and clean systems that people can trust.
          </p>
          <p>
            Currently at{" "}
            <span className="text-zinc-900 dark:text-white font-semibold">Evozn Inc</span>{" "}
            building CI/CD pipelines, cloud databases on{" "}
            <span className="text-zinc-900 dark:text-white font-medium">AWS</span>, and production-grade platforms.
            I document everything on my{" "}
            <a href={portfolio.blog} target="_blank" rel="noopener noreferrer"
              className="text-violet-600 dark:text-violet-400 hover:underline underline-offset-4">
              blog
            </a>.
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-5">
          {[
            { href: portfolio.github,   icon: Github,   label: "GitHub"   },
            { href: portfolio.linkedin, icon: Linkedin, label: "LinkedIn" },
            { href: portfolio.blog,     icon: BookOpen, label: "Blog"     },
            { href: `mailto:${portfolio.email}`, icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer" aria-label={label}
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Icon size={22} />
            </a>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-8 sm:px-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest font-mono">Featured Projects</h2>
            <Link href="/projects" className="text-xs text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1">
              All projects <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featured.map((project) => (
              <div key={project.name}
                className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-violet-300 dark:hover:border-violet-500/40 transition-all duration-200">
                <span className="text-2xl mb-3 block">{project.icon}</span>
                <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {project.name}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="py-16 px-8 sm:px-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest font-mono">Recent Writing</h2>
            <Link href="/blog" className="text-xs text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1">
              All posts <ArrowUpRight size={12} />
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-zinc-400 text-sm">Could not load posts right now.</p>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.map((post) => (
                <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 py-4 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors text-sm mb-0.5 truncate"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <p className="text-xs text-zinc-400 line-clamp-1">{stripHtml(post.excerpt.rendered)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-zinc-400 font-mono">{formatDate(post.date)}</span>
                    <ArrowUpRight size={12} className="text-zinc-300 group-hover:text-violet-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
