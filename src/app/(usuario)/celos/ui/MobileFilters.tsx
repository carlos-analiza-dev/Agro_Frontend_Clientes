import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";
import { ResponseFincasByPropietario } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filtrosVisibles: boolean;
  setFiltrosVisibles: Dispatch<SetStateAction<boolean>>;
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
}

const MobileFilters = ({
  filtrosVisibles,
  setFiltrosVisibles,
  tempFiltros,
  fincasLoading,
  handleFilterChange,
  fincas,
  hembras,
  especies,
  animalesLoading,
  especiesLoading,
  aplicarFiltros,
  limpiarFiltros,
}: Props) => {
  return (
    <Sheet open={filtrosVisibles} onOpenChange={setFiltrosVisibles}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Filtra los registros de celo por diferentes criterios
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto pb-20">
          <div className="space-y-2">
            <Label htmlFor="fincaId-mobile">Finca</Label>
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
            <Label htmlFor="animalId-mobile">Animal</Label>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="especie-mobile">Especie</Label>
              <Select
                value={tempFiltros.especie || "todas"}
                onValueChange={(value) => handleFilterChange("especie", value)}
                disabled={especiesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {especies?.map((especie) => (
                    <SelectItem key={especie.id} value={especie.nombre}>
                      {especie.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensidad-mobile">Intensidad</Label>
              <Select
                value={tempFiltros.intensidad || "todas"}
                onValueChange={(value) =>
                  handleFilterChange("intensidad", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Intensidad" />
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
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fechas">
              <AccordionTrigger className="py-2">
                <span className="text-sm font-medium">Fechas</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            tempFiltros.fechaInicio
                              ? new Date(tempFiltros.fechaInicio)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleFilterChange(
                              "fechaInicio",
                              date?.toISOString(),
                            )
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
                              ? format(
                                  new Date(tempFiltros.fechaFin),
                                  "dd/MM/yyyy",
                                )
                              : "Seleccionar fecha"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-2">
            <Button onClick={aplicarFiltros} className="flex-1" size="lg">
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              size="lg"
              className="px-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
