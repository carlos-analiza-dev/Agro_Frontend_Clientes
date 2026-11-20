"use client";

import { cn } from "@/lib/utils";
import { useLocaleSwitcher } from "./IntlProvider";

const options = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
] as const;

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const { locale, setLocale } = useLocaleSwitcher();

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={cn(
        "flex items-center rounded-full border border-gray-200/50 bg-white/50 backdrop-blur-sm p-0.5 h-9 sm:h-10",
        className,
      )}
    >
      {options.map(({ code, label, name }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            title={name}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              "h-full px-2.5 sm:px-3 rounded-full text-xs font-semibold transition-all duration-300",
              active
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-[0_2px_8px_rgba(34,197,94,0.35)]"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50/60",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
