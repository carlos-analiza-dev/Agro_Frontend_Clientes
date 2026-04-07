"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { CalendarIcon, X, Filter, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";

interface FiltrosRentabilidadProps {
  filtros: FiltrosRentabilidad;
  setFiltros: (filtros: FiltrosRentabilidad) => void;
  fincas: Finca[] | undefined;
  especies: ResponseEspecies[] | undefined;
  onClose?: () => void;
}

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export function FiltrosRentabilidadComponent({
  filtros,
  setFiltros,
  fincas,
  especies,
  onClose,
}: FiltrosRentabilidadProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: undefined,
      fechaFin: undefined,
      fincaId: undefined,
      especieId: undefined,
    });
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.fincaId) count++;
    if (filtros.especieId) count++;
    if (filtros.fechaInicio || filtros.fechaFin) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  const FilterContent = () => (
    <div className="space-y-6 pb-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Finca</Label>
        <Select
          value={filtros.fincaId || "todos"}
          onValueChange={(value) => {
            setFiltros({
              ...filtros,
              fincaId: value === "todos" ? undefined : value,
            });
          }}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Todas las fincas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las fincas</SelectItem>
            {fincas?.map((finca) => (
              <SelectItem key={finca.id} value={finca.id}>
                {finca.nombre_finca}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Especie</Label>
        <Select
          value={filtros.especieId || "todos"}
          onValueChange={(value) => {
            setFiltros({
              ...filtros,
              especieId: value === "todos" ? undefined : value,
            });
          }}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Todas las especies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las especies</SelectItem>
            {especies?.map((especie) => (
              <SelectItem key={especie.id} value={especie.id}>
                {especie.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Rango de fechas
        </Label>
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white",
                  !filtros.fechaInicio && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.fechaInicio
                  ? format(parseLocalDate(filtros.fechaInicio), "dd/MM/yyyy", {
                      locale: es,
                    })
                  : "Fecha desde"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filtros.fechaInicio
                    ? parseLocalDate(filtros.fechaInicio)
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setFiltros({
                      ...filtros,
                      fechaInicio: formatLocalDate(date),
                    });
                  } else {
                    setFiltros({
                      ...filtros,
                      fechaInicio: undefined,
                    });
                  }
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white",
                  !filtros.fechaFin && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.fechaFin
                  ? format(parseLocalDate(filtros.fechaFin), "dd/MM/yyyy", {
                      locale: es,
                    })
                  : "Fecha hasta"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filtros.fechaFin
                    ? parseLocalDate(filtros.fechaFin)
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setFiltros({
                      ...filtros,
                      fechaFin: formatLocalDate(date),
                    });
                  } else {
                    setFiltros({
                      ...filtros,
                      fechaFin: undefined,
                    });
                  }
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filtrosActivos > 0 && (
        <div className="pt-2">
          <Label className="text-sm font-medium mb-2 block text-gray-700">
            Filtros activos:
          </Label>
          <div className="flex flex-wrap gap-2">
            {filtros.fincaId && (
              <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Finca:{" "}
                {fincas?.find((f) => f.id === filtros.fincaId)?.nombre_finca}
                <button
                  onClick={() => setFiltros({ ...filtros, fincaId: undefined })}
                  className="hover:text-blue-900 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filtros.especieId && (
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Especie:{" "}
                {especies?.find((e) => e.id === filtros.especieId)?.nombre}
                <button
                  onClick={() =>
                    setFiltros({ ...filtros, especieId: undefined })
                  }
                  className="hover:text-green-900 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {(filtros.fechaInicio || filtros.fechaFin) && (
              <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                📅{" "}
                {filtros.fechaInicio &&
                  format(parseLocalDate(filtros.fechaInicio), "dd/MM/yy")}
                {filtros.fechaInicio && filtros.fechaFin && " - "}
                {filtros.fechaFin &&
                  format(parseLocalDate(filtros.fechaFin), "dd/MM/yy")}
                <button
                  onClick={() => {
                    setFiltros({
                      ...filtros,
                      fechaInicio: undefined,
                      fechaFin: undefined,
                    });
                  }}
                  className="hover:text-purple-900 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-3 h-auto w-auto flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                <span className="text-sm font-medium">Filtros</span>
                {filtrosActivos > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                    {filtrosActivos}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0 rounded-t-2xl">
              <div className="flex flex-col h-[90vh]">
                <SheetHeader className="p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <SheetTitle className="text-left text-lg font-semibold">
                      Filtros
                    </SheetTitle>
                    {filtrosActivos > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={limpiarFiltros}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                      </Button>
                    )}
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                  <FilterContent />
                </div>

                <SheetFooter className="p-4 border-t bg-white">
                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => setOpen(false)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Aplicar filtros
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-700">Filtros</h3>
          {filtrosActivos > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {filtrosActivos} activo{filtrosActivos !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {filtrosActivos > 0 && (
          <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
            <X className="h-4 w-4 mr-1" />
            Limpiar todo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Finca</Label>
          <Select
            value={filtros.fincaId || "todos"}
            onValueChange={(value) =>
              setFiltros({
                ...filtros,
                fincaId: value === "todos" ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las fincas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las fincas</SelectItem>
              {fincas?.map((finca) => (
                <SelectItem key={finca.id} value={finca.id}>
                  {finca.nombre_finca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Especie</Label>
          <Select
            value={filtros.especieId || "todos"}
            onValueChange={(value) =>
              setFiltros({
                ...filtros,
                especieId: value === "todos" ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las especies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las especies</SelectItem>
              {especies?.map((especie) => (
                <SelectItem key={especie.id} value={especie.id}>
                  {especie.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-1 sm:col-span-2">
          <Label className="text-sm font-medium">Rango de fechas</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !filtros.fechaInicio && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtros.fechaInicio
                    ? format(
                        parseLocalDate(filtros.fechaInicio),
                        "dd/MM/yyyy",
                        {
                          locale: es,
                        },
                      )
                    : "Fecha desde"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filtros.fechaInicio
                      ? parseLocalDate(filtros.fechaInicio)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setFiltros({
                        ...filtros,
                        fechaInicio: formatLocalDate(date),
                      });
                    } else {
                      setFiltros({
                        ...filtros,
                        fechaInicio: undefined,
                      });
                    }
                  }}
                  locale={es}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !filtros.fechaFin && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtros.fechaFin
                    ? format(parseLocalDate(filtros.fechaFin), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "Fecha hasta"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filtros.fechaFin
                      ? parseLocalDate(filtros.fechaFin)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setFiltros({
                        ...filtros,
                        fechaFin: formatLocalDate(date),
                      });
                    } else {
                      setFiltros({
                        ...filtros,
                        fechaFin: undefined,
                      });
                    }
                  }}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {filtrosActivos > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          {filtros.fincaId && (
            <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              Finca:{" "}
              {fincas?.find((f) => f.id === filtros.fincaId)?.nombre_finca}
              <button
                onClick={() => setFiltros({ ...filtros, fincaId: undefined })}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filtros.especieId && (
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              Especie:{" "}
              {especies?.find((e) => e.id === filtros.especieId)?.nombre}
              <button
                onClick={() => setFiltros({ ...filtros, especieId: undefined })}
                className="hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {(filtros.fechaInicio || filtros.fechaFin) && (
            <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              📅{" "}
              {filtros.fechaInicio &&
                format(parseLocalDate(filtros.fechaInicio), "dd/MM/yy")}
              {filtros.fechaInicio && filtros.fechaFin && " - "}
              {filtros.fechaFin &&
                format(parseLocalDate(filtros.fechaFin), "dd/MM/yy")}
              <button
                onClick={() => {
                  setFiltros({
                    ...filtros,
                    fechaInicio: undefined,
                    fechaFin: undefined,
                  });
                }}
                className="hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
