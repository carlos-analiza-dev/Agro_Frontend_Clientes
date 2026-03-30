"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, DollarSign, Building2, PawPrint } from "lucide-react";
import { Gastos } from "@/api/finanzas/gastos/interface/gastos-response.interface";
import { getCategoriaColor } from "@/helpers/funciones/getCategoriaColor";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardGastosMobileProps {
  gastos: Gastos[];
  isLoading: boolean;
  moneda?: string;
}

export function CardGastosMobile({
  gastos,
  isLoading,
  moneda = "L",
}: CardGastosMobileProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!gastos || gastos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-600">Comienza registrando tu primer gasto</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gastos.map((gasto) => (
        <Card key={gasto.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <Badge className={getCategoriaColor(gasto.categoria)}>
                {gasto.categoria.replace(/_/g, " ")}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {gasto.fecha_gasto}
              </span>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-900">{gasto.concepto}</h3>
              {gasto.descripcion && (
                <p className="text-sm text-gray-600 mt-1">
                  {gasto.descripcion}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm border-t pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-bold text-red-600">
                  {moneda}{" "}
                  {gasto.monto.toLocaleString("es-HN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago:</span>
                <span>{gasto.metodo_pago.replace(/_/g, " ")}</span>
              </div>

              {gasto.fincaNombre && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Finca:
                  </span>
                  <span>{gasto.fincaNombre}</span>
                </div>
              )}

              {gasto.especieNombre && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <PawPrint className="h-3 w-3" />
                    Especie:
                  </span>
                  <span>{gasto.especieNombre}</span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="flex justify-end mt-3 mb-3">
            <Link href={`/gastos/${gasto.id}`}>
              <Button variant={"ghost"}>Editar</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
