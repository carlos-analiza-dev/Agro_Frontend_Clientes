import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { ResponseFincasByPropietario } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";
import { es } from "date-fns/locale";

interface Props {
  setFiltrosAbiertos: Dispatch<SetStateAction<boolean>>;
  filtrosAbiertos: boolean;
  tempFiltros: FiltrosCelos;
  fincasLoading: boolean;
  handleFilterChange: (key: keyof FiltrosCelos, value: any) => void;
  fincas: ResponseFincasByPropietario | undefined;
  hembras: Animal[] | undefined;
  especies: ResponseEspecies[] | undefined;
  animalesLoading: boolean;
  especiesLoading: boolean;
  aplicarFiltros: () => void;
  limpiarFiltros: () => void;
  isTablet: boolean;
}

const DesktopFilters = ({
  setFiltrosAbiertos,
  filtrosAbiertos,
  animalesLoading,
  aplicarFiltros,
  especies,
  especiesLoading,
  fincas,
  fincasLoading,
  handleFilterChange,
  hembras,
  limpiarFiltros,
  tempFiltros,
  isTablet,
}: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los registros de celo por diferentes criterios
          </CardDescription>
        </div>
        {isTablet && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          >
            {filtrosAbiertos ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      {(!isTablet || filtrosAbiertos) && (
        <CardContent>
          <div
            className={cn(
              "grid gap-4",
              isTablet
                ? "grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="fincaId">Finca</Label>
              <Select
                value={tempFiltros.fincaId || "todas"}
                onValueChange={(value) => handleFilterChange("fincaId", value)}
                disabled={fincasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar finca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las fincas</SelectItem>
                  {fincas?.fincas.map((finca) => (
                    <SelectItem key={finca.id} value={finca.id}>
                      {finca.nombre_finca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalId">Animal</Label>
              <Select
                value={tempFiltros.animalId || "todos"}
                onValueChange={(value) =>
                  handleFilterChange("animalId", value === "todos" ? "" : value)
                }
                disabled={animalesLoading || !tempFiltros.fincaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !tempFiltros.fincaId
                        ? "Primero selecciona una finca"
                        : "Seleccionar animal"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los animales</SelectItem>
                  {hembras?.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.identificador} - {animal.color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!tempFiltros.fincaId && (
                <p className="text-xs text-muted-foreground">
                  Selecciona una finca primero
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie">Especie</Label>
              <Select
                value={tempFiltros.especie || "todas"}
                onValueChange={(value) => handleFilterChange("especie", value)}
                disabled={especiesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las especies</SelectItem>
                  {especies?.map((especie) => (
                    <SelectItem key={especie.id} value={especie.nombre}>
                      {especie.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensidad">Intensidad</Label>
              <Select
                value={tempFiltros.intensidad || "todas"}
                onValueChange={(value) =>
                  handleFilterChange("intensidad", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las intensidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="BAJO">Bajo</SelectItem>
                  <SelectItem value="MEDIO">Medio</SelectItem>
                  <SelectItem value="ALTO">Alto</SelectItem>
                  <SelectItem value="MUY_ALTO">Muy Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFiltros.fechaInicio && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {tempFiltros.fechaInicio
                        ? format(
                            new Date(tempFiltros.fechaInicio),
                            "dd/MM/yyyy",
                          )
                        : "Seleccionar fecha"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      tempFiltros.fechaInicio
                        ? new Date(tempFiltros.fechaInicio)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange("fechaInicio", date?.toISOString())
                    }
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFiltros.fechaFin && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {tempFiltros.fechaFin
                        ? format(new Date(tempFiltros.fechaFin), "dd/MM/yyyy")
                        : "Seleccionar fecha"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      tempFiltros.fechaFin
                        ? new Date(tempFiltros.fechaFin)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange("fechaFin", date?.toISOString())
                    }
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div
              className={cn(
                "flex items-end space-x-2",
                isTablet ? "col-span-2 pt-8" : "pt-8",
              )}
            >
              <Button onClick={aplicarFiltros} className="flex-1">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={limpiarFiltros} size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DesktopFilters;
