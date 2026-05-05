import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filters: { fincaId: string; estado: string; offset: number; limit: number };
  setFilters: Dispatch<
    SetStateAction<{
      fincaId: string;
      estado: string;
      offset: number;
      limit: number;
    }>
  >;
  fincas: Finca[] | undefined;
  handleLimitChange: (newLimit: number) => void;
  handleClearFilters: () => void;
}

const CardFilters = ({
  filters,
  setFilters,
  fincas,
  handleLimitChange,
  handleClearFilters,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Select
          value={filters.fincaId || "todas"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              fincaId: value === "todas" ? "" : value,
              offset: 0,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Seleccionar finca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las fincas</SelectItem>
            {fincas?.map((finca) => (
              <SelectItem key={finca.id} value={finca.id}>
                {finca.nombre_finca}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.estado || "todos"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              estado: value === "todos" ? "" : value,
              offset: 0,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.values(EstadoMaquinaria).map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado === EstadoMaquinaria.ACTIVO && "Activo"}
                {estado === EstadoMaquinaria.MANTENIMIENTO && "Mantenimiento"}
                {estado === EstadoMaquinaria.INCACTIVO && "Inactivo"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.limit.toString()}
          onValueChange={(value) => handleLimitChange(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="15">15 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
