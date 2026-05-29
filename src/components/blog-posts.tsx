"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WPPost, WPCategory } from "@/lib/wordpress";
import { formatDate, stripHtml } from "@/lib/wordpress";

type Props = {
  posts: WPPost[];
  categories: WPCategory[];
};

export default function BlogPosts({ posts, categories }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = selected === null
    ? posts
    : posts.filter((p) => p.categories.includes(selected));

  return (
    <div>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelected(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              selected === null
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-violet-400 dark:hover:border-violet-500/50"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id === selected ? null : cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize",
                selected === cat.id
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-violet-400 dark:hover:border-violet-500/50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 text-sm">No posts in this category.</div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {filtered.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 py-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-4 px-4 rounded-xl transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors text-sm mb-1.5"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {stripHtml(post.excerpt.rendered)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-mono text-[11px] text-zinc-400">{formatDate(post.date)}</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-violet-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
