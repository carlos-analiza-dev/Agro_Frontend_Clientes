"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Sprout } from "lucide-react";
import {
  Agricola,
  Cultivo,
} from "@/api/produccion/interface/obter-producciones-userId.interface";
import { Button } from "@/components/ui/button";

interface ProduccionAgricolaProps {
  agricola: {
    id: string;
    cultivos: Cultivo[];
  };
  handleProduccionAgricola: (agricola: Agricola) => void;
}

export const ProduccionAgricolaCard: React.FC<ProduccionAgricolaProps> = ({
  agricola,
  handleProduccionAgricola,
}) => {
  const t = useTranslations("produccionAgricolaCard");

  if (!agricola.cultivos || agricola.cultivos.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <div className="flex justify-end mt-4 p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleProduccionAgricola(agricola as Agricola)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          {t("buttons.edit")}
        </Button>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sprout className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {agricola.cultivos.map((cultivo, index) => (
          <div
            key={`${agricola.id}-${index}`}
            className="border rounded-lg p-4 bg-muted/50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{cultivo.tipo}</h3>
              <Badge variant="outline">
                {cultivo.cantidad_producida_hectareas}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">{t("fields.seasonality")}:</span>
                <span className="text-muted-foreground ml-1 block">
                  {cultivo.estacionalidad}
                </span>
              </div>

              <div>
                <span className="font-medium">{t("fields.duration")}:</span>
                <span className="text-muted-foreground ml-1 block">
                  {cultivo.tiempo_estimado_cultivo}
                </span>
              </div>

              {cultivo.metodo_cultivo && (
                <div className="col-span-2">
                  <span className="font-medium">{t("fields.method")}:</span>
                  <span className="text-muted-foreground ml-1">
                    {cultivo.metodo_cultivo}
                  </span>
                </div>
              )}
            </div>

            {cultivo.meses_produccion &&
              cultivo.meses_produccion.length > 0 && (
                <div className="mt-3">
                  <span className="font-medium text-sm block mb-2">
                    {t("fields.months")}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cultivo.meses_produccion.map((mes, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {mes}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProduccionAgricolaCard;
