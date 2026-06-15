import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spiritual — Sacred Texts | Naresh Gowda",
  description: "A living collection of Hindu mantras, shlokas, and sacred scriptures — documented for study, reflection, and devotion.",
};

const deities = [
  {
    href: "/spiritual/ganesha",
    name: "ಗಣೇಶ",
    devanagari: "गणेश",
    epithet: "ವಿಘ್ನಹರ್ತ · ಅಡಚಣೆ ನಿವಾರಕ",
    description: "ಶಿವ-ಪಾರ್ವತಿಯ ಆನೆ-ಮುಖ ಪುತ್ರ. ಎಲ್ಲ ದೇವತೆಗಳಲ್ಲಿ ಪ್ರಥಮ — ಪ್ರತಿ ಪವಿತ್ರ ಕಾರ್ಯದ ಆರಂಭದಲ್ಲಿ ಪ್ರಾರ್ಥಿಸಲಾಗುತ್ತಾನೆ.",
    shlokas: 1,
    available: true,
    accentColor: "rgba(198,92,0,0.70)",
    cardBg: "rgba(255,153,51,0.06)",
    cardBorder: "rgba(198,92,0,0.18)",
    symbol: "🐘",
  },
  {
    href: "/spiritual/shiva",
    name: "ಶಿವ",
    devanagari: "शिव",
    epithet: "ಮಹಾದೇವ · ಮಹಾ ದೇವರು",
    description: "ತ್ರಿಮೂರ್ತಿಯಲ್ಲಿ ಸಂಹಾರ ಮತ್ತು ರೂಪಾಂತರ ಮಾಡುವವನು. ಕಾಲ, ಪ್ರಜ್ಞೆ ಮತ್ತು ಮೋಕ್ಷದ ಅಧಿಪತಿ.",
    shlokas: 0,
    available: false,
    accentColor: "rgba(59,100,180,0.70)",
    cardBg: "rgba(100,149,237,0.05)",
    cardBorder: "rgba(59,100,180,0.15)",
    symbol: "🔱",
  },
  {
    href: "/spiritual/devi",
    name: "ದೇವಿ",
    devanagari: "देवी",
    epithet: "ಶಕ್ತಿ · ದಿವ್ಯ ತಾಯಿ",
    description: "ಪರಮ ಸ್ತ್ರೀ ಶಕ್ತಿ — ಸೃಷ್ಟಿ, ಸ್ಥಿತಿ ಮತ್ತು ಲಯ ಮೂರನ್ನೂ ತನ್ನ ಅಸಂಖ್ಯ ರೂಪಗಳಲ್ಲಿ ಧರಿಸಿರುವಳು.",
    shlokas: 0,
    available: false,
    accentColor: "rgba(180,50,100,0.70)",
    cardBg: "rgba(219,112,147,0.05)",
    cardBorder: "rgba(180,50,100,0.15)",
    symbol: "🌺",
  },
  {
    href: "/spiritual/vishnu",
    name: "ವಿಷ್ಣು",
    devanagari: "विष्णु",
    epithet: "ಪಾಲಕ · ಸರ್ವವ್ಯಾಪಿ",
    description: "ಬ್ರಹ್ಮಾಂಡ ಸಂರಕ್ಷಕ — ಯುಗ ಯುಗಗಳಲ್ಲಿ ಅವತಾರ ತಾಳಿ ಧರ್ಮ ಸ್ಥಾಪಿಸಿ ಸೃಷ್ಟಿ ಕಾಯುತ್ತಾನೆ.",
    shlokas: 0,
    available: false,
    accentColor: "rgba(100,60,180,0.70)",
    cardBg: "rgba(149,100,237,0.05)",
    cardBorder: "rgba(100,60,180,0.15)",
    symbol: "🪷",
  },
];

export default function SpiritualPage() {
  return (
    <div className="relative min-h-screen">

      {/* Subtle warm glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,153,51,0.12) 0%, transparent 70%)", opacity: 0.6 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-10 md:py-16">

        {/* ← Portfolio back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-mono mb-10 transition-opacity opacity-40 hover:opacity-70"
          style={{ color: "#8B6914", fontFamily: "'Noto Serif Kannada', serif" }}
        >
          ← ಪೋರ್ಟ್‌ಫೋಲಿಯೊ
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-5xl mb-5"
            style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "#8B6914", opacity: 0.50, lineHeight: 1 }}>
            ॐ
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#5C3A00" }}
          >
            ಪವಿತ್ರ ಗ್ರಂಥಗಳು
          </h1>
          <p className="text-base mb-1" style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "rgba(139,105,20,0.55)" }}>
            Sacred Texts
          </p>
          <p className="text-[10px] uppercase tracking-[0.28em] mb-5" style={{ color: "rgba(198,92,0,0.55)", fontFamily: "'Cinzel', serif" }}>
            Mantras · Shlokas · Stotras
          </p>
          <p className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: "rgba(44,24,16,0.58)", fontFamily: "'Noto Serif Kannada', serif" }}>
            ಹಿಂದೂ ಪವಿತ್ರ ಗ್ರಂಥಗಳ ವೈಯಕ್ತಿಕ ಸಂಗ್ರಹ — ಅಧ್ಯಯನ, ಜಪ ಮತ್ತು ಚಿಂತನೆಗಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.
            ಪ್ರತಿ ಶ್ಲೋಕವೂ ಸಾವಿರಾರು ವರ್ಷಗಳ ಜ್ಞಾನ ಹೊತ್ತಿದೆ.
          </p>
        </div>

        {/* Deity cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deities.map((d) => (
            <div key={d.href} className="relative">
              {d.available ? (
                <Link href={d.href} className="group block">
                  <DeityCard d={d} />
                </Link>
              ) : (
                <div className="opacity-45 cursor-default">
                  <DeityCard d={d} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-12" style={{ color: "rgba(44,24,16,0.22)", fontFamily: "'Noto Serif Devanagari', serif" }}>
          सर्वे भवन्तु सुखिनः
        </p>
        <p className="text-center text-[10px] mt-1" style={{ color: "rgba(44,24,16,0.16)", fontFamily: "'Noto Serif Kannada', serif" }}>
          ಎಲ್ಲ ಜೀವಿಗಳೂ ಸುಖವಾಗಿರಲಿ
        </p>
      </div>
    </div>
  );
}

function DeityCard({ d }: { d: typeof deities[0] }) {
  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden"
      style={{
        background: d.cardBg,
        border: `1px solid ${d.cardBorder}`,
        borderLeft: `3px solid ${d.accentColor}`,
        boxShadow: "0 2px 12px rgba(44,24,16,0.06)",
      }}
    >
      {/* Devanagari watermark */}
      <span
        className="absolute top-2 right-4 text-4xl select-none leading-none"
        style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "#8B6914", opacity: 0.08 }}
      >
        {d.devanagari}
      </span>

      <div className="flex items-start gap-3">
        <span
          className="text-2xl leading-none pt-0.5"
          style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "#8B6914", opacity: 0.60 }}
        >
          {d.devanagari}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#3B2000" }}>
              {d.name}
            </h2>
          </div>
          <p className="text-[10px] mt-0.5 mb-2" style={{ fontFamily: "'Noto Serif Kannada', serif", color: "rgba(198,92,0,0.70)" }}>
            {d.epithet}
          </p>
          <p className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif Kannada', serif", color: "rgba(44,24,16,0.62)" }}>
            {d.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {d.available ? (
              <>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                  style={{ background: "rgba(139,105,20,0.08)", border: "1px solid rgba(139,105,20,0.22)", color: "rgba(139,105,20,0.85)" }}
                >
                  {d.shlokas} shloka{d.shlokas !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px]" style={{ color: "rgba(139,105,20,0.55)" }}>→ explore</span>
              </>
            ) : (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", color: "rgba(44,24,16,0.35)" }}
              >
                coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
