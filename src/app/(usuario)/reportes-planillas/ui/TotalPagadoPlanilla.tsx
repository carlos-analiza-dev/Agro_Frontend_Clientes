import { ResponseTotalPagadoPlanilla } from "@/api/dashboard/interfaces/planilla-dashboard/response-total-pagado.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Wallet,
  CalendarRange,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/helpers/funciones/formatDate";
import { getMetodoPagoIcon } from "@/helpers/funciones/planilla/planilla";

interface Props {
  total_pagadas: ResponseTotalPagadoPlanilla | undefined;
  cargando: boolean;
  moneda: string;
}

const TotalPagadoPlanilla = ({ total_pagadas, cargando, moneda }: Props) => {
  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            Total Pagado en Planillas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-400">
                {moneda}
                {total_pagadas?.totalPagado || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Monto total pagado a trabajadores
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Período</p>
                  {total_pagadas && total_pagadas?.fechaInicio !== "TODAS" && (
                    <p className="font-medium text-sm">
                      {formatDate(total_pagadas?.fechaInicio)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CalendarRange className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha fin</p>
                  {total_pagadas && total_pagadas?.fechaFin !== "TODAS" && (
                    <p className="font-medium text-sm">
                      {formatDate(total_pagadas?.fechaFin || "TODAS")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-green-200 dark:border-green-800">
              <Wallet className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Método de pago</p>
                <p className="font-medium">
                  <span className="mr-1">
                    {getMetodoPagoIcon(total_pagadas?.metodoPago || "TODOS")}
                  </span>
                  {total_pagadas?.metodoPago || "TODOS"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Resumen Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total pagado:</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {moneda}
                {total_pagadas?.totalPagado || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Filtro aplicado:</span>
              <span className="font-medium">
                {total_pagadas?.metodoPago !== "TODOS"
                  ? total_pagadas?.metodoPago
                  : "Sin filtrar por método"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rango de fechas:</span>
              <span className="font-medium text-xs">
                {total_pagadas?.fechaInicio === "TODAS"
                  ? "Sin filtro de fecha"
                  : `${total_pagadas?.fechaInicio} → ${total_pagadas?.fechaFin}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalPagadoPlanilla;
