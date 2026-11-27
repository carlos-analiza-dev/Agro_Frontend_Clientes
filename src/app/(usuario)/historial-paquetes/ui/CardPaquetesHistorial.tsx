"use client";

import { useTranslations } from "next-intl";
import { PaqueteInterface } from "@/api/paquetes/interface/paquete.interface";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatDateLocal,
  formatDateOnly,
} from "@/helpers/funciones/formatDateOnly";
import {
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";
import { Calendar, Clock } from "lucide-react";

interface Props {
  item: PaqueteInterface;
  duracionDias: number;
  badgeInfo:
    | { variant: "default"; label: string; color: string }
    | { variant: "secondary"; label: string; color: string };
}

const CardPaquetesHistorial = ({ item, duracionDias, badgeInfo }: Props) => {
  const t = useTranslations("cardPaquetesHistorial");

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 ${getPlanColor(item.paquete.tipo)}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getPlanIcon(item.paquete.tipo)}
            <div>
              <CardTitle className="text-lg font-semibold">
                {item.paquete.nombre}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {formatDateLocal(item.fechaInicio)} -{" "}
                {formatDateLocal(item.fechaFin)}
              </CardDescription>
            </div>
          </div>
          <Badge className={badgeInfo.color}>{badgeInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/50 rounded p-2">
              <div className="text-xs text-gray-600">{t("limits.farms")}</div>
              <div className="font-semibold text-gray-900">
                {item.paquete.maxFincas}
              </div>
            </div>
            <div className="bg-white/50 rounded p-2">
              <div className="text-xs text-gray-600">{t("limits.animals")}</div>
              <div className="font-semibold text-gray-900">
                {item.paquete.maxAnimales}
              </div>
            </div>
            <div className="bg-white/50 rounded p-2">
              <div className="text-xs text-gray-600">{t("limits.workers")}</div>
              <div className="font-semibold text-gray-900">
                {item.paquete.maxTrabajadores}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{t("duration.label")}</span>
            </div>
            <span className="font-medium text-gray-900">
              {t("duration.days", { count: duracionDias })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {t("dates.validFrom")} {formatDateOnly(item.fechaInicio)}{" "}
              {t("dates.to")} {formatDateOnly(item.fechaFin)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPaquetesHistorial;
