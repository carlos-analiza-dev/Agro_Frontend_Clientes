"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  fincaNombre: string;
  fincaAbreviatura: string;
  observaciones?: string | null;
}

const AnimalFincaByPropietarion = ({
  fincaNombre,
  fincaAbreviatura,
  observaciones,
}: Props) => {
  const t = useTranslations("animalFincaByPropietario");

  return (
    <div className="space-y-3">
      <Card className="rounded-xl shadow-sm">
        <CardContent className="flex items-start gap-2 p-3">
          <Home className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">{t("farm")}:</span>{" "}
            {fincaNombre ?? t("notAvailable")} ({fincaAbreviatura})
          </p>
        </CardContent>
      </Card>

      {observaciones && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="flex items-start gap-2 p-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-foreground">
              <span className="font-medium">{t("characteristics")}:</span>{" "}
              {observaciones}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnimalFincaByPropietarion;
