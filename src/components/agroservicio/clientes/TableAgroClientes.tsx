"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Mail, Phone } from "lucide-react";
import { useSexoBadge } from "./getSexoBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClienteAgro } from "@/api/agroservicio/clientes/interfaces/response-clientes-ago.interface";
import ModalProductosFrecuentes from "./ModalProductosFrecuentes";

interface Props {
  clientes: ClienteAgro[];
  handleEditCliente: (cliente: ClienteAgro) => void;
  simbolo?: string;
}

const TableAgroClientes = ({
  clientes,
  handleEditCliente,
  simbolo = "L ",
}: Props) => {
  const t = useTranslations("agroClientesPage");
  const { getSexoBadge } = useSexoBadge();
  const [selectedCliente, setSelectedCliente] = useState<ClienteAgro | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewProductos = (cliente: ClienteAgro) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                {t("table.columns.customer")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
                {t("table.columns.identification")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">
                {t("table.columns.contact")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden xl:table-cell">
                {t("table.columns.location")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                {t("table.columns.gender")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">
                {t("table.columns.status")}
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                {t("table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow
                key={cliente.id}
                className="hover:bg-blue-50/50 transition-colors duration-200"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {cliente.nombre}
                    </span>
                    <span className="text-xs text-gray-400 md:hidden">
                      {t("table.labels.id")}: {cliente.identificacion}
                    </span>
                    <span className="text-xs text-gray-400 lg:hidden">
                      {cliente.telefono}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-sm">
                  {cliente.identificacion}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {cliente.telefono}
                    </span>
                    {cliente.email && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {cliente.email}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-700">{cliente.direccion}</span>
                    <span className="text-gray-400 text-xs">
                      {cliente.municipio?.nombre},{" "}
                      {cliente.departamento?.nombre}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getSexoBadge(cliente.sexo)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant={cliente.isActive ? "default" : "secondary"}
                    className={
                      cliente.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : ""
                    }
                  >
                    {cliente.isActive
                      ? t("table.status.active")
                      : t("table.status.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      title={t("table.actions.edit")}
                      aria-label={t("table.actions.edit")}
                      onClick={() => handleEditCliente(cliente)}
                      id="id-edit-cliente"
                    >
                      <span className="sr-only">{t("table.actions.edit")}</span>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      title={t("table.actions.viewFrequentProducts")}
                      aria-label={t("table.actions.viewFrequentProducts")}
                      onClick={() => handleViewProductos(cliente)}
                      id="id-ver-productos"
                    >
                      <span className="sr-only">
                        {t("table.actions.viewFrequentProducts")}
                      </span>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ModalProductosFrecuentes
        open={modalOpen}
        onOpenChange={setModalOpen}
        cliente={selectedCliente}
        simbolo={simbolo}
      />
    </>
  );
};

export default TableAgroClientes;
