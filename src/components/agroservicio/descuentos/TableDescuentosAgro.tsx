import { ResponseDescuentosAgroInterface } from "@/api/agroservicio/descuentos/interface/response-descuentos-agro.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";

interface Props {
  descuentos: ResponseDescuentosAgroInterface[];
  handleEdit: (descuento: ResponseDescuentosAgroInterface) => void;
}

const TableDescuentosAgro = ({ descuentos, handleEdit }: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">
              Nombre
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">
              Porcentaje
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Agroservicio
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {descuentos.map((descuento) => (
            <TableRow
              key={descuento.id}
              className="hover:bg-blue-50/50 transition-colors duration-200"
            >
              <TableCell className="font-medium text-gray-800">
                {descuento.nombre}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-200 text-sm font-semibold px-3 py-1"
                >
                  {descuento.porcentaje} %
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">
                    {descuento.agroservicio.nombre_agroservicio}
                  </span>
                  {descuento.agroservicio.logo && (
                    <img
                      src={descuento.agroservicio.logo.url}
                      alt={descuento.agroservicio.nombre_agroservicio}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(descuento)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDescuentosAgro;
