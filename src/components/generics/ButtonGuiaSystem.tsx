"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import { TourStep } from "../agroservicio/guia/TourGuide";
import { useTranslations } from "next-intl";

interface Props {
  setTourOpen: Dispatch<SetStateAction<boolean>>;
  currentTourSteps: TourStep[];
}

const ButtonGuiaSystem = ({ currentTourSteps, setTourOpen }: Props) => {
  const t = useTranslations("buttonGuiaSystem");

  return (
    <Button
      variant="ghost"
      onClick={() => setTourOpen(true)}
      disabled={currentTourSteps.length === 0}
      className={cn(
        "group relative flex w-full items-center justify-start",
        "rounded-xl px-3 py-2.5",
        "text-sm font-medium transition-all duration-200",
        currentTourSteps.length > 0
          ? "text-green-700 hover:bg-green-50 hover:text-green-700"
          : "text-gray-400",
      )}
      title={t("title")}
    >
      <span
        className={cn(
          "mr-3 flex h-8 w-8 items-center justify-center rounded-lg",
          "transition-all duration-200",
          currentTourSteps.length > 0
            ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
            : "bg-gray-100 text-gray-400",
        )}
      >
        <CircleHelp className="h-4 w-4" />
      </span>

      <span className="flex flex-col items-start">
        <span className="font-semibold">{t("label")}</span>

        <span className="text-[11px] font-normal text-gray-400">
          {currentTourSteps.length > 0 ? t("description") : t("unavailable")}
        </span>
      </span>

      {currentTourSteps.length > 0 && (
        <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500 shadow-sm" />
      )}
    </Button>
  );
};

export default ButtonGuiaSystem;
