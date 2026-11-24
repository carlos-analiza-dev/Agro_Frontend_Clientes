"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Building,
  Search,
  Beef,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Finca {
  id: string;
  nombre_finca: string;
  ubicacion: string;
}

interface Animal {
  id: string;
  identificador: string;
  especie?: { nombre: string };
  razas?: { nombre: string }[];
}

interface Filtros {
  fincaNombre: string;
  identificador: string;
  fechaInicio: string;
  fechaFin: string;
}

interface FiltrosBusquedaProps {
  filtros: Filtros;
  fincasFiltradas: Finca[];
  animalesFiltrados: Animal[];
  handleFiltroChange: (campo: keyof Filtros, valor: string) => void;
  handleSeleccionarFinca: (nombre: string) => void;
  handleSeleccionarAnimal: (identificador: string) => void;
  limpiarFiltros: () => void;
}

export const FiltrosBusqueda = ({
  filtros,
  fincasFiltradas,
  animalesFiltrados,
  handleFiltroChange,
  handleSeleccionarFinca,
  handleSeleccionarAnimal,
  limpiarFiltros,
}: FiltrosBusquedaProps) => {
  const t = useTranslations("filtrosBusqueda");

  const [busquedaFinca, setBusquedaFinca] = useState("");
  const [busquedaAnimal, setBusquedaAnimal] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              {t("fields.farm")}
            </label>

            <div className="relative">
              <Input
                type="text"
                placeholder={t("placeholders.farm")}
                value={busquedaFinca}
                onChange={(e) => setBusquedaFinca(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {filtros.fincaNombre && (
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                <span className="text-sm text-blue-700">
                  {filtros.fincaNombre}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFiltroChange("fincaNombre", "")}
                  className="h-6 w-6 p-0 hover:bg-blue-100"
                  aria-label={t("buttons.removeFarmFilter")}
                  title={t("buttons.removeFarmFilter")}
                >
                  ×
                </Button>
              </div>
            )}

            {busquedaFinca && fincasFiltradas.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {fincasFiltradas.map((finca) => (
                  <button
                    type="button"
                    key={finca.id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleSeleccionarFinca(finca.nombre_finca)}
                  >
                    <div className="font-medium">{finca.nombre_finca}</div>
                    <div className="text-sm text-gray-500">
                      {finca.ubicacion}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium flex items-center gap-2">
              <Beef className="h-4 w-4" />
              {t("fields.animal")}
            </label>

            <div className="relative">
              <Input
                type="text"
                placeholder={t("placeholders.animal")}
                value={busquedaAnimal}
                onChange={(e) => setBusquedaAnimal(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {filtros.identificador && (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                <span className="text-sm text-green-700">
                  {filtros.identificador}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFiltroChange("identificador", "")}
                  className="h-6 w-6 p-0 hover:bg-green-100"
                  aria-label={t("buttons.removeAnimalFilter")}
                  title={t("buttons.removeAnimalFilter")}
                >
                  ×
                </Button>
              </div>
            )}

            {busquedaAnimal && animalesFiltrados.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {animalesFiltrados.map((animal) => (
                  <button
                    type="button"
                    key={animal.id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() =>
                      handleSeleccionarAnimal(animal.identificador)
                    }
                  >
                    <div className="font-medium">{animal.identificador}</div>
                    <div className="text-sm text-gray-500">
                      {animal.especie?.nombre} - {animal.razas?.[0]?.nombre}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t("fields.startDate")}
            </label>

            <Input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) =>
                handleFiltroChange("fechaInicio", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t("fields.endDate")}
            </label>

            <Input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={limpiarFiltros}
            className="flex items-center gap-2"
          >
            {t("buttons.clearFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
