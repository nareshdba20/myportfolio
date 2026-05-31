"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Home, User, BookOpen, FolderOpen, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { portfolio } from "@/data/portfolio";

const links = [
  { href: "/",         icon: Home,       label: "Home"     },
  { href: "/about",    icon: User,       label: "About"    },
  { href: "/blog",     icon: BookOpen,   label: "Blog"     },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/resume",   icon: FileText,   label: "Resume"   },
  { href: `mailto:${portfolio.email}`, icon: Mail, label: "Contact" },
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
      {/* Desktop — left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-16 flex-col items-center justify-between py-6 z-50 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        {/* Logo */}
        <Link href="/" className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 mb-2">
          ng
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col items-center gap-1 flex-1 justify-center">
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
              {/* Tooltip */}
              <span className="absolute left-14 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Theme toggle */}
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

      {/* Mobile — bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 h-14">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors",
              isActive(href)
                ? "text-violet-600 dark:text-violet-400"
                : "text-zinc-400 dark:text-zinc-500"
            )}
          >
            <Icon size={20} />
          </Link>
        ))}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-xl text-zinc-400 dark:text-zinc-500"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </nav>
    </>
  );
}
