"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import {
  Calendar,
  Clock,
  Palette,
  Dna,
  Baby,
  CalendarCheck,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  animal: Animal;
}

const InfoAnimal = ({ animal }: Props) => {
  const t = useTranslations("infoAnimal");
  const locale = useLocale();

  return (
    <div className="space-y-2">
      {animal.fecha_nacimiento && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
          <p className="text-sm text-foreground">
            <span className="font-medium">{t("birth")}:</span>{" "}
            {animal.fecha_nacimiento}
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <CalendarCheck className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">{t("registration")}:</span>{" "}
          {new Date(animal.fecha_registro).toLocaleDateString(locale)}
        </p>
      </div>

      {animal.color && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <Palette className="w-5 h-5 text-muted-foreground mt-1" />
          <p className="text-sm text-foreground">
            <span className="font-medium">{t("color")}:</span> {animal.color}
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Clock className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">{t("age")}:</span>{" "}
          {animal.edad_promedio} {t("years")}
        </p>
      </div>

      {animal.pureza && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <Dna className="w-5 h-5 text-muted-foreground mt-1" />
          <p className="text-sm text-foreground">
            <span className="font-medium">{t("purity")}:</span> {animal.pureza}
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Baby className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">{t("reproduction")}:</span>{" "}
          {animal.tipo_reproduccion}
        </p>
      </div>
    </div>
  );
};

export default InfoAnimal;
