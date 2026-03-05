"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import useGananciaMensual from "@/hooks/dashboard/useGetGananciaPesoAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getNombreMes } from "@/helpers/data/meses";
import { Buscador } from "@/components/generics/Buscador";

const GananciaPesoAnimalMes = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";

  const { data: animales } = useGetAnimalesPropietario(clienteId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [selectedAnimalNombre, setSelectedAnimalNombre] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGananciaMensual(selectedAnimalId, year);

  const filteredAnimales = useMemo(() => {
    if (!animales?.data || !searchTerm) return [];

    return animales.data.filter(
      (animal: any) =>
        animal.identificador
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        animal.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [animales, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];

    const sortedData = [...data].sort((a, b) => a.mes - b.mes);

    return sortedData.map((item) => ({
      mes: getNombreMes(item.mes),
      mesNumero: item.mes,
      ganancia: item.ganancia,
      pesoInicial: item.pesoInicial,
      pesoFinal: item.pesoFinal,
    }));
  }, [data]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setShowDropdown(true);
  };

  const handleSearchFocus = () => {
    if (searchTerm && filteredAnimales.length > 0) {
      setShowDropdown(true);
    }
  };

  const getChartMargin = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        // Móvil
        return { top: 10, right: 10, left: 0, bottom: 20 };
      } else if (window.innerWidth < 768) {
        return { top: 15, right: 15, left: 10, bottom: 25 };
      } else {
        return { top: 20, right: 30, left: 20, bottom: 30 };
      }
    }
    return { top: 20, right: 30, left: 20, bottom: 30 };
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Ganancia de peso mensual
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Busca un animal por identificador y selecciona un año
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative w-full sm:flex-1" ref={dropdownRef}>
            <Buscador
              title="Buscar por identificador..."
              setSearchTerm={handleSearchChange}
              searchTerm={searchTerm}
              className="w-full"
              onFocus={handleSearchFocus}
            />

            {showDropdown && searchTerm && filteredAnimales.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                {filteredAnimales.map((animal: any) => (
                  <div
                    key={animal.id}
                    className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-sm sm:text-base"
                    onClick={() => {
                      setSelectedAnimalId(animal.id);
                      setSelectedAnimalNombre(
                        animal.identificador ||
                          animal.nombre ||
                          "Sin identificar",
                      );
                      setSearchTerm(
                        animal.identificador || animal.nombre || "",
                      );
                      setShowDropdown(false);
                    }}
                  >
                    <div className="font-medium truncate">
                      {animal.identificador || "Sin identificador"}
                    </div>
                    {animal.nombre && (
                      <div className="text-xs sm:text-sm text-gray-600 truncate">
                        {animal.nombre}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showDropdown && searchTerm && filteredAnimales.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 sm:p-4 text-center text-gray-500 text-sm">
                No se encontraron animales
              </div>
            )}
          </div>

          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={2000}
            max={2030}
            placeholder="Año"
            className="w-full sm:w-32 md:w-40"
          />
        </div>

        {selectedAnimalNombre && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 break-words max-w-full">
              <span className="font-semibold">Animal seleccionado:</span>{" "}
              <span className="break-all">{selectedAnimalNombre}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAnimalId("");
                setSelectedAnimalNombre("");
                setSearchTerm("");
              }}
              className="text-blue-800 hover:text-blue-900 text-xs sm:text-sm w-full sm:w-auto"
            >
              Limpiar
            </Button>
          </div>
        )}

        {chartData.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={getChartMargin()}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="mes"
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    angle={
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? -30
                        : 0
                    }
                    textAnchor={
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? "end"
                        : "middle"
                    }
                    height={
                      typeof window !== "undefined" && window.innerWidth < 640
                        ? 50
                        : 30
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "ganancia")
                        return [`${value} kg`, "Ganancia"];
                      if (name === "pesoInicial")
                        return [`${value} kg`, "Peso Inicial"];
                      if (name === "pesoFinal")
                        return [`${value} kg`, "Peso Final"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />

                  <Line
                    type="monotone"
                    dataKey="ganancia"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Ganancia"
                  >
                    <LabelList
                      dataKey="ganancia"
                      position="top"
                      formatter={(value: number) =>
                        typeof window !== "undefined" && window.innerWidth < 640
                          ? `${value}`
                          : `${value} kg`
                      }
                      fontSize={10}
                      offset={5}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 sm:mt-6 overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-3 sm:px-0">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 whitespace-nowrap">
                        Mes
                      </th>
                      <th className="text-right py-2 px-2 sm:px-4 whitespace-nowrap">
                        Peso Inicial
                      </th>
                      <th className="text-right py-2 px-2 sm:px-4 whitespace-nowrap">
                        Peso Final
                      </th>
                      <th className="text-right py-2 pl-2 sm:pl-4 whitespace-nowrap">
                        Ganancia
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium whitespace-nowrap">
                          {item.mes}
                        </td>
                        <td className="text-right py-2 px-2 sm:px-4 whitespace-nowrap">
                          {item.pesoInicial} kg
                        </td>
                        <td className="text-right py-2 px-2 sm:px-4 whitespace-nowrap">
                          {item.pesoFinal} kg
                        </td>
                        <td className="text-right py-2 pl-2 sm:pl-4 whitespace-nowrap">
                          <span
                            className={
                              item.ganancia > 0
                                ? "text-green-600 font-semibold"
                                : "text-red-600"
                            }
                          >
                            {item.ganancia > 0 ? "+" : ""}
                            {item.ganancia} kg
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 sm:h-48 md:h-64 text-gray-500 text-sm sm:text-base">
            {selectedAnimalId
              ? "No hay datos para este animal en el año seleccionado"
              : "Busca y selecciona un animal para ver los datos"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GananciaPesoAnimalMes;
