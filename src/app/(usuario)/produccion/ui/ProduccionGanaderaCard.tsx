"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Beef, Pencil } from "lucide-react";
import {
  Ganadera,
  ObtenerProduccionByUserInterface,
} from "@/api/produccion/interface/obter-producciones-userId.interface";
import { Button } from "@/components/ui/button";

interface ProduccionGanaderaCardProps {
  ganadera: ObtenerProduccionByUserInterface["ganadera"];
  finca: ObtenerProduccionByUserInterface["finca"];
  handleProduccionGanadera: (ganadera: Ganadera) => void;
}

const ProduccionGanaderaCard: React.FC<ProduccionGanaderaCardProps> = ({
  ganadera,
  finca,
  handleProduccionGanadera,
}) => {
  const t = useTranslations("produccionGanaderaCard");

  if (!ganadera) return null;

  return (
    <Card className="w-full">
      <div className="flex justify-end mt-4 p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleProduccionGanadera(ganadera)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          {t("buttons.edit")}
        </Button>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Beef className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>

        <div className="flex flex-wrap gap-1">
          {ganadera.tiposProduccion.map((tipo, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tipo}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {ganadera.vacasOrdeño}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("statistics.milkingCows")}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {ganadera.vacasSecas}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("statistics.dryCows")}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {ganadera.terneros}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("statistics.calves")}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              {finca.cantidad_animales}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("statistics.totalAnimals")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ganadera.produccionLecheCantidad && (
            <div className="border rounded-lg p-3 bg-blue-50">
              <div className="font-semibold text-blue-800">
                {t("production.milk")}
              </div>
              <div className="text-lg font-bold">
                {ganadera.produccionLecheCantidad}{" "}
                {ganadera.produccionLecheUnidad}
              </div>
            </div>
          )}

          {ganadera.cabezasEngordeBovino && (
            <div className="border rounded-lg p-3 bg-red-50">
              <div className="font-semibold text-red-800">
                {t("production.fattening")}
              </div>
              <div className="text-lg font-bold">
                {ganadera.cabezasEngordeBovino} {t("production.heads")}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {t("fields.area")}: {finca.area_ganaderia_hectarea} ha
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {finca.cantidad_animales} {t("statistics.animals")}
            </span>
          </div>
        </div>

        {finca.especies_maneja && finca.especies_maneja.length > 0 && (
          <div>
            <div className="font-medium text-sm mb-2">
              {t("fields.species")}
            </div>

            <div className="flex flex-wrap gap-1">
              {finca.especies_maneja.map((especie, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {especie.especie} ({especie.cantidad})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProduccionGanaderaCard;
