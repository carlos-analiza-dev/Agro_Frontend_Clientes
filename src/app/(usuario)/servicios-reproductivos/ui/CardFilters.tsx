import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { ResponseServicioReproductivoInterface } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estadoReproductivo } from "@/helpers/data/estadoServicioReproductivo";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ChevronDown, RefreshCw, Search, X } from "lucide-react";
import React from "react";

interface Props {
  filtros: FiltrosServicios;
  fincas: Finca[];
  fincaSeleccionada: Finca | undefined;
  fincasLoading: boolean;
  hembras: Animal[];
  animalesLoading: boolean;
  handleFilterChange: (key: keyof FiltrosServicios, value: any) => void;
  limpiarFiltros: () => void;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<ResponseServicioReproductivoInterface, Error>
  >;
  isFetching: boolean;
}

const CardFilters = ({
  filtros,
  fincas,
  fincaSeleccionada,
  hembras,
  fincasLoading,
  animalesLoading,
  handleFilterChange,
  refetch,
  limpiarFiltros,
  isFetching,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Filtros</span>
          <Badge variant="outline" className="ml-2">
            {fincaSeleccionada?.nombre_finca || "Todas las fincas"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Finca</Label>
            <Select
              value={filtros.finca_id || ""}
              onValueChange={(value) => handleFilterChange("finca_id", value)}
              disabled={fincasLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar finca" />
              </SelectTrigger>
              <SelectContent>
                {fincas.map((finca) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    {finca.nombre_finca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Hembra</Label>
            <Select
              value={filtros.hembra_id || "todas"}
              onValueChange={(value) =>
                handleFilterChange(
                  "hembra_id",
                  value === "todas" ? undefined : value,
                )
              }
              disabled={animalesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {hembras
                  .filter(
                    (h) =>
                      !filtros.finca_id || h.finca?.id === filtros.finca_id,
                  )
                  .map((hembra) => (
                    <SelectItem key={hembra.id} value={hembra.id}>
                      {hembra.identificador}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={filtros.estado || "todos"}
              onValueChange={(value) =>
                handleFilterChange(
                  "estado",
                  value === "todos" ? undefined : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {estadoReproductivo.map((estado) => (
                  <SelectItem key={estado.id} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={() => refetch()} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" onClick={limpiarFiltros} size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => refetch()} size="icon">
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <details className="group">
            <summary className="flex items-center gap-2 text-sm font-medium cursor-pointer list-none">
              <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
              Filtros avanzados
            </summary>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={filtros.tipo_servicio || "todos"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "tipo_servicio",
                      value === "todos" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {tipoReproduccionOptions.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exitoso</Label>
                <Select
                  value={
                    filtros.exitoso === undefined
                      ? "todos"
                      : filtros.exitoso.toString()
                  }
                  onValueChange={(value) =>
                    handleFilterChange(
                      "exitoso",
                      value === "todos" ? undefined : value === "true",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha desde</Label>
                <Input
                  type="date"
                  value={filtros.fecha_desde || ""}
                  onChange={(e) =>
                    handleFilterChange("fecha_desde", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha hasta</Label>
                <Input
                  type="date"
                  value={filtros.fecha_hasta || ""}
                  onChange={(e) =>
                    handleFilterChange("fecha_hasta", e.target.value)
                  }
                />
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
