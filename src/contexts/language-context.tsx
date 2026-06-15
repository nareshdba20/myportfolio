"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "kn" | "hi" | "te" | "ta" | "ml";

const VALID: Lang[] = ["kn", "hi", "te", "ta", "ml"];

interface LangCtx { lang: Lang; setLang: (l: Lang) => void }

const Ctx = createContext<LangCtx>({ lang: "kn", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("kn");

  useEffect(() => {
    const stored = localStorage.getItem("spiritual-lang") as Lang | null;
    if (stored && VALID.includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("spiritual-lang", l);
  };

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
