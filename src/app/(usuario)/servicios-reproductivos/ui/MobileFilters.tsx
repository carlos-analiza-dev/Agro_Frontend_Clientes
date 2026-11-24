"use client";

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
import { enUS, es } from "date-fns/locale";
import { Building2, CalendarIcon, PawPrint, Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("mobileFiltersServicios");
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
        `${selectedAnimal.identificador || ""} - ${selectedAnimal.nombre_animal || t("animal.noName")}`,
      );
    } else {
      setSearchTerm("");
    }
  }, [selectedAnimal, t]);

  const handleSelectAnimal = (animalId: string) => {
    handleFilterChange("hembra_id", animalId);
    const animal = hembras?.find((a) => a.id === animalId);

    if (animal) {
      setSearchTerm(
        `${animal.identificador || ""} - ${animal.nombre_animal || t("animal.noName")}`,
      );
    }

    setIsSearchOpen(false);
  };

  const handleClearAnimal = () => {
    handleFilterChange("hembra_id", undefined);
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  const hembrasEnFinca = filtros.finca_id
    ? hembras?.filter((h) => h.finca?.id === filtros.finca_id)
    : hembras;

  const getOptionLabel = (value: string, fallback: string) => {
    const key = value.toLowerCase();
    const translationKey = `${fallback}.${key}`;

    return t.has(translationKey) ? t(translationKey) : value;
  };

  return (
    <Sheet open={filtrosVisibles} onOpenChange={setFiltrosVisibles}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <SheetHeader className="mb-4">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto pb-20">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("fields.farm")}
              </Label>

              <Select
                value={filtros.finca_id || ""}
                onValueChange={(value) => {
                  handleFilterChange("finca_id", value);
                  handleFilterChange("hembra_id", undefined);
                  setSearchTerm("");
                }}
                disabled={fincasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.farm")} />
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

            <div className="space-y-2" ref={searchRef}>
              <Label className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                {t("fields.female")}
              </Label>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />

                  <Input
                    placeholder={
                      selectedAnimal
                        ? `${selectedAnimal.identificador || selectedAnimal.nombre_animal || t("animal.generic")} ${t("animal.selected")}`
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
                      animalesLoading && "bg-gray-100 cursor-not-allowed",
                    )}
                    disabled={animalesLoading}
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
                            alt={t("animal.imageAlt", {
                              identifier: animal.identificador || "",
                            })}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            unoptimized
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {animal.identificador ||
                                animal.nombre_animal ||
                                t("animal.unidentified")}
                            </p>

                            <p className="text-xs text-gray-500">
                              {animal.especie?.nombre ||
                                t("animal.unspecifiedSpecies")}
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
                      alt={t("animal.imageAlt", {
                        identifier: selectedAnimal.identificador || "",
                      })}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      unoptimized
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {selectedAnimal.identificador ||
                          selectedAnimal.nombre_animal ||
                          t("animal.generic")}
                      </p>

                      <p className="text-xs text-gray-600">
                        {selectedAnimal.especie?.nombre ||
                          t("animal.unspecifiedSpecies")}
                        {selectedAnimal.color && ` • ${selectedAnimal.color}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hembrasEnFinca &&
                hembrasEnFinca.length > 0 &&
                !selectedAnimal && (
                  <p className="text-xs text-muted-foreground">
                    {t("animal.availableFemales", {
                      count: hembrasEnFinca.length,
                    })}
                  </p>
                )}

              {filtros.finca_id && hembrasEnFinca?.length === 0 && (
                <p className="text-xs text-amber-600">
                  ⚠️ {t("animal.noFemalesInFarm")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("fields.serviceType")}</Label>

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
                  <SelectValue placeholder={t("placeholders.allTypes")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">{t("options.all")}</SelectItem>

                  {tipoReproduccionOptions.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {t.has(`serviceTypes.${tipo.value.toLowerCase()}`)
                        ? t(`serviceTypes.${tipo.value.toLowerCase()}`)
                        : tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("fields.status")}</Label>

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
                  <SelectValue placeholder={t("placeholders.allStatuses")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">{t("options.all")}</SelectItem>

                  {estadoReproductivo.map((estado) => (
                    <SelectItem key={estado.id} value={estado.value}>
                      {t.has(`statuses.${estado.value.toLowerCase()}`)
                        ? t(`statuses.${estado.value.toLowerCase()}`)
                        : estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("fields.successful")}</Label>

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
                  <SelectValue placeholder={t("options.all")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">{t("options.all")}</SelectItem>
                  <SelectItem value="true">{t("options.yes")}</SelectItem>
                  <SelectItem value="false">{t("options.no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("fields.dateFrom")}</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

                      {filtros.fecha_desde ? (
                        format(new Date(filtros.fecha_desde), "dd/MM/yyyy", {
                          locale: dateLocale,
                        })
                      ) : (
                        <span className="truncate">
                          {t("placeholders.selectDate")}
                        </span>
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
                      locale={dateLocale}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t("fields.dateTo")}</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

                      {filtros.fecha_hasta ? (
                        format(new Date(filtros.fecha_hasta), "dd/MM/yyyy", {
                          locale: dateLocale,
                        })
                      ) : (
                        <span className="truncate">
                          {t("placeholders.selectDate")}
                        </span>
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
                      locale={dateLocale}
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
              {t("buttons.applyFilters")}
            </Button>

            <Button
              variant="outline"
              onClick={limpiarFiltros}
              aria-label={t("buttons.clearFilters")}
              title={t("buttons.clearFilters")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
