import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { getAccionBadge } from "./getAccionBadge";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import { Building, Calendar, Hash, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/generics/Paginacion";
import { ResponseAuditoriaProveedores } from "@/api/agroservicio/auditoria/interface/response-auditoria-proveedores.interface";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isLoadingProveedores: boolean;
  audit_proveedores: ResponseAuditoriaProveedores | undefined;
  totalPagesProveedores: number;
  currentPageProveedores: number;
  setCurrentPageProveedores: Dispatch<SetStateAction<number>>;
}

export const AuditoriaProveedoresContent = ({
  audit_proveedores,
  isLoadingProveedores,
  totalPagesProveedores,
  currentPageProveedores,
  setCurrentPageProveedores,
}: Props) => {
  if (isLoadingProveedores) return <LoadingSkeleton />;
  if (!audit_proveedores || audit_proveedores.data.length === 0) {
    return (
      <EmptyState message="No se encontraron registros de auditoría de proveedores" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Total: {audit_proveedores.total} registros
        </span>
      </div>
      {audit_proveedores.data.map((audit: any) => (
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
                  <Building className="h-4 w-4" />
                  Proveedor
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium">{audit.proveedor.nombre_legal}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span>NIT: {audit.proveedor.nit_rtn}</span>
                    <span>|</span>
                    <span>NRC: {audit.proveedor.nrc}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span>Contacto: {audit.proveedor.nombre_contacto}</span>
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
      {totalPagesProveedores > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPageProveedores}
            totalPages={totalPagesProveedores}
            onPageChange={setCurrentPageProveedores}
          />
        </div>
      )}
    </div>
  );
};
