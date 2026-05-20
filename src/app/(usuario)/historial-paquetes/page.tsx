"use client";
import useGetHistorialPaquetesByCliente from "@/hooks/paquetes/useGetHistorialPaquetesByCliente";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import CardPaquetesHistorial from "./ui/CardPaquetesHistorial";
import { PaqueteInterface } from "@/api/paquetes/interface/paquete.interface";
import CardPlanActivo from "./ui/CardPlanActivo";
import CardResumenHistorial from "./ui/CardResumenHistorial";

const HistorialPaquetesPage = () => {
  const { data: historial, isLoading } = useGetHistorialPaquetesByCliente();

  const getBadgeVariant = (activo: boolean) => {
    if (activo) {
      return {
        variant: "default" as const,
        label: "Activo",
        color: "bg-green-500",
      };
    }
    return {
      variant: "secondary" as const,
      label: "Expirado",
      color: "bg-gray-400",
    };
  };

  const calcularDuracionDias = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay historial de planes
          </h3>
          <p className="text-gray-500">
            Aún no has adquirido ningún plan. ¡Comienza tu experiencia con
            nosotros!
          </p>
        </div>
      </div>
    );
  }

  const planActivo = historial.find((h: any) => h.activo === true);
  const historialAnterior = historial.filter((h: any) => h.activo === false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Historial de Planes
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
              Revisa el historial de tus suscripciones y planes adquiridos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {planActivo && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-green-500 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-800">Plan Actual</h2>
            </div>
            <CardPlanActivo
              planActivo={planActivo}
              calcularDuracionDias={calcularDuracionDias}
            />
          </div>
        )}

        {historialAnterior.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gray-400 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Planes Anteriores
              </h2>
              <Badge variant="outline" className="ml-2">
                {historialAnterior.length} planes
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historialAnterior.map(
                (item: PaqueteInterface, index: number) => {
                  const badgeInfo = getBadgeVariant(item.activo);
                  const duracionDias = calcularDuracionDias(
                    item.fechaInicio,
                    item.fechaFin,
                  );

                  return (
                    <CardPaquetesHistorial
                      key={item.id}
                      item={item}
                      duracionDias={duracionDias}
                      badgeInfo={badgeInfo}
                    />
                  );
                },
              )}
            </div>
          </div>
        )}

        {historial && historial.length > 0 && (
          <div className="mt-12">
            <CardResumenHistorial
              historial={historial}
              planActivo={planActivo}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPaquetesPage;
