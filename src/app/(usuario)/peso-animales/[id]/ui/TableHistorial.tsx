"use client";

import { useState, useMemo } from "react";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  historial: ResponseHistorialAnimal[] | undefined;
  rangoPeso?: {
    minimo: number;
    maximo: number;
  } | null;
}

const TableHistorial = ({ historial, rangoPeso }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  }, [historial, currentPage]);

  if (!historial || historial.length === 0) {
    return (
      <div className="w-full rounded-md border">
        <div className="text-center py-12 text-gray-500">
          No hay registros de peso para este animal
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto rounded-md border">
        <div className="min-w-[640px]">
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
                <TableHead className="text-center">Peso</TableHead>
                <TableHead className="text-center">Fecha</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Observaciones</TableHead>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default TableHistorial;
