import Footer from "@/components/footer";
import BlogPosts from "@/components/blog-posts";
import { getPosts } from "@/lib/wordpress";
import { BookOpen } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export const metadata = {
  title: "Blog — Naresh Gowda",
  description: "Writing about database internals, backend engineering, and daily engineering problems.",
};

export default async function BlogPage() {
  const posts = await getPosts({ per_page: 50 });

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">My Blog</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg leading-relaxed">
            Documenting database internals, backend engineering, and technical problems I solve day-to-day.
            What took me hours to figure out should take you minutes.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-zinc-500 text-sm mb-4">Could not load posts right now.</p>
            <a
              href={portfolio.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 dark:text-violet-400 text-sm hover:underline"
            >
              Visit the blog directly →
            </a>
          </div>
        ) : (
          <BlogPosts posts={posts} />
        )}
      </div>

      <Footer />
    </main>
  );
}
