"use client";
import Link from "next/link";
import { useLang, type Lang, type FontSize } from "@/contexts/language-context";

const PROSE_FONT: Record<Lang, string> = {
  kn: "'Noto Serif Kannada', serif",
  hi: "'Noto Serif Devanagari', serif",
  te: "'Noto Serif Telugu', serif",
  ta: "'Noto Serif Tamil', serif",
  ml: "'Noto Serif Malayalam', serif",
};
const SCRIPT_SIZE: Record<FontSize, string> = { small: "1.25rem", regular: "1.55rem", large: "2.0rem" };
const ROMAN_SIZE:  Record<FontSize, string> = { small: "0.74rem", regular: "0.84rem", large: "0.98rem" };

const LINES = [
  { kannada: "ಅಗಜಾನನ ಪದ್ಮಾರ್ಕಂ ಗಜಾನನಮ್ ಅಹರ್ನಿಶಮ್ ।", roman: "Agajānana Padmārkam Gajānanam Aharniśam |" },
  { kannada: "ಅನೇಕದಂತಂ ಭಕ್ತಾನಾಂ ಏಕದಂತಮುಪಾಸ್ಮಹೇ ॥",   roman: "Anekadantam Bhaktānām Ekadantamupāsmahe ||" },
];

// word (roman) – meaning per language, semicolon-separated inline
interface WE { kn: string; roman: string; kn_m: string; hi_m: string }
const WORDS: WE[] = [
  { kn: "ಅಗಜಾನನ",   roman: "agajānana",   kn_m: "ಪಾರ್ವತಿ, ಪರ್ವತ-ಜಾತೆ",               hi_m: "पार्वती, पर्वत-पुत्री"         },
  { kn: "ಪದ್ಮಾರ್ಕಂ", roman: "padmārkam",  kn_m: "ತಾಮರೆಯ ಸೂರ್ಯ (ಮುಖ ಅರಳಿಸುವ)",        hi_m: "कमल का सूर्य (मुख प्रकाशित करता)" },
  { kn: "ಗಜಾನನಮ್",   roman: "gajānanam",  kn_m: "ಆನೆ ಮುಖದ ದೇವ",                       hi_m: "गज-मुखी देव"                   },
  { kn: "ಅಹರ್ನಿಶಮ್", roman: "aharniśam",  kn_m: "ಹಗಲು ರಾತ್ರಿ, ನಿರಂತರ",               hi_m: "दिन-रात, निरंतर"               },
  { kn: "ಅನೇಕದಂತಂ", roman: "anekadantam", kn_m: "ಅನೇಕ ವಿಘ್ನ ನಿವಾರಿಸುವ",              hi_m: "अनेक विघ्न हरनेवाले"           },
  { kn: "ಭಕ್ತಾನಾಂ",  roman: "bhaktānām",  kn_m: "ಭಕ್ತರ (ಷಷ್ಠೀ ಬಹುವಚನ)",              hi_m: "भक्तों का (षष्ठी बहुवचन)"     },
  { kn: "ಏಕದಂತಮ್",   roman: "ekadantam",  kn_m: "ಒಂದು ದಾಂತ — ಮಹಾಭಾರತ ಬರೆಯಲು ತ್ಯಜಿಸಿದ", hi_m: "एक दाँत — महाभारत लेखन हेतु त्यागा" },
  { kn: "ಉಪಾಸ್ಮಹೇ",  roman: "upāsmahe",   kn_m: "ಭಕ್ತಿಯಿಂದ ಧ್ಯಾನಿಸುತ್ತೇವೆ",          hi_m: "भक्तिपूर्वक ध्यान करते हैं"   },
];

const TRANSLATION: Record<"kn" | "hi", string> = {
  kn: "ಪಾರ್ವತಿ ತಾಯಿಯ ತಾಮರೆ ಮುಖಕ್ಕೆ ಸೂರ್ಯನಂತೆ ಆನಂದ ತರುವ ಗಜಾನನನನ್ನು ನಾವು ಹಗಲು ರಾತ್ರಿ ಪೂಜಿಸುತ್ತೇವೆ. ತನ್ನ ಭಕ್ತರ ಅನೇಕ ವಿಘ್ನಗಳನ್ನು ನಿವಾರಿಸುವ ಏಕದಂತನನ್ನು ನಾವು ಉಪಾಸಿಸುತ್ತೇವೆ.",
  hi: "पार्वती माता के कमल-मुख को सूर्य की भाँति आनंदित करने वाले गजानन को हम दिन-रात उपासते हैं। अनेक विघ्नों को हरने वाले एकदंत की हम आराधना करते हैं।",
};

type LangKey = "kn" | "hi" | "te" | "ta" | "ml";

const SEC: Record<LangKey, { script: string; translit: string; translation: string; words: string; back: string }> = {
  kn: { script: "ಕನ್ನಡ",   translit: "ಉಚ್ಚಾರಣೆ",  translation: "ಅನುವಾದ",        words: "ಪದ ಅರ್ಥ",     back: "← ಅಧ್ಯಾತ್ಮ"     },
  hi: { script: "देवनागरी", translit: "उच्चारण",    translation: "अनुवाद",         words: "पद अर्थ",     back: "← आध्यात्म"      },
  te: { script: "కన్నడ",    translit: "ఉచ్చారణ",   translation: "అనువాదం",        words: "పద అర్థం",    back: "← ఆధ్యాత్మికం"  },
  ta: { script: "கன்னட",   translit: "உச்சரிப்பு", translation: "மொழிபெயர்ப்பு", words: "பத அர்த்தம்", back: "← ஆன்மீகம்"     },
  ml: { script: "കന്നഡ",    translit: "ഉച്ചാരണം",  translation: "വിവർത്തനം",     words: "പദ അർത്ഥം",   back: "← ആദ്ധ്യാത്മികം" },
};

const COMING_SOON: Partial<Record<LangKey, string>> = {
  te: "ఈ భాషలో అనువాదం త్వరలో వస్తుంది",
  ta: "இந்த மொழியில் மொழிபெயர்ப்பு விரைவில் வரும்",
  ml: "ഈ ഭാഷയിൽ വിവർത്തനം ഉടൻ വരും",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-[0.26em] mb-1" style={{ color: "rgba(203, 118, 34, 0.58)" }}>
      {children}
    </p>
  );
}

function Rule() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.22))" }} />
      <span style={{ color: "rgba(212,175,55,0.25)", fontSize: "0.5rem" }}>◆</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.22))" }} />
    </div>
  );
}

export default function GaneshaContent() {
  const { lang, fields, fontSize } = useLang();
  const lbl        = SEC[lang as LangKey];
  const pf         = PROSE_FONT[lang];
  const isHi       = lang === "hi";
  const contentLang: "kn" | "hi" = isHi ? "hi" : "kn";
  const comingSoon = COMING_SOON[lang as LangKey];
  const scriptSz   = SCRIPT_SIZE[fontSize];
  const romanSz    = ROMAN_SIZE[fontSize];

  return (
    <div className="max-w-lg mx-auto px-5 py-4" style={{ overflowX: "hidden" }}>

      {/* Back */}
      <div className="mb-3">
        <Link href="/spiritual"
          className="text-[11px] font-mono transition-opacity opacity-30 hover:opacity-60"
          style={{ color: "#D4AF37", fontFamily: pf }}>
          {lbl.back}
        </Link>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold"
          style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#D4AF37" }}>
          ಗಣೇಶ
        </h1>
      </div>

      {/* Coming-soon banner */}
      {comingSoon && (
        <div className="mb-4 rounded-xl px-4 py-2 text-center text-sm"
          style={{ background: "rgba(255,153,51,0.06)", border: "1px solid rgba(255,153,51,0.18)", fontFamily: pf, color: "rgba(255,153,51,0.70)" }}>
          {comingSoon}
        </div>
      )}

      {/* ── SCRIPT ── */}
      {fields.script && (
        <>
          <Label>{lbl.script}</Label>
          <div className="text-center space-y-0.5">
            {LINES.map((line, i) => (
              <p key={i} className="leading-snug"
                style={{
                  fontFamily: "'Noto Serif Kannada', serif",
                  color: "#FFF8E7",
                  fontSize: scriptSz,
                  wordSpacing: "0.35em",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}>
                {line.kannada}
              </p>
            ))}
          </div>
          <Rule />
        </>
      )}

      {/* ── TRANSLITERATION ── */}
      {fields.transliteration && (
        <>
          <Label>{lbl.translit}</Label>
          <div className="text-center space-y-0.5">
            {LINES.map((line, i) => (
              <p key={i} className="italic leading-snug"
                style={{
                  color: "rgba(255,248,231,0.40)",
                  fontSize: romanSz,
                  letterSpacing: "0.02em",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}>
                {line.roman}
              </p>
            ))}
          </div>
          <Rule />
        </>
      )}

      {/* ── TRANSLATION ── */}
      {fields.translation && (
        <>
          <Label>{lbl.translation}</Label>
          <div className="rounded-xl px-4 py-2"
            style={{ background: "rgba(255,153,51,0.04)", border: "1px solid rgba(255,153,51,0.12)" }}>
            <p className="text-sm leading-relaxed italic"
              style={{ fontFamily: pf, color: "rgba(255,248,231,0.70)", wordBreak: "break-word" }}>
              &ldquo;{TRANSLATION[contentLang]}&rdquo;
            </p>
          </div>
          <Rule />
        </>
      )}

      {/* ── WORD MEANINGS ── */}
      {fields.wordMeanings && (
        <>
          <Label>{lbl.words}</Label>
          <p className="text-sm leading-[1.9]"
            style={{ fontFamily: pf, color: "rgba(255,248,231,0.55)", wordBreak: "break-word", overflowWrap: "break-word" }}
            dangerouslySetInnerHTML={{ __html: WORDS.map(w =>
              `<span style="color:#D4AF37;font-weight:600;font-family:'Noto Serif Kannada',serif">${w.kn}</span>&thinsp;<span style="color:rgba(255,153,51,0.55);font-style:italic">(${w.roman})</span>&ensp;<span style="color:rgba(255,248,231,0.35)">–</span>&ensp;${isHi ? w.hi_m : w.kn_m}`
            ).join('<span style="color:rgba(212,175,55,0.28)">&ensp;;  </span>') }}
          />
        </>
      )}

      {/* Bottom back link */}
      <div className="mt-5 text-center">
        <Link href="/spiritual"
          className="text-[11px] font-mono transition-opacity opacity-20 hover:opacity-50"
          style={{ color: "#D4AF37", fontFamily: pf }}>
          {lbl.back}
        </Link>
      </div>

    </div>
  );
}
