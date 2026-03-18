"use client";

import { useState, useMemo, useEffect } from "react";
import { ResponseHistorialAnimal } from "@/api/peso-promedio-animal/interfaces/obtener-historial-pesos-animal.interface";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import Paginacion from "@/components/generics/Paginacion";

interface Props {
  historial: ResponseHistorialAnimal[] | undefined;
  animalId: string;
  onEdit: (registro: ResponseHistorialAnimal) => void;
  rangoPeso?: {
    minimo: number;
    maximo: number;
  } | null;
}

const TableHistorial = ({ historial, animalId, onEdit, rangoPeso }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const itemsPerPage = isMobile ? 5 : 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [historial, isMobile]);

  const getPesoStatus = (peso: number) => {
    if (!rangoPeso) return null;

    if (peso < rangoPeso.minimo) {
      return {
        label: "Bajo",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
      };
    }
    if (peso > rangoPeso.maximo) {
      return {
        label: "Alto",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
      };
    }
    return {
      label: "Normal",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
    };
  };

  const totalItems = historial?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = useMemo(() => {
    if (!historial) return [];
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return historial.slice(start, end);
  }, [historial, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!historial || historial.length === 0) {
    return (
      <div className="w-full rounded-md border">
        <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
          No hay registros de peso para este animal
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        <div className="text-sm text-gray-500 mb-2 px-1">
          {rangoPeso ? (
            <span>
              Rango esperado: {rangoPeso.minimo} - {rangoPeso.maximo} Kg
            </span>
          ) : (
            "Historial de pesos"
          )}
        </div>

        <div className="space-y-3">
          {paginatedData.map((item) => {
            const status = getPesoStatus(Number(item.peso));
            const StatusIcon = status?.icon || AlertCircle;

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {item.peso} Kg
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.fecha}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Editar registro"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>

                  {status && (
                    <div className="mb-2">
                      <Badge variant="outline" className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Observaciones: </span>
                    <span className="text-gray-500">
                      {item.observaciones || "Sin observaciones"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Vista Desktop
  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto rounded-md border">
        <div className="min-w-[768px]">
          <Table>
            <TableCaption className="bg-gray-50 py-2">
              {rangoPeso ? (
                <span className="text-sm">
                  Rango esperado: {rangoPeso.minimo} - {rangoPeso.maximo} Kg
                </span>
              ) : (
                "Historial de pesos"
              )}
            </TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-center">Peso (Kg)</TableHead>
                <TableHead className="text-center">Fecha</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Observaciones</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => {
                const status = getPesoStatus(Number(item.peso));
                const StatusIcon = status?.icon || AlertCircle;

                return (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-center font-medium">
                      {item.peso} Kg
                    </TableCell>
                    <TableCell className="text-center">{item.fecha}</TableCell>
                    <TableCell className="text-center">
                      {status && (
                        <Badge variant="outline" className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center max-w-xs truncate">
                      {item.observaciones || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar registro"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="mt-4">
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHistorial;
