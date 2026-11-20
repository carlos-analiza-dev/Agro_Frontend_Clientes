"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

const catalogs = { es, en } as const;
type Locale = keyof typeof catalogs;

const SwitcherContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "es", setLocale: () => {} });

export const useLocaleSwitcher = () => useContext(SwitcherContext);

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "es") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    localStorage.setItem("lang", l);
    setLocaleState(l);
  };

  return (
    <SwitcherContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={catalogs[locale]}
        timeZone="America/Tegucigalpa"
      >
        {children}
      </NextIntlClientProvider>
    </SwitcherContext.Provider>
  );
}
