"use client";

import { useTranslations, useLocale } from "next-intl";
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
  const t = useTranslations("cardDetailsRentFincas");
  const locale = useLocale();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rentabilidadFincas.length / ITEMS_PER_PAGE);

  const paginatedData = rentabilidadFincas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const formatAmount = (amount: number) =>
    amount.toLocaleString(locale === "en" ? "en-US" : "es-HN");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">{t("columns.farm")}</th>
                <th className="px-4 py-2 text-right">{t("columns.income")}</th>
                <th className="px-4 py-2 text-right">
                  {t("columns.expenses")}
                </th>
                <th className="px-4 py-2 text-right">
                  {t("columns.profitability")}
                </th>
                <th className="px-4 py-2 text-right">{t("columns.margin")}</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((finca, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 font-medium">{finca.fincaNombre}</td>

                  <td className="px-4 py-2 text-right text-green-600">
                    {moneda}
                    {formatAmount(finca.ingresos)}
                  </td>

                  <td className="px-4 py-2 text-right text-red-600">
                    {moneda}
                    {formatAmount(finca.gastos)}
                  </td>

                  <td
                    className={`px-4 py-2 text-right font-semibold ${
                      finca.rentabilidad >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {moneda}
                    {formatAmount(finca.rentabilidad)}
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
                <span className="text-gray-500">{t("columns.income")}</span>
                <span className="text-green-600 font-medium">
                  {moneda}
                  {formatAmount(finca.ingresos)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("columns.expenses")}</span>
                <span className="text-red-600 font-medium">
                  {moneda}
                  {formatAmount(finca.gastos)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {t("columns.profitability")}
                </span>
                <span
                  className={`font-semibold ${
                    finca.rentabilidad >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moneda}
                  {formatAmount(finca.rentabilidad)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("columns.margin")}</span>
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
            {t("pagination.page", {
              current: currentPage,
              total: totalPages,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDetailsRentFincas;
