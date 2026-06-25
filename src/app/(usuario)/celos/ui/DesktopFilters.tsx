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
import { CalendarIcon, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { ResponseFincasByPropietario } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedAnimal = hembras?.find(
    (animal) => animal.id === tempFiltros.animalId,
  );

  const filteredHembras =
    hembras?.filter((animal) => {
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

  const handleSelectAnimal = (animalId: string) => {
    handleFilterChange("animalId", animalId);
    const animal = hembras?.find((a) => a.id === animalId);
    if (animal) {
      setSearchTerm(
        `${animal.identificador || ""} - ${animal.nombre_animal || "Sin nombre"}`,
      );
    }
    setIsSearchOpen(false);
  };

  const handleClearAnimal = () => {
    handleFilterChange("animalId", "");
    setSearchTerm("");
    setIsSearchOpen(false);
  };

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

            <div className="space-y-2" ref={searchRef}>
              <Label htmlFor="animalSearch">Animal</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  <Input
                    id="animalSearch"
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
                      if (!tempFiltros.fincaId) {
                        return;
                      }
                      if (searchTerm) {
                        setIsSearchOpen(true);
                      }
                    }}
                    className={cn(
                      "pl-9 pr-10",
                      selectedAnimal && "bg-blue-50 border-blue-300",
                      !tempFiltros.fincaId && "bg-gray-100 cursor-not-allowed",
                    )}
                    disabled={!tempFiltros.fincaId || animalesLoading}
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

                {!tempFiltros.fincaId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecciona una finca primero
                  </p>
                )}

                {isSearchOpen && searchTerm && tempFiltros.fincaId && (
                  <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                    {filteredHembras.length > 0 ? (
                      filteredHembras.map((animal) => (
                        <div
                          key={animal.id}
                          onClick={() => handleSelectAnimal(animal.id)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                            tempFiltros.animalId === animal.id && "bg-blue-50",
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
                          {tempFiltros.animalId === animal.id && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm">
                        <p className="text-gray-500">
                          No se encontraron hembras
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Intenta con otro término de búsqueda
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
