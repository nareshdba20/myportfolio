"use client";
import { useLang } from "@/contexts/language-context";

export default function SpiritualSettingsToggle() {
  const { setSettingsOpen } = useLang();
  return (
    <button
      onClick={() => setSettingsOpen(true)}
      className="fixed top-4 right-4 z-[65] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono transition-all hover:scale-105 active:scale-95"
      style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(139,105,20,0.20)",
        color: "#8B6914",
        boxShadow: "0 2px 10px rgba(44,24,16,0.10)",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Spiritual settings"
    >
      ⚙ Settings
    </button>
  );
}
