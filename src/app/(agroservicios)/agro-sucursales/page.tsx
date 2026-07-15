"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetSucursalesAgro from "@/hooks/agroservicios/sucursales/useGetSucursalesAgro";
import { House, Building2, Globe, User } from "lucide-react";
import { useState, useEffect } from "react";
import Paginacion from "@/components/generics/Paginacion";
import { Card, CardContent } from "@/components/ui/card";
import TableSucursalesAgro from "./ui/TableSucursalesAgro";
import { StatCard } from "@/components/generics/StatCard";

const AgroSucursalesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const offset = (currentPage - 1) * limit;

  const { data, isLoading, refetch } = useGetSucursalesAgro({
    limit: limit,
    offset: offset,
  });

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const currentData = data?.sucursales || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage Icon={House} title="Control de sucursales" />
        <ButtonAdd
          title="Agregar Sucursal"
          Icon={House}
          action={() => {}}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <TableSucursalesAgro
              isLoading={isLoading}
              limit={limit}
              currentData={currentData}
              offset={offset}
            />
          </div>
        </CardContent>
      </Card>

      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <div className="text-sm text-gray-500">
            Mostrando{" "}
            <span className="font-medium">
              {Math.min(offset + 1, totalItems)}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(offset + limit, totalItems)}
            </span>{" "}
            de <span className="font-medium">{totalItems}</span> sucursales
          </div>
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {!isLoading && currentData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <StatCard
            title="Total sucursales"
            value={totalItems}
            icon={Building2}
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100"
            iconColor="text-blue-600"
            textColor="text-blue-900"
          />

          <StatCard
            title="Países"
            value={new Set(currentData.map((s) => s.pais.nombre)).size}
            icon={Globe}
            gradientFrom="from-green-50"
            gradientTo="to-green-100"
            iconColor="text-green-600"
            textColor="text-green-900"
          />

          <StatCard
            title="Con gerente asignado"
            value={currentData.filter((s) => s.gerente).length}
            icon={User}
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100"
            iconColor="text-purple-600"
            textColor="text-purple-900"
          />
        </div>
      )}
    </div>
  );
};

export default AgroSucursalesPage;
