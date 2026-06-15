"use client";
import { useLang, type Lang } from "@/contexts/language-context";

const LANGS: { code: Lang; script: string; full: string; ready: boolean }[] = [
  { code: "kn", script: "ಕ",  full: "ಕನ್ನಡ",    ready: true  },
  { code: "hi", script: "हि", full: "हिंदी",      ready: true  },
  { code: "te", script: "తె", full: "తెలుగు",     ready: false },
  { code: "ta", script: "த",  full: "தமிழ்",     ready: false },
  { code: "ml", script: "മ",  full: "മലയാളം",    ready: false },
];

export default function LanguagePicker() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Language">
      {LANGS.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            title={l.full}
            onClick={() => setLang(l.code)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-150 active:scale-90"
            style={{
              fontFamily:
                l.code === "kn" ? "'Noto Serif Kannada', serif" :
                l.code === "hi" ? "'Noto Serif Devanagari', serif" :
                l.code === "te" ? "'Noto Serif Telugu', serif" :
                l.code === "ta" ? "'Noto Serif Tamil', serif" :
                "'Noto Serif Malayalam', serif",
              background: active
                ? "rgba(212,175,55,0.18)"
                : "rgba(255,255,255,0.04)",
              border: active
                ? "1px solid rgba(212,175,55,0.50)"
                : "1px solid rgba(255,255,255,0.08)",
              color: active
                ? "#D4AF37"
                : l.ready
                ? "rgba(255,248,230,0.40)"
                : "rgba(255,248,230,0.22)",
              boxShadow: active ? "0 0 10px rgba(212,175,55,0.20)" : "none",
            }}
          >
            {l.script}
            {/* Coming-soon dot */}
            {!l.ready && (
              <span
                className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
                style={{ background: "rgba(255,153,51,0.45)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
