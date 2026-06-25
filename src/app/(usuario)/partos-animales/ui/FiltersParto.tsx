"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Filter, X, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { EstadoParto, TipoParto } from "@/interfaces/enums/partos.enums";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface FiltersPartoProps {
  filtros: {
    finca_id: string;
    hembra_id: string;
    estado: string;
    tipo_parto: string;
    fecha_desde?: Date;
    fecha_hasta?: Date;
    limit: number;
    page: number;
  };
  setFiltros: React.Dispatch<React.SetStateAction<any>>;
  fincas: { data: { fincas: Finca[] } } | undefined;
  hembras: Animal[] | undefined;
  clearFilters: () => void;
  isMobile?: boolean;
  onApplyMobile?: () => void;
}

export const FiltersParto = ({
  filtros,
  setFiltros,
  fincas,
  hembras,
  clearFilters,
  isMobile = false,
  onApplyMobile,
}: FiltersPartoProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedAnimal = hembras?.find(
    (animal) => animal.id === filtros.hembra_id,
  );

  const filteredHembras =
    hembras?.filter((animal) => {
      if (filtros.finca_id && animal.finca?.id !== filtros.finca_id) {
        return false;
      }

      const searchTermLower = searchTerm.toLowerCase().trim();
      if (!searchTermLower) return true;

      const identificador = animal.identificador?.toLowerCase() || "";
      const nombre = animal.nombre_animal?.toLowerCase() || "";
      const color = animal.color?.toLowerCase() || "";
      const especie = animal.especie?.nombre?.toLowerCase() || "";

      return (
        identificador.includes(searchTermLower) ||
        nombre.includes(searchTermLower) ||
        color.includes(searchTermLower) ||
        especie.includes(searchTermLower)
      );
    }) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedAnimal) {
      setSearchTerm(
        `${selectedAnimal.identificador || ""} - ${selectedAnimal.nombre_animal || "Sin nombre"}`,
      );
    } else {
      setSearchTerm("");
    }
  }, [selectedAnimal]);

  const handleSelectAnimal = (animalId: string) => {
    setFiltros({
      ...filtros,
      hembra_id: animalId,
      page: 1,
    });
    const animal = hembras?.find((a) => a.id === animalId);
    if (animal) {
      setSearchTerm(
        `${animal.identificador || ""} - ${animal.nombre_animal || "Sin nombre"}`,
      );
    }
    setIsSearchOpen(false);
  };

  const handleClearAnimal = () => {
    setFiltros({
      ...filtros,
      hembra_id: "",
      page: 1,
    });
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.hembra_id) count++;
    if (filtros.estado) count++;
    if (filtros.tipo_parto) count++;
    if (filtros.fecha_desde || filtros.fecha_hasta) count++;
    return count;
  };

  const hembrasEnFinca = filtros.finca_id
    ? hembras?.filter((h) => h.finca?.id === filtros.finca_id)
    : hembras;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {contarFiltrosActivos() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {contarFiltrosActivos()} activos
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Finca</Label>
            <Select
              value={filtros.finca_id}
              onValueChange={(value) => {
                setFiltros({
                  ...filtros,
                  finca_id: value,
                  hembra_id: "",
                  page: 1,
                });
                setSearchTerm("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar finca" />
              </SelectTrigger>
              <SelectContent>
                {fincas?.data?.fincas?.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nombre_finca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2" ref={searchRef}>
            <Label className="text-sm font-medium">Hembra</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <Input
                  placeholder={
                    selectedAnimal
                      ? `${selectedAnimal.identificador || selectedAnimal.nombre_animal || "Animal"} seleccionado`
                      : "Buscar hembra..."
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => {
                    if (searchTerm) {
                      setIsSearchOpen(true);
                    }
                  }}
                  className={cn(
                    "pl-9 pr-10",
                    selectedAnimal && "bg-blue-50 border-blue-300",
                  )}
                />
                {selectedAnimal && (
                  <button
                    type="button"
                    onClick={handleClearAnimal}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isSearchOpen && searchTerm && (
                <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                  {filteredHembras.length > 0 ? (
                    filteredHembras.map((animal) => (
                      <div
                        key={animal.id}
                        onClick={() => handleSelectAnimal(animal.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                          filtros.hembra_id === animal.id && "bg-blue-50",
                        )}
                      >
                        <Image
                          src={
                            animal.profileImages &&
                            animal.profileImages.length > 0
                              ? animal.profileImages[0].url
                              : "/images/Image-not-found.png"
                          }
                          alt={`animal-${animal.identificador}`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          unoptimized
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {animal.identificador ||
                              animal.nombre_animal ||
                              "Sin identificar"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {animal.especie?.nombre ||
                              "Especie no especificada"}
                            {animal.color && ` • ${animal.color}`}
                          </p>
                        </div>
                        {filtros.hembra_id === animal.id && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm">
                      <p className="text-gray-500">
                        {filtros.finca_id
                          ? "No se encontraron hembras en esta finca"
                          : "No se encontraron hembras"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {filtros.finca_id
                          ? "Selecciona otra finca o cambia tu búsqueda"
                          : "Selecciona una finca primero o cambia tu búsqueda"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedAnimal && !searchTerm && (
              <div className="mt-1 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      selectedAnimal.profileImages &&
                      selectedAnimal.profileImages.length > 0
                        ? selectedAnimal.profileImages[0].url
                        : "/images/Image-not-found.png"
                    }
                    alt={`animal-${selectedAnimal.identificador}`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {selectedAnimal.identificador ||
                        selectedAnimal.nombre_animal ||
                        "Animal"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedAnimal.especie?.nombre ||
                        "Especie no especificada"}
                      {selectedAnimal.color && ` • ${selectedAnimal.color}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hembrasEnFinca && hembrasEnFinca.length > 0 && !selectedAnimal && (
              <p className="text-xs text-muted-foreground">
                {hembrasEnFinca.length} hembra(s) disponible(s)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Estado</Label>
            <Select
              value={filtros.estado || "todos"}
              onValueChange={(value) =>
                setFiltros({
                  ...filtros,
                  estado: value === "todos" ? "" : value,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value={EstadoParto.PROGRAMADO}>
                  Programado
                </SelectItem>
                <SelectItem value={EstadoParto.EN_PROGRESO}>
                  En progreso
                </SelectItem>
                <SelectItem value={EstadoParto.COMPLETADO}>
                  Completado
                </SelectItem>
                <SelectItem value={EstadoParto.COMPLICADO}>
                  Complicado
                </SelectItem>
                <SelectItem value={EstadoParto.ABORTADO}>Abortado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de parto</Label>
            <Select
              value={filtros.tipo_parto || "todos"}
              onValueChange={(value) =>
                setFiltros({
                  ...filtros,
                  tipo_parto: value === "todos" ? "" : value,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value={TipoParto.NORMAL}>Normal</SelectItem>
                <SelectItem value={TipoParto.DISTOCICO}>Distócico</SelectItem>
                <SelectItem value={TipoParto.CESAREA}>Cesárea</SelectItem>
                <SelectItem value={TipoParto.MUERTE_NATAL}>
                  Muerte Natal
                </SelectItem>
                <SelectItem value={TipoParto.ABORTO}>Aborto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-2">
            <Label className="text-sm font-medium">Rango de fechas</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !filtros.fecha_desde && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.fecha_desde
                      ? format(filtros.fecha_desde, "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "Fecha desde"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filtros.fecha_desde}
                    onSelect={(date) =>
                      setFiltros({ ...filtros, fecha_desde: date, page: 1 })
                    }
                    initialFocus
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
                      !filtros.fecha_hasta && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.fecha_hasta
                      ? format(filtros.fecha_hasta, "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "Fecha hasta"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filtros.fecha_hasta}
                    onSelect={(date) =>
                      setFiltros({ ...filtros, fecha_hasta: date, page: 1 })
                    }
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Items por página</Label>
            <Select
              value={filtros.limit.toString()}
              onValueChange={(value) =>
                setFiltros({ ...filtros, limit: parseInt(value), page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isMobile && onApplyMobile && (
            <div className="col-span-full flex gap-2 pt-2">
              <Button onClick={onApplyMobile} className="flex-1">
                Aplicar filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersParto;
