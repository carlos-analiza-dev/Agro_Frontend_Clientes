import {
  AgroInsumo,
  ResponseAgroInsumos,
} from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import Modal from "@/components/generics/Modal";
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
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Cog, Edit, Package, Truck } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import OptionsInsumos from "../escalas-insumos/OptionsInsumos";

interface Props {
  insumosData: ResponseAgroInsumos | undefined;
  handleEditInsumo: (insumo: AgroInsumo) => void;
  moneda: string;
  propietarioId: string;
}

const TableAgroInsumos = ({
  insumosData,
  handleEditInsumo,
  moneda,
  propietarioId,
}: Props) => {
  const t = useTranslations("tableAgroInsumos");

  const [openModalEscala, setOpenModalEscala] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<AgroInsumo | null>(null);

  const handleOpenModal = (insumo: AgroInsumo) => {
    setOpenModalEscala(true);
    setSelectedInsumo(insumo);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-semibold">{t("columns.code")}</TableHead>
            <TableHead className="font-semibold">{t("columns.name")}</TableHead>
            <TableHead className="font-semibold">
              {t("columns.brand")}
            </TableHead>
            <TableHead className="font-semibold">
              {t("columns.supplier")}
            </TableHead>
            <TableHead className="font-semibold text-right">
              {t("columns.cost")}
            </TableHead>
            <TableHead className="font-semibold">{t("columns.unit")}</TableHead>
            <TableHead className="font-semibold">{t("columns.date")}</TableHead>
            <TableHead className="font-semibold">
              {t("columns.status")}
            </TableHead>
            <TableHead className="font-semibold text-right">
              {t("columns.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!insumosData?.insumos || insumosData.insumos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-12 w-12 text-gray-300" />
                  <p className="text-sm font-medium">{t("empty.title")}</p>
                  <p className="text-xs text-gray-400">
                    {t("empty.description")}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            insumosData.insumos.map((insumo) => (
              <TableRow
                key={insumo.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-mono text-xs">
                  <Badge variant="outline" className="font-mono">
                    {insumo.codigo}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium">{insumo.nombre}</TableCell>

                <TableCell>
                  {insumo.marca?.nombre || t("values.notAvailable")}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-gray-400" />
                    <span className="text-sm truncate max-w-[120px]">
                      {insumo.proveedor?.nombre_legal ||
                        t("values.notAvailable")}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right font-medium">
                  {formatCurrency(insumo.costo, moneda)}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {insumo.unidad_venta}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm">
                  {formatDateOnly(insumo.createdAt)}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={insumo.disponible ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {insumo.disponible
                      ? t("status.available")
                      : t("status.unavailable")}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => handleOpenModal(insumo)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title={t("actions.configuration")}
                    id="config-escalas-descuentos-insumos"
                  >
                    <Cog className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => handleEditInsumo(insumo)}
                    type="button"
                    variant={"ghost"}
                    id="edit-insumo"
                    title={t("actions.edit")}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        open={openModalEscala}
        onOpenChange={setOpenModalEscala}
        title={t("modal.title", {
          name: selectedInsumo?.nombre ?? "",
        })}
        description={t("modal.description")}
        size="6xl"
        height="auto"
      >
        <div className="flex-1">
          <OptionsInsumos
            selectedInsumo={selectedInsumo}
            moneda={moneda}
            propietarioId={propietarioId}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TableAgroInsumos;
