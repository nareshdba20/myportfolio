"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WPPost } from "@/lib/wordpress";
import { formatDate, stripHtml } from "@/lib/wordpress";
import { ownPosts, type OwnPost } from "@/data/posts";
import Link from "next/link";

const CATEGORIES = [
  "Latest",
  "Oracle",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "MSSQL",
  "DynamoDB",
  "Cloud",
  "DevOps",
  "LLM & AI",
  "SRE",
];

type Props = {
  posts: WPPost[];
};

export default function BlogPosts({ posts }: Props) {
  const [selected, setSelected] = useState("Latest");

  const filteredOwn: OwnPost[] =
    selected === "Latest"
      ? ownPosts
      : ownPosts.filter((p) => p.category === selected);

  const filteredWP: WPPost[] = selected === "Latest" ? posts : [];

  const hasContent = filteredOwn.length > 0 || filteredWP.length > 0;

  return (
    <div>
      {/* Underline tab filter */}
      <div
        className="flex items-center border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={cn(
              "px-3 py-1 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              selected === cat
                ? "border-blue-500 text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {!hasContent ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-300">{selected}</span> posts coming soon.
          </p>
          <p className="text-zinc-400 text-xs mt-1">More content launching shortly.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* Own posts */}
          {filteredOwn.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-6 py-5"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors text-sm mb-1">
                  {post.title}
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="font-mono text-[11px] text-zinc-400">{post.date}</span>
                <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </Link>
          ))}
          {/* WordPress posts */}
          {filteredWP.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 py-5"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors text-sm mb-1"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {stripHtml(post.excerpt.rendered)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="font-mono text-[11px] text-zinc-400">{formatDate(post.date)}</span>
                <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
