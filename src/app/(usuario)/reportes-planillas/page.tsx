"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useGetObtenerTotalPagado from "@/hooks/dashboard/planilla/useGetObtenerTotalPagado";
import { MetodoPago } from "@/interfaces/enums/planillas.enums";
import { Calendar, FilterX } from "lucide-react";
import { useState } from "react";
import TotalPagadoPlanilla from "./ui/TotalPagadoPlanilla";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { getSimboloMoneda } from "@/helpers/funciones/obtener-moneda";
import { Button } from "@/components/ui/button";
import useGetResumenEstadosPlanilla from "@/hooks/dashboard/planilla/useGetResumenEstadosPlanilla";
import ResumenEstadosPlanilla from "./ui/ResumenEstadosPlanilla";
import useGetResumenHoras from "@/hooks/dashboard/planilla/useGetResumenHoras";
import ResumenHorasExtra from "./ui/ResumenHorasExtra";
import useGetMetodosPagos from "@/hooks/dashboard/planilla/useGetMetodosPagos";
import ResumenMetodosPago from "./ui/ResumenMetodosPago";

const ReportesPlanillasPage = () => {
  const { cliente } = useAuthStore();
  const moneda = getSimboloMoneda(cliente);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago | undefined>(
    undefined,
  );

  const { data: total_pagadas, isLoading } = useGetObtenerTotalPagado({
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    metodoPago,
  });

  const { data: resumen_horas, isLoading: cargando_horas } = useGetResumenHoras(
    { fechaInicio: fechaInicio || undefined, fechaFin: fechaFin || undefined },
  );

  const { data: metodos, isLoading: cargando_metodos } = useGetMetodosPagos({
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  });

  const { data: resumen, isLoading: cargando_resumen } =
    useGetResumenEstadosPlanilla();

  const tieneFiltrosActivos = fechaInicio || fechaFin || metodoPago;

  const handleClearFilters = () => {
    setFechaInicio("");
    setFechaFin("");
    setMetodoPago(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Reportes Planillas de Trabajadores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualiza y analiza los pagos realizados a trabajadores
            </p>
          </div>
        </div>

        <Card className="shadow-md border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio" className="text-sm font-medium">
                    Fecha Inicio
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fechaInicio"
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFin" className="text-sm font-medium">
                    Fecha Fin
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fechaFin"
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metodoPago" className="text-sm font-medium">
                    Método de Pago
                  </Label>
                  <Select
                    value={metodoPago || "todos"}
                    onValueChange={(value) => {
                      if (value === "todos") {
                        setMetodoPago(undefined);
                      } else {
                        setMetodoPago(value as MetodoPago);
                      }
                    }}
                  >
                    <SelectTrigger id="metodoPago" className="h-11">
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los métodos</SelectItem>
                      <SelectItem value={MetodoPago.EFECTIVO}>
                        💵 Efectivo
                      </SelectItem>
                      <SelectItem value={MetodoPago.TRANSFERENCIA}>
                        🏦 Transferencia
                      </SelectItem>
                      <SelectItem value={MetodoPago.CHEQUE}>
                        📝 Cheque
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tieneFiltrosActivos && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <FilterX className="h-4 w-4" />
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <TotalPagadoPlanilla
                total_pagadas={total_pagadas}
                cargando={isLoading}
                moneda={moneda}
              />
            </div>
            <div className="lg:col-span-3">
              <ResumenEstadosPlanilla
                resumen={resumen}
                cargando_resumen={cargando_resumen}
                moneda={moneda}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResumenHorasExtra
              resumen_horas={resumen_horas}
              cargando_horas={cargando_horas}
              moneda={moneda}
            />
            <ResumenMetodosPago
              metodos={metodos}
              cargando={cargando_metodos}
              moneda={moneda}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPlanillasPage;
