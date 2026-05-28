export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/60 py-8 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-600">
        <p className="font-mono">
          <span className="text-violet-600 dark:text-violet-500">naresh</span>
          <span className="text-zinc-400 dark:text-zinc-500">@gowda</span>
          <span className="text-zinc-500 dark:text-zinc-600">:~$ </span>
          <span className="text-zinc-400 dark:text-zinc-500">built with Next.js + Tailwind + Framer Motion</span>
        </p>
        <a
          href="https://github.com/nareshdba20/myportfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors font-mono"
        >
          view source →
        </a>
      </div>
    </footer>
  );
}
