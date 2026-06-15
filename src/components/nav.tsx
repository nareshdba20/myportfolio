"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Home, User, BookOpen, FolderOpen, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",         icon: Home,       label: "Home"     },
  { href: "/about",    icon: User,       label: "About"    },
  { href: "/blog",     icon: BookOpen,   label: "Blog"     },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/resume",   icon: FileText,   label: "Resume"   },
  { href: "/spiritual", icon: Sparkles,  label: "Spiritual" },
];

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile theme toggle — top right */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      )}

      {/* Desktop — left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-16 flex-col items-center justify-between py-6 z-50 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
          ng
        </Link>

        <nav className="flex flex-col items-center gap-1">
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group relative",
                isActive(href)
                  ? "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Icon size={18} />
              <span className="absolute left-14 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </aside>

      {/* Mobile — bottom bar (nav links only) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around h-16">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors",
              isActive(href)
                ? "text-violet-600 dark:text-violet-400"
                : "text-zinc-400 dark:text-zinc-500 active:text-zinc-900 dark:active:text-white"
            )}
          >
            <Icon size={24} />
          </Link>
        ))}
      </nav>
    </>
  );
}
