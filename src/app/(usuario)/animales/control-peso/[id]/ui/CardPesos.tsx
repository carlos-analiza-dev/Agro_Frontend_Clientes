"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CardPesosProps {
  tipo: "minimo" | "maximo";
  peso: number;
  rangoEdad: string;
  className?: string;
}

const CardPesos = ({ tipo, peso, rangoEdad, className }: CardPesosProps) => {
  const t = useTranslations("cardPesos");

  const config = {
    minimo: {
      titulo: t("minimumExpected"),
      borderColor: "border-l-blue-500",
      bgIcon: "bg-blue-100",
      textColor: "text-blue-600",
      icon: TrendingDown,
    },
    maximo: {
      titulo: t("maximumExpected"),
      borderColor: "border-l-green-500",
      bgIcon: "bg-green-100",
      textColor: "text-green-600",
      icon: TrendingUp,
    },
  };

  const { titulo, borderColor, bgIcon, textColor, icon: Icon } = config[tipo];

  return (
    <Card
      className={cn(
        "border-l-4 hover:shadow-lg transition-shadow",
        borderColor,
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{titulo}</p>
            <p className={cn("text-3xl font-bold", textColor)}>{peso} Kg</p>
          </div>
          <div className={cn("p-3 rounded-full", bgIcon)}>
            <Icon className={cn("h-6 w-6", textColor)} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>{t("basedOnAgeRange", { range: rangoEdad })}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPesos;
