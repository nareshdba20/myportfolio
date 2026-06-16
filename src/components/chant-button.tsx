"use client";
import { useState, useEffect } from "react";

interface Props {
  lines: string[];
  chantLabel?: string;
  stopLabel?: string;
  speechLang?: string;
}

export default function ChantButton({
  lines,
  chantLabel = "ಪಠಿಸು",
  stopLabel  = "ನಿಲ್ಲಿಸು",
  speechLang = "kn-IN",
}: Props) {
  const [state, setState] = useState<"idle" | "playing" | "unsupported">("idle");

  useEffect(() => {
    if (!("speechSynthesis" in window)) setState("unsupported");
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const handle = () => {
    if (state === "unsupported") return;
    if (state === "playing") { window.speechSynthesis.cancel(); setState("idle"); return; }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(lines.join(" । "));
    utt.lang   = speechLang;
    utt.rate   = 0.62;
    utt.pitch  = 0.72;
    utt.volume = 1;
    utt.onstart = () => setState("playing");
    utt.onend   = () => setState("idle");
    utt.onerror = () => setState("idle");
    window.speechSynthesis.speak(utt);
    setState("playing");
  };

  if (state === "unsupported") return null;
  const playing = state === "playing";

  return (
    <button
      onClick={handle}
      className="flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 hover:scale-105"
      style={{
        background: playing ? "rgba(200,40,40,0.12)"  : "rgba(212,175,55,0.07)",
        border:     playing ? "1px solid rgba(200,80,80,0.45)" : "1px solid rgba(212,175,55,0.35)",
        boxShadow:  playing ? "0 0 16px rgba(200,40,40,0.20)"   : "0 0 12px rgba(212,175,55,0.10)",
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          background: playing ? "#C03030" : "#D4AF37",
          animation:  playing ? "subtlePulse 0.9s ease-in-out infinite" : "none",
          boxShadow:  playing ? "0 0 8px rgba(200,40,40,0.55)" : "0 0 8px rgba(212,175,55,0.45)",
        }}
      />
      <span
        className="text-xs tracking-wider"
        style={{ color: playing ? "rgba(220,80,80,0.90)" : "rgba(212,175,55,0.90)" }}
      >
        {playing ? stopLabel : chantLabel}
      </span>
    </button>
  );
}
