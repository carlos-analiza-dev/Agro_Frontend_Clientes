import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import {
  Building,
  Calendar,
  DollarSign,
  ShoppingCart,
  User,
} from "lucide-react";
import { getAccionBadge } from "./getAccionBadge";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import Paginacion from "@/components/generics/Paginacion";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ResponseAuditoriaCompraInterface } from "@/api/agroservicio/auditoria/interface/response-auditoria-compras.interface";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isLoadingCompras: boolean;
  audit_compras: ResponseAuditoriaCompraInterface | undefined;
  totalPagesCompras: number;
  currentPageCompras: number;
  setCurrentPageCompras: Dispatch<SetStateAction<number>>;
  moneda: string;
}

export const AuditoriaComprasContent = ({
  audit_compras,
  isLoadingCompras,
  totalPagesCompras,
  currentPageCompras,
  moneda,
  setCurrentPageCompras,
}: Props) => {
  if (isLoadingCompras) return <LoadingSkeleton />;
  if (!audit_compras || audit_compras.data.length === 0) {
    return (
      <EmptyState message="No se encontraron registros de auditoría de compras" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Total: {audit_compras.total} registros
        </span>
      </div>
      {audit_compras.data.map((audit: any) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Compra
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Factura: {audit.compra.numero_factura}
                    </span>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(audit.compra.total, moneda)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    <span>{audit.compra.proveedor.nombre_legal}</span>
                  </div>
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
      {totalPagesCompras > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPageCompras}
            totalPages={totalPagesCompras}
            onPageChange={setCurrentPageCompras}
          />
        </div>
      )}
    </div>
  );
};
