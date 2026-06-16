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
          backgroundColor: "#3D1000",
          backgroundImage: "radial-gradient(rgba(212,175,55,0.045) 1px, transparent 1px), linear-gradient(160deg, #3D1000 0%, #4B1600 45%, #3D1000 100%)",
          backgroundSize: "22px 22px, 100% 100%",
        }}
      >
        {children}
        <SpiritualSettingsToggle />
        <SpiritualSettingsPanel />
      </div>
    </LanguageProvider>
  );
}
