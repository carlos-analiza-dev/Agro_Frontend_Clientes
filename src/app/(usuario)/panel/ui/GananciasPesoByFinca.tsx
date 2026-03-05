"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import useGetGananciaPesoByFinca from "@/hooks/dashboard/useGetGananciaPesoByFinca";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
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

const GananciasPesoByFinca = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";

  const { data: fincas, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFincaId, setSelectedFincaId] = useState("");
  const [selectedFincaNombre, setSelectedFincaNombre] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: gananciaData, isLoading: gananciaLoading } =
    useGetGananciaPesoByFinca(selectedFincaId, year);

  const filteredFincas = useMemo(() => {
    if (!fincas || !searchTerm) return [];

    return fincas.data.fincas.filter((finca) =>
      finca.nombre_finca?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [fincas, searchTerm]);

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
    if (!gananciaData) return [];

    const sortedData = [...gananciaData].sort((a, b) => a.mes - b.mes);

    return sortedData.map((item) => ({
      mes: getNombreMes(item.mes),
      mesNumero: item.mes,
      ganancia: Number(item.gananciaPromedio.toFixed(2)),
    }));
  }, [gananciaData]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setShowDropdown(true);
  };

  const handleSearchFocus = () => {
    if (searchTerm && filteredFincas.length > 0) {
      setShowDropdown(true);
    }
  };

  const getChartMargin = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
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
          Ganancia de peso por finca
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Busca una finca y selecciona un año para ver la ganancia promedio
          mensual
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative w-full sm:flex-1" ref={dropdownRef}>
            <Buscador
              title="Buscar finca por nombre..."
              setSearchTerm={handleSearchChange}
              searchTerm={searchTerm}
              className="w-full"
              onFocus={handleSearchFocus}
            />

            {showDropdown && searchTerm && filteredFincas.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                {filteredFincas.map((finca) => (
                  <div
                    key={finca.id}
                    className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-sm sm:text-base"
                    onClick={() => {
                      setSelectedFincaId(finca.id);
                      setSelectedFincaNombre(finca.nombre_finca);
                      setSearchTerm(finca.nombre_finca);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="font-medium truncate">
                      {finca.nombre_finca}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showDropdown && searchTerm && filteredFincas.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-3 sm:p-4 text-center text-gray-500 text-sm">
                No se encontraron fincas
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

        {selectedFincaNombre && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 break-words max-w-full">
              <span className="font-semibold">Finca seleccionada:</span>{" "}
              <span className="break-all">{selectedFincaNombre}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFincaId("");
                setSelectedFincaNombre("");
                setSearchTerm("");
              }}
              className="text-blue-800 hover:text-blue-900 text-xs sm:text-sm w-full sm:w-auto"
            >
              Limpiar
            </Button>
          </div>
        )}

        {selectedFincaId && (
          <>
            {gananciaLoading ? (
              <div className="flex justify-center items-center h-32 sm:h-48 md:h-64">
                <p className="text-gray-500">Cargando datos...</p>
              </div>
            ) : chartData.length > 0 ? (
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
                          typeof window !== "undefined" &&
                          window.innerWidth < 640
                            ? -30
                            : 0
                        }
                        textAnchor={
                          typeof window !== "undefined" &&
                          window.innerWidth < 640
                            ? "end"
                            : "middle"
                        }
                        height={
                          typeof window !== "undefined" &&
                          window.innerWidth < 640
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
                        formatter={(value: number) => [
                          `${value} kg`,
                          "Ganancia Promedio",
                        ]}
                        labelFormatter={(label) => `Mes: ${label}`}
                      />

                      <Line
                        type="monotone"
                        dataKey="ganancia"
                        stroke="#16a34a"
                        strokeWidth={2}
                        name="Ganancia Promedio"
                      >
                        <LabelList
                          dataKey="ganancia"
                          position="top"
                          formatter={(value: number) =>
                            typeof window !== "undefined" &&
                            window.innerWidth < 640
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
                            Ganancia Promedio
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
                              <span className="text-green-600 font-semibold">
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
                No hay datos para esta finca en el año {year}
              </div>
            )}
          </>
        )}

        {!selectedFincaId && (
          <div className="flex justify-center items-center h-32 sm:h-48 md:h-64 text-gray-500 text-sm sm:text-base">
            Busca y selecciona una finca para ver los datos
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GananciasPesoByFinca;
