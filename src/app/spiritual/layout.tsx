"use client";
import { useEffect } from "react";
import { LanguageProvider } from "@/contexts/language-context";

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
          background: "#0B0714",
        }}
      >
        {children}
      </div>
    </LanguageProvider>
  );
}
