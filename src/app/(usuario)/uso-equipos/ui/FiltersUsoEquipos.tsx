import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface Props {
  filters: {
    offset: number;
    limit: number;
    equipoId: string;
    operadorId: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  equiposActivos: Equipo[] | undefined;
  trabajadores: Trabajador[] | undefined;
  clearFilters: () => void;
  hasActiveFilters: string;
}

const FiltersUsoEquipos = ({
  filters,
  handleFilterChange,
  equiposActivos,
  trabajadores,
  clearFilters,
  hasActiveFilters,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Equipo
            </label>
            <Select
              value={filters.equipoId || "todos"}
              onValueChange={(value) =>
                handleFilterChange("equipoId", value === "todos" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los equipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los equipos</SelectItem>
                {equiposActivos?.map((equipo) => (
                  <SelectItem key={equipo.id} value={equipo.id}>
                    {equipo.nombre} - {equipo.marca} {equipo.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Operador
            </label>
            <Select
              value={filters.operadorId || "todos"}
              onValueChange={(value) =>
                handleFilterChange("operadorId", value === "todos" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los operadores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los operadores</SelectItem>
                {trabajadores?.map((trabajador) => (
                  <SelectItem key={trabajador.id} value={trabajador.id}>
                    {trabajador.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full gap-2"
            >
              <SearchIcon className="h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersUsoEquipos;
