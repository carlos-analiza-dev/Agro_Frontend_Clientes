import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { getAccionBadge } from "./getAccionBadge";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import {
  Building,
  Calendar,
  Hash,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Paginacion from "@/components/generics/Paginacion";
import { ResponseAuditoriaEmpleados } from "@/api/agroservicio/auditoria/interface/response-auditoria-empleados.interface";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isLoadingEmpleados: boolean;
  audit_empleados: ResponseAuditoriaEmpleados | undefined;
  totalPagesEmpleados: number;
  currentPageEmpleados: number;
  setCurrentPageEmpleados: Dispatch<SetStateAction<number>>;
}

export const AuditoriaEmpleadosContent = ({
  audit_empleados,
  isLoadingEmpleados,
  totalPagesEmpleados,
  currentPageEmpleados,
  setCurrentPageEmpleados,
}: Props) => {
  if (isLoadingEmpleados) return <LoadingSkeleton />;
  if (!audit_empleados || audit_empleados.data.length === 0) {
    return (
      <EmptyState message="No se encontraron registros de auditoría de empleados" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Total: {audit_empleados.total} registros
        </span>
      </div>
      {audit_empleados.data.map((audit: any) => (
        <Card key={audit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
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
                  <User className="h-4 w-4" />
                  Empleado
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-base">
                    {audit.empleado.nombre}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {audit.empleado.identificacion}
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {audit.empleado.email}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {audit.empleado.telefono}
                    </span>
                    {audit.empleado.sexo && (
                      <>
                        <span>|</span>
                        <span>Sexo: {audit.empleado.sexo}</span>
                      </>
                    )}
                  </div>
                  {audit.empleado.direccion && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{audit.empleado.direccion}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Sucursal
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <p className="font-medium">
                    {audit.empleado.sucursal?.nombre || "Sin sucursal"}
                  </p>
                  {audit.empleado.sucursal?.direccion_complemento && (
                    <p className="text-xs text-muted-foreground">
                      {audit.empleado.sucursal.direccion_complemento}
                    </p>
                  )}
                  {audit.empleado.sucursal?.agroservicio && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        Agroservicio:{" "}
                        {
                          audit.empleado.sucursal.agroservicio
                            .nombre_agroservicio
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Descripción de la acción:
                  </p>
                  <p className="text-sm">{audit.descripcion}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {totalPagesEmpleados > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPageEmpleados}
            totalPages={totalPagesEmpleados}
            onPageChange={setCurrentPageEmpleados}
          />
        </div>
      )}
    </div>
  );
};
