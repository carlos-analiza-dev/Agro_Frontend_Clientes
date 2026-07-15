import { Sucursale } from "@/api/agroservicio/agro-sucursales/interface/response-sucursales-agro.interface";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Building2, Globe, User } from "lucide-react";
import React from "react";

interface Props {
  isLoading: boolean;
  limit: number;
  currentData: Sucursale[];
  offset: number;
}

const TableSucursalesAgro = ({
  currentData,
  isLoading,
  limit,
  offset,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50">
          <TableHead className="font-semibold">#</TableHead>
          <TableHead className="font-semibold">Nombre</TableHead>
          <TableHead className="font-semibold hidden md:table-cell">
            Ubicación
          </TableHead>
          <TableHead className="font-semibold hidden lg:table-cell">
            Dirección
          </TableHead>
          <TableHead className="font-semibold hidden sm:table-cell">
            Gerente
          </TableHead>
          <TableHead className="font-semibold hidden xl:table-cell">
            Fecha creación
          </TableHead>
          <TableHead className="font-semibold text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: limit }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : currentData.length > 0 ? (
          currentData.map((sucursal, index) => (
            <TableRow key={sucursal.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                {offset + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{sucursal.nombre}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1 text-sm">
                  <Globe className="h-3 w-3 text-gray-400" />
                  <span>{sucursal.municipio.nombre},</span>
                  <span>{sucursal.departamento.nombre}</span>
                  <Badge variant="outline" className="ml-1 text-xs">
                    {sucursal.pais.nombre}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                <span className="text-sm text-gray-600">
                  {sucursal.direccion_complemento || "Sin dirección"}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {sucursal.gerente ? (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{sucursal.gerente}</span>
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Sin asignar
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm text-gray-500">
                  {formatDateOnly(sucursal.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <button
                    className="p-1 hover:bg-blue-50 rounded transition-colors"
                    onClick={() => {}}
                  >
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    onClick={() => {}}
                  >
                    <svg
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Building2 className="h-12 w-12 text-gray-300" />
                <p>No hay sucursales registradas</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableSucursalesAgro;
