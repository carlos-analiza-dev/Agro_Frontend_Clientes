"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltrosActividades } from "@/interfaces/filtros/filters-actividades.interface";
import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { useEffect } from "react";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";

interface Props {
  trabajadores: Trabajador[];
  fincas: Finca[];
  filtrosActuales: FiltrosActividades;
  onFiltrosChange: (filtros: Partial<FiltrosActividades>) => void;
  onLimpiarFiltros: () => void;
  isLoadingTrabajadores: boolean;
  isLoadingFincas: boolean;
  isMobile?: boolean;
  isPropietario: boolean;
  trabajadorId: string;
  rol: TipoCliente;
}

const FiltrosActividadesComponent = ({
  trabajadores,
  fincas,
  filtrosActuales,
  onFiltrosChange,
  onLimpiarFiltros,
  isLoadingTrabajadores,
  isLoadingFincas,
  isMobile = false,
  isPropietario,
  trabajadorId,
  rol,
}: Props) => {
  useEffect(() => {
    if (
      rol === TipoCliente.TRABAJADOR &&
      trabajadorId &&
      filtrosActuales.trabajadorId !== trabajadorId
    ) {
      onFiltrosChange({
        trabajadorId,
      });
    }

    if (rol === TipoCliente.SUPERVISOR && filtrosActuales.trabajadorId) {
      onFiltrosChange({
        trabajadorId: undefined,
      });
    }
  }, [rol, trabajadorId, filtrosActuales.trabajadorId]);

  return (
    <div
      className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}
    >
      {rol === TipoCliente.PROPIETARIO && (
        <div className="space-y-2">
          <Label className="text-sm">Trabajador</Label>
          {isLoadingTrabajadores ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={filtrosActuales.trabajadorId || "todos"}
              onValueChange={(value) =>
                onFiltrosChange({
                  trabajadorId: value === "todos" ? undefined : value,
                })
              }
              disabled={!isPropietario}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !isPropietario ? "Mi asignación" : "Todos los trabajadores"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los trabajadores</SelectItem>
                {trabajadores.map((trabajador) => (
                  <SelectItem key={trabajador.id} value={trabajador.id}>
                    {trabajador.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm">Finca</Label>
        {isLoadingFincas ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={filtrosActuales.fincaId || "todas"}
            onValueChange={(value) =>
              onFiltrosChange({
                fincaId: value === "todas" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas las fincas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las fincas</SelectItem>
              {fincas.map((finca) => (
                <SelectItem key={finca.id} value={finca.id}>
                  {finca.nombre_finca || finca.nombre_finca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Fecha desde</Label>
        <Input
          type="date"
          value={filtrosActuales.fechaInicio || ""}
          onChange={(e) =>
            onFiltrosChange({
              fechaInicio: e.target.value || undefined,
            })
          }
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Fecha hasta</Label>
        <Input
          type="date"
          value={filtrosActuales.fechaFin || ""}
          onChange={(e) =>
            onFiltrosChange({
              fechaFin: e.target.value || undefined,
            })
          }
          className="w-full"
        />
      </div>

      <div
        className={`${isMobile ? "col-span-1" : "md:col-span-2 lg:col-span-1"} flex items-end`}
      >
        <Button
          variant="outline"
          onClick={onLimpiarFiltros}
          className="gap-2 w-full sm:w-auto"
          size={isMobile ? "default" : "default"}
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
};

export default FiltrosActividadesComponent;
