"use client";
import { RentabilidadPorFinca } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import Paginacion from "@/components/generics/Paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Props {
  rentabilidadFincas: RentabilidadPorFinca[] | undefined;
  moneda: string;
}

const ITEMS_PER_PAGE = 5;

const CardDetailsRentFincas = ({ rentabilidadFincas = [], moneda }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rentabilidadFincas.length / ITEMS_PER_PAGE);

  const paginatedData = rentabilidadFincas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Detalle por Finca
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Finca</th>
                <th className="px-4 py-2 text-right">Ingresos</th>
                <th className="px-4 py-2 text-right">Gastos</th>
                <th className="px-4 py-2 text-right">Rentabilidad</th>
                <th className="px-4 py-2 text-right">Margen</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((finca, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 font-medium">{finca.fincaNombre}</td>

                  <td className="px-4 py-2 text-right text-green-600">
                    {moneda}
                    {finca.ingresos.toLocaleString()}
                  </td>

                  <td className="px-4 py-2 text-right text-red-600">
                    {moneda}
                    {finca.gastos.toLocaleString()}
                  </td>

                  <td
                    className={`px-4 py-2 text-right font-semibold ${
                      finca.rentabilidad >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {moneda}
                    {finca.rentabilidad.toLocaleString()}
                  </td>

                  <td
                    className={`px-4 py-2 text-right ${
                      finca.margen >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {finca.margen.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {paginatedData.map((finca, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <h3 className="font-medium text-sm mb-2">{finca.fincaNombre}</h3>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ingresos</span>
                <span className="text-green-600 font-medium">
                  {moneda}
                  {finca.ingresos.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gastos</span>
                <span className="text-red-600 font-medium">
                  {moneda}
                  {finca.gastos.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rentabilidad</span>
                <span
                  className={`font-semibold ${
                    finca.rentabilidad >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moneda}
                  {finca.rentabilidad.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Margen</span>
                <span
                  className={
                    finca.margen >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {finca.margen.toFixed(2)}%
                </span>
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

export default CardDetailsRentFincas;
