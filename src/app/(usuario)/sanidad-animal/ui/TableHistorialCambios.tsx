"use client";

import { Historial } from "@/api/sanidad-animal/interface/response-historial-cambios-sanidad";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Calendar, Clock, User, History } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  historial: Historial[] | undefined;
  isMobile: boolean;
  total?: number;
}

const TableHistorialCambios = ({ historial, isMobile, total }: Props) => {
  const t = useTranslations("tableHistorialCambios");

  if (!historial || historial.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg">
        <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
        <p>{t("empty")}</p>
      </div>
    );
  }

  const getTipoCambioLabel = (tipo: string) => {
    return tipo === "fecha_evento"
      ? t("changeTypes.eventDate")
      : t("changeTypes.nextDate");
  };

  const getTipoCambioColor = (tipo: string) => {
    return tipo === "fecha_evento"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getDiasDiferenciaColor = (dias: number) => {
    if (dias > 0) return "bg-green-100 text-green-800 border-green-200";
    if (dias < 0) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getDiasDiferenciaLabel = (dias: number) => {
    if (dias === 0) return t("dayDifference.sameDay");

    return dias > 0
      ? t("dayDifference.positive", { days: dias })
      : t("dayDifference.negative", { days: Math.abs(dias) });
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {historial.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getTipoCambioColor(item.tipo_cambio)}>
                    {getTipoCambioLabel(item.tipo_cambio)}
                  </Badge>

                  <Badge
                    className={getDiasDiferenciaColor(item.dias_diferencia)}
                  >
                    {getDiasDiferenciaLabel(item.dias_diferencia)}
                  </Badge>
                </div>

                <span className="text-xs text-muted-foreground">
                  {formatDate(item.fecha_cambio)}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    {t("labels.serviceAnimal")}
                  </p>

                  <p className="font-medium">
                    {item.sanidad?.tipo_servicio || t("values.notAvailable")}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.sanidad?.animal?.nombre_animal ||
                      item.sanidad?.animal?.identificador ||
                      item.sanidad?.animal?.galpon ||
                      item.sanidad?.animal?.lote ||
                      t("values.noIdentification")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground">
                      {t("labels.previousDate")}
                    </p>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="line-through text-muted-foreground">
                        {formatDate(item.fecha_anterior)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      {t("labels.newDate")}
                    </p>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {formatDate(item.fecha_nueva)}
                      </span>
                    </div>
                  </div>
                </div>

                {item.motivo_cambio && (
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {t("labels.reason")}
                    </p>
                    <p className="text-sm">{item.motivo_cambio}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                  <User className="h-3 w-3" />
                  <span>{item.usuario || t("values.unknownUser")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.service")}</TableHead>
                <TableHead>{t("columns.animalLocation")}</TableHead>
                <TableHead>{t("columns.changeType")}</TableHead>
                <TableHead>{t("columns.previousDate")}</TableHead>
                <TableHead>{t("columns.newDate")}</TableHead>
                <TableHead>{t("columns.difference")}</TableHead>
                <TableHead>{t("columns.reason")}</TableHead>
                <TableHead>{t("columns.user")}</TableHead>
                <TableHead>{t("columns.changeDate")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {historial.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.sanidad?.tipo_servicio ||
                          t("values.notAvailable")}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {item.sanidad?.responsable && (
                          <span>
                            {t("labels.responsible")}:{" "}
                            {item.sanidad.responsable}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.sanidad?.animal?.nombre_animal ||
                          item.sanidad?.animal?.galpon ||
                          item.sanidad?.animal?.lote ||
                          t("values.notAvailable")}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {item.sanidad?.animal?.identificador
                          ? `${t("labels.id")}: ${item.sanidad.animal.identificador}`
                          : item.sanidad?.animal?.galpon
                            ? `${t("labels.poultryHouse")}: ${item.sanidad.animal.galpon}`
                            : item.sanidad?.animal?.lote
                              ? `${t("labels.batch")}: ${item.sanidad.animal.lote}`
                              : t("values.noIdentification")}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getTipoCambioColor(item.tipo_cambio)}>
                      {getTipoCambioLabel(item.tipo_cambio)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground line-through">
                        {formatDate(item.fecha_anterior)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {formatDate(item.fecha_nueva)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={getDiasDiferenciaColor(item.dias_diferencia)}
                    >
                      {getDiasDiferenciaLabel(item.dias_diferencia)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[150px]">
                      <p
                        className="text-sm truncate"
                        title={item.motivo_cambio || t("values.noReason")}
                      >
                        {item.motivo_cambio || "-"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {item.usuario || t("values.notAvailable")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateOnly(item.fecha_cambio)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {total && total > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          {t("totalChanges")}: <span className="font-medium">{total}</span>
        </div>
      )}
    </>
  );
};

export default TableHistorialCambios;
