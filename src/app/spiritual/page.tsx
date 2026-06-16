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
    borderColor: "rgba(212,175,55,0.70)",
    glowColor:   "rgba(212,175,55,0.08)",
    cardBg:      "rgba(60,15,0,0.65)",
    epithetColor: "rgba(255,153,51,0.80)",
  },
  {
    href: "/spiritual/shiva",
    name: "ಶಿವ",
    devanagari: "शिव",
    epithet: "ಮಹಾದೇವ · ಮಹಾ ದೇವರು",
    description: "ತ್ರಿಮೂರ್ತಿಯಲ್ಲಿ ಸಂಹಾರ ಮತ್ತು ರೂಪಾಂತರ ಮಾಡುವವನು. ಕಾಲ, ಪ್ರಜ್ಞೆ ಮತ್ತು ಮೋಕ್ಷದ ಅಧಿಪತಿ.",
    shlokas: 0,
    available: false,
    borderColor: "rgba(180,210,255,0.35)",
    glowColor:   "rgba(150,180,255,0.05)",
    cardBg:      "rgba(0,10,40,0.55)",
    epithetColor: "rgba(160,190,255,0.70)",
  },
  {
    href: "/spiritual/devi",
    name: "ದೇವಿ",
    devanagari: "देवी",
    epithet: "ಶಕ್ತಿ · ದಿವ್ಯ ತಾಯಿ",
    description: "ಪರಮ ಸ್ತ್ರೀ ಶಕ್ತಿ — ಸೃಷ್ಟಿ, ಸ್ಥಿತಿ ಮತ್ತು ಲಯ ಮೂರನ್ನೂ ತನ್ನ ಅಸಂಖ್ಯ ರೂಪಗಳಲ್ಲಿ ಧರಿಸಿರುವಳು.",
    shlokas: 0,
    available: false,
    borderColor: "rgba(255,140,180,0.38)",
    glowColor:   "rgba(255,100,150,0.05)",
    cardBg:      "rgba(50,0,25,0.55)",
    epithetColor: "rgba(255,160,190,0.70)",
  },
  {
    href: "/spiritual/vishnu",
    name: "ವಿಷ್ಣು",
    devanagari: "विष्णु",
    epithet: "ಪಾಲಕ · ಸರ್ವವ್ಯಾಪಿ",
    description: "ಬ್ರಹ್ಮಾಂಡ ಸಂರಕ್ಷಕ — ಯುಗ ಯುಗಗಳಲ್ಲಿ ಅವತಾರ ತಾಳಿ ಧರ್ಮ ಸ್ಥಾಪಿಸಿ ಸೃಷ್ಟಿ ಕಾಯುತ್ತಾನೆ.",
    shlokas: 0,
    available: false,
    borderColor: "rgba(190,150,255,0.38)",
    glowColor:   "rgba(160,120,255,0.05)",
    cardBg:      "rgba(20,0,50,0.55)",
    epithetColor: "rgba(200,170,255,0.70)",
  },
];

export default function SpiritualPage() {
  return (
    <div className="relative min-h-screen">

      {/* Central gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,100,0,0.06) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-10 md:py-16">

        {/* ← Portfolio back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-mono mb-10 transition-opacity opacity-35 hover:opacity-65"
          style={{ color: "#D4AF37", fontFamily: "'Noto Serif Kannada', serif" }}
        >
          ← ಪೋರ್ಟ್‌ಫೋಲಿಯೊ
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-5xl mb-5"
            style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              background: "linear-gradient(160deg, #FF9933 0%, #D4AF37 45%, #FFF0A0 65%, #D4AF37 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 0 18px rgba(212,175,55,0.55))",
              lineHeight: 1,
            }}>
            ॐ
          </p>

          {/* Gold top rule */}
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.55))" }} />
            <span style={{ color: "rgba(212,175,55,0.50)", fontSize: "0.55rem" }}>◆ ◆ ◆</span>
            <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.55))" }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#D4AF37", textShadow: "0 0 40px rgba(212,175,55,0.30)" }}>
            ಪವಿತ್ರ ಗ್ರಂಥಗಳು
          </h1>
          <p className="text-base mb-1" style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "rgba(212,175,55,0.45)" }}>
            Sacred Texts
          </p>
          <p className="text-[10px] uppercase tracking-[0.28em] mb-5" style={{ color: "rgba(255,153,51,0.55)", fontFamily: "'Cinzel', serif" }}>
            Mantras · Shlokas · Stotras
          </p>

          {/* Gold bottom rule */}
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.40))" }} />
            <span style={{ color: "rgba(212,175,55,0.35)", fontSize: "0.55rem" }}>◆ ◆ ◆</span>
            <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.40))" }} />
          </div>

          <p className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: "rgba(255,248,231,0.50)", fontFamily: "'Noto Serif Kannada', serif" }}>
            ಹಿಂದೂ ಪವಿತ್ರ ಗ್ರಂಥಗಳ ವೈಯಕ್ತಿಕ ಸಂಗ್ರಹ — ಅಧ್ಯಯನ, ಜಪ ಮತ್ತು ಚಿಂತನೆಗಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.
          </p>
        </div>

        {/* Deity cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {deities.map((d) => (
            <div key={d.href}>
              {d.available ? (
                <Link href={d.href} className="group block">
                  <DeityCard d={d} />
                </Link>
              ) : (
                <div className="opacity-40 cursor-default">
                  <DeityCard d={d} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-14">
          <div className="flex items-center gap-3 justify-center mb-5">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.30))" }} />
            <span style={{ color: "rgba(212,175,55,0.28)", fontSize: "0.55rem" }}>◆</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.30))" }} />
          </div>
          <p className="text-xs" style={{ color: "rgba(255,248,231,0.20)", fontFamily: "'Noto Serif Devanagari', serif" }}>
            सर्वे भवन्तु सुखिनः
          </p>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,248,231,0.14)", fontFamily: "'Noto Serif Kannada', serif" }}>
            ಎಲ್ಲ ಜೀವಿಗಳೂ ಸುಖವಾಗಿರಲಿ
          </p>
        </div>
      </div>
    </div>
  );
}

function TanjoreCorner() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M2 2 L13 2 Q26 2 26 15 L26 26" stroke="#D4AF37" strokeWidth="0.9" opacity="0.65" />
      <path d="M5 5 L12 5 Q22 5 22 15 L22 22" stroke="#D4AF37" strokeWidth="0.5" opacity="0.35" />
      <circle cx="2" cy="2" r="2.2" fill="#D4AF37" opacity="0.55" />
      <ellipse cx="8" cy="3.5" rx="2.8" ry="1.6" fill="rgba(212,175,55,0.28)" transform="rotate(-20 8 3.5)" />
      <ellipse cx="3.5" cy="8" rx="1.6" ry="2.8" fill="rgba(212,175,55,0.28)" transform="rotate(-20 3.5 8)" />
      <circle cx="13" cy="2.2" r="0.7" fill="#D4AF37" opacity="0.42" />
      <circle cx="2.2" cy="13" r="0.7" fill="#D4AF37" opacity="0.42" />
    </svg>
  );
}

function DeityCard({ d }: { d: typeof deities[0] }) {
  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden"
      style={{
        background: d.cardBg,
        border: `1.5px solid ${d.borderColor}`,
        boxShadow: `0 0 0 3px ${d.glowColor}, 0 0 0 4px ${d.borderColor.replace("0.70", "0.12").replace("0.38", "0.08").replace("0.35", "0.08")}, inset 0 0 40px ${d.glowColor}, 0 8px 32px rgba(0,0,0,0.45)`,
      }}
    >
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-7 h-7"><TanjoreCorner /></div>
      <div className="absolute top-2 right-2 w-7 h-7 rotate-90"><TanjoreCorner /></div>
      <div className="absolute bottom-2 left-2 w-7 h-7 -rotate-90"><TanjoreCorner /></div>
      <div className="absolute bottom-2 right-2 w-7 h-7 rotate-180"><TanjoreCorner /></div>

      {/* Devanagari watermark */}
      <span className="absolute top-1/2 right-3 -translate-y-1/2 text-5xl select-none leading-none"
        style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "#D4AF37", opacity: 0.06 }}>
        {d.devanagari}
      </span>

      <div className="flex items-start gap-3 relative z-10">
        <span className="text-2xl leading-none pt-0.5"
          style={{ fontFamily: "'Noto Serif Devanagari', serif", color: "#D4AF37", opacity: 0.65 }}>
          {d.devanagari}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-0.5"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#D4AF37" }}>
            {d.name}
          </h2>
          <p className="text-[10px] mb-2" style={{ fontFamily: "'Noto Serif Kannada', serif", color: d.epithetColor }}>
            {d.epithet}
          </p>
          <p className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Serif Kannada', serif", color: "rgba(255,248,231,0.55)" }}>
            {d.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {d.available ? (
              <>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                  style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "rgba(212,175,55,0.90)" }}>
                  {d.shlokas} shloka{d.shlokas !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px]" style={{ color: "rgba(212,175,55,0.55)" }}>→ explore</span>
              </>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,248,231,0.30)" }}>
                coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
