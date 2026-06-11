"use client";

type GitaVerse = {
  chapter: number;
  verse: number;
  slok: string;
  transliteration: string;
  meaning: string;
} | null;

type DeviVerse = {
  chapter: number;
  verse: number;
  chapter_name: string;
  sanskrit: string;
  transliteration: string;
};

export default function SpiritualPanel({
  gitaVerse,
  deviVerse,
}: {
  gitaVerse: GitaVerse;
  deviVerse: DeviVerse;
}) {
  return (
    <div className="flex flex-col gap-5 w-full lg:max-w-xs xl:max-w-sm lg:shrink-0">

      {/* Bhagavad Gita — live API, daily verse */}
      <div className="relative rounded-2xl border border-orange-200/70 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 via-amber-50/80 to-yellow-50/50 dark:from-zinc-900 dark:via-orange-950/20 dark:to-zinc-900 p-5 overflow-hidden shadow-sm">
        <span className="absolute top-3 right-4 text-5xl opacity-[0.07] select-none leading-none font-serif pointer-events-none">ॐ</span>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-base" aria-hidden>🪷</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 font-mono">
            Bhagavad Gita · Today
          </span>
        </div>

        {gitaVerse ? (
          <div className="space-y-3">
            <p className="text-zinc-700 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-serif">
              {gitaVerse.slok}
            </p>
            {gitaVerse.transliteration && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed italic line-clamp-2">
                {gitaVerse.transliteration.split("\n").slice(0, 2).join(" ")}
              </p>
            )}
            {gitaVerse.meaning && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-l-2 border-orange-300 dark:border-orange-700 pl-3">
                {gitaVerse.meaning}
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-orange-500 dark:text-orange-400">
                Ch. {gitaVerse.chapter} · Verse {gitaVerse.verse}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/50 font-medium">
                Daily Verse
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">Could not load today&apos;s verse.</p>
        )}
      </div>

      {/* Devi Mahatmya — from local JSON, daily verse */}
      <div className="relative rounded-2xl border border-rose-200/70 dark:border-rose-900/50 bg-gradient-to-br from-rose-50 via-pink-50/60 to-fuchsia-50/30 dark:from-zinc-900 dark:via-rose-950/20 dark:to-zinc-900 p-5 overflow-hidden shadow-sm">
        <span className="absolute top-2 right-3 text-4xl opacity-[0.07] select-none leading-none pointer-events-none">🌺</span>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-base" aria-hidden>🔱</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 font-mono">
            Devi Mahatmya · Today
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-serif">
            {deviVerse.sanskrit}
          </p>
          {deviVerse.transliteration && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed italic line-clamp-2">
              {deviVerse.transliteration}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400">
              Ch. {deviVerse.chapter} · Verse {deviVerse.verse}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 font-medium line-clamp-1 max-w-[120px] text-right">
              {deviVerse.chapter_name}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
