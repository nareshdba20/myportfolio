"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "kn" | "hi" | "te" | "ta" | "ml";
export type FontSize = "small" | "regular" | "large";

export interface SpiritualFields {
  script: boolean;
  transliteration: boolean;
  translation: boolean;
  wordMeanings: boolean;
}

const VALID_LANGS: Lang[] = ["kn", "hi", "te", "ta", "ml"];
const VALID_SIZES: FontSize[] = ["small", "regular", "large"];

const DEFAULT_FIELDS: SpiritualFields = {
  script: true,
  transliteration: true,
  translation: true,
  wordMeanings: true,
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  fields: SpiritualFields;
  setField: (key: keyof SpiritualFields, val: boolean) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
}

const Ctx = createContext<LangCtx>({
  lang: "kn",
  setLang: () => {},
  fields: DEFAULT_FIELDS,
  setField: () => {},
  fontSize: "regular",
  setFontSize: () => {},
  settingsOpen: false,
  setSettingsOpen: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("kn");
  const [fields, setFields] = useState<SpiritualFields>(DEFAULT_FIELDS);
  const [fontSize, setFontSizeState] = useState<FontSize>("regular");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("spiritual-lang") as Lang | null;
    if (storedLang && VALID_LANGS.includes(storedLang)) setLangState(storedLang);

    try {
      const storedFields = localStorage.getItem("spiritual-fields");
      if (storedFields) setFields({ ...DEFAULT_FIELDS, ...JSON.parse(storedFields) });
    } catch {}

    const storedSize = localStorage.getItem("spiritual-fontsize") as FontSize | null;
    if (storedSize && VALID_SIZES.includes(storedSize)) setFontSizeState(storedSize);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("spiritual-lang", l);
  };

  const setField = (key: keyof SpiritualFields, val: boolean) => {
    setFields(prev => {
      const next = { ...prev, [key]: val };
      localStorage.setItem("spiritual-fields", JSON.stringify(next));
      return next;
    });
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem("spiritual-fontsize", s);
  };

  return (
    <Ctx.Provider value={{ lang, setLang, fields, setField, fontSize, setFontSize, settingsOpen, setSettingsOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
