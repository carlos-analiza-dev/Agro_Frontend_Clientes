import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { ResponseServicioReproductivoInterface } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { estadoReproductivo } from "@/helpers/data/estadoServicioReproductivo";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CalendarIcon, PawPrint, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
interface Props {
  filtrosVisibles: boolean;
  setFiltrosVisibles: Dispatch<SetStateAction<boolean>>;

  filtros: FiltrosServicios;
  fincas: Finca[];
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
}

const MobileFilters = ({
  filtrosVisibles,
  animalesLoading,
  setFiltrosVisibles,
  filtros,
  fincas,
  fincasLoading,
  handleFilterChange,
  hembras,
  limpiarFiltros,
  refetch,
}: Props) => {
  return (
    <Sheet open={filtrosVisibles} onOpenChange={setFiltrosVisibles}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Filtra los servicios reproductivos
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto pb-20">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Finca
              </Label>
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
              <Label className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                Hembra
              </Label>
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
                  <SelectValue placeholder="Todas las hembras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las hembras</SelectItem>
                  {hembras
                    .filter(
                      (hembra) =>
                        !filtros.finca_id ||
                        hembra.finca?.id === filtros.finca_id,
                    )
                    .map((hembra) => (
                      <SelectItem key={hembra.id} value={hembra.id}>
                        {hembra.identificador} - {hembra.color || "Sin color"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {filtros.finca_id &&
                hembras.filter((h) => h.finca?.id === filtros.finca_id)
                  .length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No hay hembras en esta finca
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Servicio</Label>
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
                  <SelectValue placeholder="Todos los tipos" />
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
                  <SelectValue placeholder="Todos los estados" />
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Fecha desde</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {filtros.fecha_desde ? (
                        format(new Date(filtros.fecha_desde), "dd/MM/yyyy")
                      ) : (
                        <span className="truncate">Seleccionar</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filtros.fecha_desde
                          ? new Date(filtros.fecha_desde)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "fecha_desde",
                          date?.toISOString().split("T")[0],
                        )
                      }
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha hasta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {filtros.fecha_hasta ? (
                        format(new Date(filtros.fecha_hasta), "dd/MM/yyyy")
                      ) : (
                        <span className="truncate">Seleccionar</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filtros.fecha_hasta
                          ? new Date(filtros.fecha_hasta)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "fecha_hasta",
                          date?.toISOString().split("T")[0],
                        )
                      }
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => {
                refetch();
                setFiltrosVisibles(false);
              }}
              className="flex-1"
            >
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={limpiarFiltros}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
