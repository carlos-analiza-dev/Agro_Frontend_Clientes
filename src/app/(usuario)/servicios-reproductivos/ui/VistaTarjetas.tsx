"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import EstadoBadge from "./EstadoBadge";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  servicios: Servicio[];
  handleOpenModal: (servicio: Servicio) => void;
}

const VistaTarjetas = ({ servicios, handleOpenModal }: Props) => {
  const t = useTranslations("vistaTarjetasServicios");
  const locale = useLocale();
  const dateLocale = locale === "en" ? enUS : es;

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClickEdit = (id: string) => {
    if (isMobile) {
      router.push(`/servicios-reproductivos/${id}`);
    }
  };

  return (
    <div className="space-y-3">
      {servicios.map((servicio) => (
        <Card key={servicio.id} className="overflow-hidden">
          <div className="flex justify-between items-center mt-3 px-4">
            <EstadoBadge estado={servicio.estado} />

            {servicio.exitoso ? (
              <Badge className="bg-green-100 text-green-800 border-0">
                {t("statuses.successful")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                {t("statuses.unsuccessful")}
              </Badge>
            )}
          </div>

          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {servicio.hembra.identificador}

                  {servicio.exitoso ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : servicio.estado === "FALLIDO" ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : null}
                </CardTitle>

                <CardDescription className="text-xs mt-1">
                  {t("labels.serviceNumber", {
                    number: servicio.numero_servicio,
                  })}{" "}
                  • {servicio.tipo_servicio.replace(/_/g, " ")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("labels.male")}
                </p>
                <p className="text-sm font-medium">
                  {servicio.macho?.identificador || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("labels.date")}
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(servicio.fecha_servicio), "dd/MM/yy HH:mm", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>

            {servicio.celo_asociado && (
              <div className="bg-muted/50 p-2 rounded-md mb-2">
                <p className="text-xs flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {t("labels.heat")}:{" "}
                  {format(
                    new Date(servicio.celo_asociado.fechaInicio),
                    "dd/MM/yy HH:mm",
                    { locale: dateLocale },
                  )}
                </p>
              </div>
            )}

            {servicio.detalles && servicio.detalles.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-medium mb-1">
                  {t("labels.mounts")}:
                </p>

                <div className="flex gap-2 flex-wrap">
                  {servicio.detalles.map((detalle, idx) => (
                    <Badge
                      key={detalle.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {idx + 1}: {detalle.hora_servicio}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-2 flex justify-end gap-2">
            <Button
              id="btn-estados-servicios"
              onClick={() => handleOpenModal(servicio)}
              size="sm"
            >
              {t("buttons.status")}
            </Button>

            <Button
              id="btn-edit-servicio"
              onClick={() => handleClickEdit(servicio.id)}
              size="sm"
            >
              {t("buttons.edit")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VistaTarjetas;
