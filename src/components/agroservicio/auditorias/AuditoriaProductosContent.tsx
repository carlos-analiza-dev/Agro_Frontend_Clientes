import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { getAccionBadge } from "./getAccionBadge";
import { Calendar, Package, User } from "lucide-react";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/generics/Paginacion";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ResponseAuditoriaProductos } from "@/api/agroservicio/auditoria/interface/response-auditoria-productos.interface";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isLoadingProductos: boolean;
  audit_productos: ResponseAuditoriaProductos | undefined;
  totalPagesProductos: number;
  currentPageProductos: number;
  setCurrentPageProductos: Dispatch<SetStateAction<number>>;
}

export const AuditoriaProductosContent = ({
  audit_productos,
  isLoadingProductos,
  currentPageProductos,
  totalPagesProductos,
  setCurrentPageProductos,
}: Props) => {
  if (isLoadingProductos) return <LoadingSkeleton />;
  if (!audit_productos || audit_productos.data.length === 0) {
    return (
      <EmptyState message="No se encontraron registros de auditoría de productos" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Total: {audit_productos.total} registros
        </span>
      </div>
      {audit_productos.data.map((audit: any) => (
        <Card key={audit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                {getAccionBadge(audit.accion)}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateLocal(audit.fecha)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ID: {audit.id.slice(0, 8)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Producto
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium">{audit.producto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {audit.producto.id.slice(0, 8)}
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
      {totalPagesProductos > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPageProductos}
            totalPages={totalPagesProductos}
            onPageChange={setCurrentPageProductos}
          />
        </div>
      )}
    </div>
  );
};
