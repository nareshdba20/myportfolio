"use client";
import { useEffect } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import SpiritualSettingsPanel from "@/components/spiritual-settings-panel";
import SpiritualSettingsToggle from "@/components/spiritual-settings-toggle";

export default function SpiritualLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <LanguageProvider>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch" as never,
          background: "#FEF9EC",
        }}
      >
        {children}
        <SpiritualSettingsToggle />
        <SpiritualSettingsPanel />
      </div>
    </LanguageProvider>
  );
}
