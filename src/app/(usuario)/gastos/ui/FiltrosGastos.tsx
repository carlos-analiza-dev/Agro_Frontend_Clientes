"use client";

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
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CategoriaGasto, MetodoPago } from "@/interfaces/enums/gastos.enums";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import type { FiltrosGastos } from "@/interfaces/filtros/filtros-gastos";
import { Especie } from "@/api/reproduccion/interfaces/response-celos-animal,interface";

interface FiltrosGastosProps {
  filtros: FiltrosGastos;
  setFiltros: (filtros: FiltrosGastos) => void;
  fincas: Finca[];
  especies: Especie[];
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

export function FiltrosGastos({
  filtros,
  setFiltros,
  fincas,
  especies,
  onClose,
}: FiltrosGastosProps) {
  const limpiarFiltros = () => {
    setFiltros({
      fincaId: undefined,
      especieId: undefined,
      categoria: "",
      metodo_pago: "",
      fechaInicio: undefined,
      fechaFin: undefined,
      offset: 0,
      limit: 10,
    });
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.fincaId) count++;
    if (filtros.especieId) count++;
    if (filtros.categoria) count++;
    if (filtros.metodo_pago) count++;
    if (filtros.fechaInicio || filtros.fechaFin) count++;
    return count;
  };

  const fechaInicioDate = filtros.fechaInicio
    ? parseLocalDate(filtros.fechaInicio)
    : undefined;
  const fechaFinDate = filtros.fechaFin
    ? parseLocalDate(filtros.fechaFin)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <div className="flex gap-2">
          {contarFiltrosActivos() > 0 && (
            <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Finca</Label>
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
          <Label>Especie</Label>
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

        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={filtros.categoria || "todos"}
            onValueChange={(value) =>
              setFiltros({
                ...filtros,
                categoria: value === "todos" ? "" : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {Object.values(CategoriaGasto).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Método de pago</Label>
          <Select
            value={filtros.metodo_pago || "todos"}
            onValueChange={(value) =>
              setFiltros({
                ...filtros,
                metodo_pago: value === "todos" ? "" : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los métodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los métodos</SelectItem>
              {Object.values(MetodoPago).map((metodo) => (
                <SelectItem key={metodo} value={metodo}>
                  {metodo.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Rango de fechas</Label>
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fechaInicioDate}
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fechaFinDate}
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
    </div>
  );
}
