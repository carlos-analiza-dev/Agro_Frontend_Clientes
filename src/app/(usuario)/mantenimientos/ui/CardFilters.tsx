import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tiposMamtenimientoData } from "@/helpers/data/mantenimientos/dataTiposMantenimientos";
import { XCircleIcon } from "lucide-react";
import React from "react";

interface Props {
  filters: {
    offset: number;
    limit: number;
    tipoMantenimiento: string;
    fechaInicio: string;
    fechaFin: string;
    fincaId: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  isLoadingFincas: boolean;
  clearFilters: () => void;
  hasActiveFilters: string;
  fincas: Finca[] | undefined;
}

const CardFilters = ({
  filters,
  handleFilterChange,
  isLoadingFincas,
  clearFilters,
  hasActiveFilters,
  fincas,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Finca
            </label>
            <Select
              value={filters.fincaId || "todas"}
              onValueChange={(value) =>
                handleFilterChange("fincaId", value === "todas" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las fincas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las fincas</SelectItem>
                {isLoadingFincas ? (
                  <SelectItem value="loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : (
                  fincas?.map((f: Finca) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nombre_finca}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Tipo
            </label>
            <Select
              value={filters.tipoMantenimiento || "todos"}
              onValueChange={(value) =>
                handleFilterChange(
                  "tipoMantenimiento",
                  value === "todos" ? "" : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {tiposMamtenimientoData.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Desde
            </label>
            <Input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) =>
                handleFilterChange("fechaInicio", e.target.value)
              }
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Hasta
            </label>
            <Input
              type="date"
              value={filters.fechaFin}
              onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full gap-2"
            >
              <XCircleIcon className="h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
