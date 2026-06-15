"use client";
import { useLang, type Lang, type FontSize, type SpiritualFields } from "@/contexts/language-context";

const LANGS: { code: Lang; full: string; font: string; ready: boolean }[] = [
  { code: "kn", full: "ಕನ್ನಡ",  font: "'Noto Serif Kannada', serif",    ready: true  },
  { code: "hi", full: "हिंदी",    font: "'Noto Serif Devanagari', serif", ready: true  },
  { code: "te", full: "తెలుగు",   font: "'Noto Serif Telugu', serif",     ready: false },
  { code: "ta", full: "தமிழ்",   font: "'Noto Serif Tamil', serif",      ready: false },
  { code: "ml", full: "മലയാളം",  font: "'Noto Serif Malayalam', serif",  ready: false },
];

const FIELD_LABELS: { key: keyof SpiritualFields; label: string }[] = [
  { key: "script",          label: "Script" },
  { key: "transliteration", label: "Transliteration" },
  { key: "translation",     label: "Translation" },
  { key: "wordMeanings",    label: "Word Meanings" },
];

const SIZES: { val: FontSize; label: string }[] = [
  { val: "small",   label: "Small"   },
  { val: "regular", label: "Regular" },
  { val: "large",   label: "Large"   },
];

export default function SpiritualSettingsPanel() {
  const { lang, setLang, fields, setField, fontSize, setFontSize, settingsOpen, setSettingsOpen } = useLang();
  if (!settingsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70]"
        style={{ background: "rgba(0,0,0,0.25)" }}
        onClick={() => setSettingsOpen(false)}
      />

      {/* Panel */}
      <div
        className="fixed top-14 right-4 z-[80] w-72 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#FFFFFF", border: "1px solid rgba(139,105,20,0.15)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "#1C0F00" }}>Settings</span>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-black/5"
            style={{ color: "#6B4226" }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">

          {/* Language */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(44,24,16,0.42)" }}>
              Language
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => l.ready && setLang(l.code)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    fontFamily: l.font,
                    background: lang === l.code ? "rgba(139,105,20,0.10)" : "transparent",
                    border: lang === l.code ? "1px solid rgba(139,105,20,0.40)" : "1px solid rgba(0,0,0,0.10)",
                    color: lang === l.code ? "#8B6914" : l.ready ? "rgba(44,24,16,0.65)" : "rgba(44,24,16,0.28)",
                    cursor: l.ready ? "pointer" : "default",
                  }}
                >
                  {l.full}
                  {!l.ready && <span className="ml-1 text-[8px] opacity-50">soon</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Field Visibility */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(44,24,16,0.42)" }}>
              Field Visibility
            </p>
            <div className="space-y-3">
              {FIELD_LABELS.map(f => (
                <div key={f.key} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "rgba(44,24,16,0.78)" }}>{f.label}</span>
                  <button
                    onClick={() => setField(f.key, !fields[f.key])}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
                    style={{ background: fields[f.key] ? "#4CAF50" : "rgba(0,0,0,0.15)" }}
                  >
                    <span
                      className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: fields[f.key] ? "23px" : "3px" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "rgba(44,24,16,0.42)" }}>
              Font Size
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {SIZES.map(s => (
                <button
                  key={s.val}
                  onClick={() => setFontSize(s.val)}
                  className="py-1.5 rounded-lg text-xs capitalize font-medium transition-all"
                  style={{
                    background: fontSize === s.val ? "rgba(139,105,20,0.10)" : "transparent",
                    border: fontSize === s.val ? "1px solid rgba(139,105,20,0.35)" : "1px solid rgba(0,0,0,0.08)",
                    color: fontSize === s.val ? "#8B6914" : "rgba(44,24,16,0.55)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p
            className="text-[10px] text-center"
            style={{ color: "rgba(44,24,16,0.25)", fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            सर्वे भवन्तु सुखिनः
          </p>
        </div>
      </div>
    </>
  );
}
