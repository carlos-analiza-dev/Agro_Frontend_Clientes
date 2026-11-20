"use client";

import {
  Calendar,
  CalendarDays,
  DollarSign,
  Leaf,
  MapPin,
  Ruler,
  Sprout,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/helpers/funciones/formatDate";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface Props {
  cultivo: Cultivo;
  moneda: string;
}

const DetallesCultivoModal = ({ cultivo, moneda }: Props) => {
  const t = useTranslations("detallesCultivoModal");

  const costosTotales = [
    parseFloat(cultivo.costo_semilla || "0"),
    parseFloat(cultivo.costo_fertilizantes || "0"),
    parseFloat(cultivo.costo_mano_obra || "0"),
    parseFloat(cultivo.otros_costos || "0"),
  ].reduce((a, b) => a + b, 0);

  const ingresoEstimado = parseFloat(cultivo.ingreso_estimado || "0");
  const gananciaEstimada = parseFloat(cultivo.ganancia_estimada || "0");
  const tieneDatosEconomicos = costosTotales > 0 || ingresoEstimado > 0;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 sm:px-4">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold break-words">
              {cultivo.nombre_cultivo}
            </h2>

            {cultivo.variedad && (
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {cultivo.variedad}
              </Badge>
            )}
          </div>

          <Badge
            variant={cultivo.isActive ? "default" : "destructive"}
            className="text-xs sm:text-sm self-start sm:self-auto w-fit"
          >
            {cultivo.isActive ? t("status.inProgress") : t("status.finished")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="font-medium">{t("fields.farm")}:</span>
            <span className="break-words">{cultivo.finca?.nombre_finca}</span>
          </div>

          <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
            <Ruler className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="font-medium">{t("fields.plantedArea")}:</span>
            <span className="break-words">
              {cultivo.area_sembrada}{" "}
              {cultivo.unidad_medida || t("units.hectares")}
            </span>
          </div>

          <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="font-medium">{t("fields.plantingDate")}:</span>
            <span className="break-words">
              {formatDate(cultivo.fecha_siembra)}
            </span>
          </div>

          {cultivo.fecha_cosecha_estimada && (
            <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
              <CalendarDays className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="font-medium">
                {t("fields.estimatedHarvest")}:
              </span>
              <span className="break-words">
                {formatDate(cultivo.fecha_cosecha_estimada)}
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <Card className="overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sprout className="h-5 w-5 flex-shrink-0" />
            <span>{t("sections.cropInformation")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b pb-2 gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t("fields.cropType")}
                </span>
                <Badge variant="outline" className="text-xs w-fit">
                  {cultivo.tipo_cultivo}
                </Badge>
              </div>

              {cultivo.temporada && (
                <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b pb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {t("fields.season")}
                  </span>
                  <span className="text-sm break-words">
                    {cultivo.temporada}
                  </span>
                </div>
              )}

              {cultivo.produccion_estimada && (
                <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b pb-2 gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {t("fields.estimatedProduction")}
                  </span>
                  <span className="text-sm font-medium">
                    {cultivo.produccion_estimada}{" "}
                    {cultivo.unidad_produccion || "kg"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Leaf className="h-5 w-5 flex-shrink-0" />
            <span>{t("sections.soilAndPlantingMethod")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {t("fields.soilType")}
              </p>
              <p className="text-sm sm:text-base font-medium break-words">
                {cultivo.tipo_suelo}
              </p>
            </div>

            {cultivo.ph_suelo && (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {t("fields.soilPh")}
                </p>
                <p className="text-sm sm:text-base font-medium">
                  {cultivo.ph_suelo}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {t("fields.plantingMethod")}
              </p>
              <p className="text-sm sm:text-base font-medium break-words">
                {cultivo.metodo_siembra}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {t("fields.irrigationSystem")}
              </p>
              <p className="text-sm sm:text-base font-medium break-words">
                {cultivo.sistema_riego}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {tieneDatosEconomicos && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 flex-shrink-0" />
              <span>{t("sections.economicInformation")}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                  {t("economic.productionCosts")}
                </h4>

                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableBody>
                      {cultivo.costo_semilla && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.seed")}
                          </TableCell>
                          <TableCell className="p-2 pr-0 text-right text-sm">
                            {moneda}
                            {parseFloat(cultivo.costo_semilla).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}

                      {cultivo.costo_fertilizantes && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.fertilizers")}
                          </TableCell>
                          <TableCell className="p-2 pr-0 text-right text-sm">
                            {moneda}
                            {parseFloat(
                              cultivo.costo_fertilizantes,
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}

                      {cultivo.costo_mano_obra && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.labor")}
                          </TableCell>
                          <TableCell className="p-2 pr-0 text-right text-sm">
                            {moneda}
                            {parseFloat(
                              cultivo.costo_mano_obra,
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}

                      {cultivo.otros_costos && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.otherCosts")}
                          </TableCell>
                          <TableCell className="p-2 pr-0 text-right text-sm">
                            {moneda}
                            {parseFloat(cultivo.otros_costos).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow className="bg-muted/50">
                        <TableCell className="p-2 pl-0 font-bold text-sm">
                          {t("economic.totalCosts")}
                        </TableCell>
                        <TableCell className="p-2 pr-0 text-right font-bold text-sm">
                          {moneda}
                          {costosTotales.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                  {t("economic.incomeAndProfit")}
                </h4>

                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableBody>
                      {cultivo.ingreso_estimado && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.estimatedIncome")}
                          </TableCell>
                          <TableCell className="p-2 pr-0 text-right text-green-600 font-medium text-sm">
                            {moneda}
                            {ingresoEstimado.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}

                      {cultivo.ganancia_estimada && (
                        <TableRow className="border-b">
                          <TableCell className="p-2 pl-0 font-medium text-sm">
                            {t("economic.estimatedProfit")}
                          </TableCell>
                          <TableCell
                            className={`p-2 pr-0 text-right font-bold text-sm ${
                              gananciaEstimada >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {moneda}
                            {gananciaEstimada.toLocaleString()}
                            <span className="inline-block ml-1">
                              {gananciaEstimada >= 0 ? (
                                <TrendingUp className="inline h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <TrendingDown className="inline h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </span>
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow className="bg-muted/50">
                        <TableCell className="p-2 pl-0 font-bold text-sm">
                          {t("economic.profitability")}
                        </TableCell>
                        <TableCell className="p-2 pr-0 text-right font-bold text-sm">
                          {costosTotales > 0
                            ? `${((gananciaEstimada / costosTotales) * 100).toFixed(1)}%`
                            : t("economic.notAvailable")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {costosTotales > 0 && (
              <div className="mt-4">
                <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm mb-1 gap-1">
                  <span>{t("economic.returnOnInvestment")}</span>
                  <span
                    className={`font-semibold ${
                      gananciaEstimada >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {((gananciaEstimada / costosTotales) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      gananciaEstimada >= 0 ? "bg-green-600" : "bg-red-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.max((gananciaEstimada / costosTotales) * 100, 0),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 overflow-hidden">
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 break-words">
                {cultivo.area_sembrada}
              </p>
              <p className="text-xs text-muted-foreground">
                {cultivo.unidad_medida || t("units.hectares")}
              </p>
            </div>

            {cultivo.produccion_estimada && (
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 break-words">
                  {cultivo.produccion_estimada}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cultivo.unidad_produccion || "kg"} {t("units.estimated")}
                </p>
              </div>
            )}

            {tieneDatosEconomicos && (
              <div className="space-y-1">
                <p
                  className={`text-xl sm:text-2xl font-bold break-words ${
                    gananciaEstimada >= 0
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {moneda}
                  {gananciaEstimada.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("economic.estimatedProfit")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetallesCultivoModal;
