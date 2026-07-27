import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { getAccionBadge } from "./getAccionBadge";
import { Calendar, ArrowRightLeft, User, Package } from "lucide-react";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/generics/Paginacion";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Dispatch, SetStateAction } from "react";
import { ResponseMovimientosAuditoriaLotes } from "@/api/agroservicio/auditoria/interface/response-auditoria-movimientos.interface";

interface Props {
  isLoadingMovimientosLote: boolean;
  audit_movimientos_lote: ResponseMovimientosAuditoriaLotes | undefined;
  totalPagesMovimientosLote: number;
  currentPageMovimientosLote: number;
  setCurrentPageMovimientosLote: Dispatch<SetStateAction<number>>;
}

export const AuditoriaMovimientosLoteContent = ({
  audit_movimientos_lote,
  isLoadingMovimientosLote,
  currentPageMovimientosLote,
  totalPagesMovimientosLote,
  setCurrentPageMovimientosLote,
}: Props) => {
  if (isLoadingMovimientosLote) return <LoadingSkeleton />;
  if (!audit_movimientos_lote || audit_movimientos_lote.data.length === 0) {
    return (
      <EmptyState message="No se encontraron registros de auditoría de movimientos de lote" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Total: {audit_movimientos_lote.total} registros
        </span>
      </div>
      {audit_movimientos_lote.data.map((audit) => (
        <Card key={audit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                {getAccionBadge(audit.accion)}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTimeLocal(audit.fecha)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ID: {audit.id.slice(0, 8)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Movimiento
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {audit.movimiento.tipo}
                    </Badge>
                    <span className="font-medium">
                      Cantidad: {audit.movimiento.cantidad}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lote ID: {audit.movimiento.lote.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Lote
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-xs">
                    ID: {audit.movimiento.lote.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Movimiento ID: {audit.movimiento.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Empleado
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium">{audit.empleado.nombre}</p>
                  <Badge variant="outline" className="text-xs">
                    {audit.empleado.role?.name || "Sin rol"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {totalPagesMovimientosLote > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPageMovimientosLote}
            totalPages={totalPagesMovimientosLote}
            onPageChange={setCurrentPageMovimientosLote}
          />
        </div>
      )}
    </div>
  );
};
