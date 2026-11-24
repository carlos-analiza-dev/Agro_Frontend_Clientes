"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { enUS, es } from "date-fns/locale";
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
  const t = useTranslations("filtersParto");
  const locale = useLocale();
  const dateLocale = locale === "en" ? enUS : es;

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
        `${selectedAnimal.identificador || ""} - ${selectedAnimal.nombre_animal || t("animalFallbacks.noName")}`,
      );
    } else {
      setSearchTerm("");
    }
  }, [selectedAnimal, t]);

  const handleSelectAnimal = (animalId: string) => {
    setFiltros({
      ...filtros,
      hembra_id: animalId,
      page: 1,
    });

    const animal = hembras?.find((a) => a.id === animalId);

    if (animal) {
      setSearchTerm(
        `${animal.identificador || ""} - ${animal.nombre_animal || t("animalFallbacks.noName")}`,
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
            {t("title")}
            {contarFiltrosActivos() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {t("activeFilters", { count: contarFiltrosActivos() })}
              </Badge>
            )}
          </CardTitle>

          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            {t("clear")}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("fields.farm")}</Label>
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
                <SelectValue placeholder={t("placeholders.farm")} />
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
            <Label className="text-sm font-medium">{t("fields.female")}</Label>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />

                <Input
                  placeholder={
                    selectedAnimal
                      ? t("placeholders.selectedAnimal", {
                          animal:
                            selectedAnimal.identificador ||
                            selectedAnimal.nombre_animal ||
                            t("animalFallbacks.animal"),
                        })
                      : t("placeholders.searchFemale")
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
                    aria-label={t("buttons.clearFemale")}
                    title={t("buttons.clearFemale")}
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
                              t("animalFallbacks.unidentified")}
                          </p>

                          <p className="text-xs text-gray-500">
                            {animal.especie?.nombre ||
                              t("animalFallbacks.unspecifiedSpecies")}
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
                          ? t("search.noFemalesInFarm")
                          : t("search.noFemales")}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {filtros.finca_id
                          ? t("search.changeFarmOrSearch")
                          : t("search.selectFarmOrSearch")}
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
                        t("animalFallbacks.animal")}
                    </p>

                    <p className="text-xs text-gray-600">
                      {selectedAnimal.especie?.nombre ||
                        t("animalFallbacks.unspecifiedSpecies")}
                      {selectedAnimal.color && ` • ${selectedAnimal.color}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hembrasEnFinca && hembrasEnFinca.length > 0 && !selectedAnimal && (
              <p className="text-xs text-muted-foreground">
                {t("availableFemales", { count: hembrasEnFinca.length })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("fields.status")}</Label>

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
                <SelectValue placeholder={t("placeholders.allStatuses")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todos">
                  {t("options.allStatuses")}
                </SelectItem>
                <SelectItem value={EstadoParto.PROGRAMADO}>
                  {t("statuses.programmed")}
                </SelectItem>
                <SelectItem value={EstadoParto.EN_PROGRESO}>
                  {t("statuses.inProgress")}
                </SelectItem>
                <SelectItem value={EstadoParto.COMPLETADO}>
                  {t("statuses.completed")}
                </SelectItem>
                <SelectItem value={EstadoParto.COMPLICADO}>
                  {t("statuses.complicated")}
                </SelectItem>
                <SelectItem value={EstadoParto.ABORTADO}>
                  {t("statuses.aborted")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("fields.birthType")}
            </Label>

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
                <SelectValue placeholder={t("placeholders.allBirthTypes")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todos">
                  {t("options.allBirthTypes")}
                </SelectItem>
                <SelectItem value={TipoParto.NORMAL}>
                  {t("birthTypes.normal")}
                </SelectItem>
                <SelectItem value={TipoParto.DISTOCICO}>
                  {t("birthTypes.dystocic")}
                </SelectItem>
                <SelectItem value={TipoParto.CESAREA}>
                  {t("birthTypes.cesarean")}
                </SelectItem>
                <SelectItem value={TipoParto.MUERTE_NATAL}>
                  {t("birthTypes.stillbirth")}
                </SelectItem>
                <SelectItem value={TipoParto.ABORTO}>
                  {t("birthTypes.abortion")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-2">
            <Label className="text-sm font-medium">
              {t("fields.dateRange")}
            </Label>

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
                          locale: dateLocale,
                        })
                      : t("placeholders.dateFrom")}
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
                    locale={dateLocale}
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
                          locale: dateLocale,
                        })
                      : t("placeholders.dateTo")}
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
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("fields.itemsPerPage")}
            </Label>

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
                {t("buttons.applyFilters")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersParto;
