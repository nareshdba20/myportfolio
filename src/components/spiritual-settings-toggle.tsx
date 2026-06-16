"use client";
import { useLang } from "@/contexts/language-context";

export default function SpiritualSettingsToggle() {
  const { setSettingsOpen } = useLang();
  return (
    <button
      onClick={() => setSettingsOpen(true)}
      className="fixed top-4 right-4 z-[65] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all hover:scale-105 active:scale-95"
      style={{
        background: "rgba(40,0,0,0.82)",
        border: "1px solid rgba(212,175,55,0.35)",
        color: "rgba(212,175,55,0.90)",
        boxShadow: "0 2px 14px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.08)",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Spiritual settings"
    >
      ⚙ Settings
    </button>
  );
}
