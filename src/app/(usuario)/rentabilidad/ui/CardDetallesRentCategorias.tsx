"use client";
import { RentabilidadPorCategoria } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import Paginacion from "@/components/generics/Paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Props {
  rentabilidadCategorias: RentabilidadPorCategoria[] | undefined;
  moneda: string;
}

const ITEMS_PER_PAGE = 5;

const CardDetallesRentCategorias = ({
  rentabilidadCategorias = [],
  moneda,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rentabilidadCategorias.length / ITEMS_PER_PAGE);

  const paginatedData = rentabilidadCategorias.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Detalle por Categoría
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Categoría</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-right">Monto</th>
                <th className="px-4 py-2 text-right">Porcentaje</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((categoria, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    {categoria.categoria.replace(/_/g, " ")}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        categoria.tipo === "ingreso"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {categoria.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right">
                    {moneda}
                    {categoria.monto.toLocaleString()}
                  </td>

                  <td className="px-4 py-2 text-right">
                    {categoria.porcentaje.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {paginatedData.map((categoria, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">
                  {categoria.categoria.replace(/_/g, " ")}
                </h3>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    categoria.tipo === "ingreso"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {categoria.tipo === "ingreso" ? "Ingreso" : "Gasto"}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500">Monto</span>
                <span className="font-medium">
                  {moneda}
                  {categoria.monto.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Porcentaje</span>
                <span>{categoria.porcentaje.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <p className="text-xs text-gray-500">
            Página {currentPage} de {totalPages}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDetallesRentCategorias;
