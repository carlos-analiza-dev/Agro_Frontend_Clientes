"use client";

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
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("cardFiltersServicios");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedAnimal = hembras?.find(
    (animal) => animal.id === filtros.hembra_id,
  );

  // Filtrar hembras por término de búsqueda y finca
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

  // Cerrar buscador al hacer clic fuera
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

  // Actualizar searchTerm cuando se selecciona un animal desde el padre
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

  // Filtrar hembras por finca para el badge de cantidad
  const hembrasFiltradasPorFinca = filtros.finca_id
    ? hembras?.filter((h) => h.finca?.id === filtros.finca_id)
    : hembras;

  const getEstadoLabel = (value: string, fallback: string) => {
    const key = `statuses.${value.toLowerCase()}`;
    return t.has(key) ? t(key) : fallback;
  };

  const getTipoLabel = (value: string, fallback: string) => {
    const key = `serviceTypes.${value.toLowerCase()}`;
    return t.has(key) ? t(key) : fallback;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{t("title")}</span>
          <Badge variant="outline" className="ml-2">
            {fincaSeleccionada?.nombre_finca || t("farms.all")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>{t("fields.farm")}</Label>
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
                <SelectValue placeholder={t("placeholders.selectFarm")} />
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
            <Label>{t("fields.female")}</Label>
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

            {hembrasFiltradasPorFinca &&
              hembrasFiltradasPorFinca.length > 0 &&
              !selectedAnimal && (
                <p className="text-xs text-muted-foreground">
                  {t("animal.availableFemales", {
                    count: hembrasFiltradasPorFinca.length,
                  })}
                </p>
              )}
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
                <SelectValue placeholder={t("placeholders.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t("options.all")}</SelectItem>
                {estadoReproductivo.map((estado) => (
                  <SelectItem key={estado.id} value={estado.value}>
                    {getEstadoLabel(estado.value, estado.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={() => refetch()} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              {t("buttons.search")}
            </Button>
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              size="icon"
              aria-label={t("buttons.clearFilters")}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => refetch()}
              size="icon"
              aria-label={t("buttons.refresh")}
            >
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
              {t("advancedFilters")}
            </summary>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("fields.type")}</Label>
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
                    <SelectValue placeholder={t("options.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{t("options.all")}</SelectItem>
                    {tipoReproduccionOptions.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {getTipoLabel(tipo.value, tipo.label)}
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

              <div className="space-y-2">
                <Label>{t("fields.dateFrom")}</Label>
                <Input
                  type="date"
                  value={filtros.fecha_desde || ""}
                  onChange={(e) =>
                    handleFilterChange("fecha_desde", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("fields.dateTo")}</Label>
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
