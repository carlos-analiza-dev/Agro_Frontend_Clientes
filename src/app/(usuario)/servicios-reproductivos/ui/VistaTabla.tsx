"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import TipoServicioBadge from "./TipoServicioBadge";
import EstadoBadge from "./EstadoBadge";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/generics/Modal";
import { TipoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import FormServicioReproductivo from "./FormServicioReproductivo";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  servicios: Servicio[];
  hembras: Animal[];
  machos: Animal[];
  setSelectedServicio: Dispatch<SetStateAction<Servicio | null>>;
  selectedServicio: Servicio | null;
  handleOpenModal: (servicio: Servicio) => void;
  moneda: string;
}

const VistaTabla = ({
  servicios,
  hembras,
  machos,
  handleOpenModal,
  selectedServicio,
  setSelectedServicio,
  moneda,
}: Props) => {
  const t = useTranslations("vistaTablaServicios");
  const locale = useLocale();
  const dateLocale = locale === "en" ? enUS : es;

  const [openModalEdit, setOpenModalEdit] = useState(false);

  const handleOpenModalEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setOpenModalEdit(true);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.female")}</TableHead>
            <TableHead>{t("columns.male")}</TableHead>
            <TableHead className="hidden lg:table-cell">
              {t("columns.type")}
            </TableHead>
            <TableHead>{t("columns.date")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("columns.number")}
            </TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead>{t("columns.result")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {servicio.hembra.identificador}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {servicio.tipo_servicio !== TipoServicio.MONTA_NATURAL
                  ? servicio.proveedor_semen
                  : servicio.macho?.identificador}
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                <TipoServicioBadge tipo={servicio.tipo_servicio} />
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {format(new Date(servicio.fecha_servicio), "dd/MM/yy HH:mm", {
                  locale: dateLocale,
                })}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                #{servicio.numero_servicio}
              </TableCell>

              <TableCell>
                <EstadoBadge estado={servicio.estado} />
              </TableCell>

              <TableCell>
                {servicio.exitoso ? (
                  <Badge className="bg-green-100 text-green-800 border-0">
                    {t("results.successful")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    {t("results.unsuccessful")}
                  </Badge>
                )}
              </TableCell>

              <TableCell className="flex justify-end gap-4">
                <Button
                  id="btn-edit-servicio"
                  variant="ghost"
                  title={t("actions.edit")}
                  aria-label={t("actions.edit")}
                  size="sm"
                  onClick={() => handleOpenModalEdit(servicio)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>

                <Button
                  id="btn-estados-servicios"
                  variant="ghost"
                  title={t("actions.details")}
                  aria-label={t("actions.details")}
                  size="sm"
                  onClick={() => handleOpenModal(servicio)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={openModalEdit}
        onOpenChange={setOpenModalEdit}
        title={t("modal.title")}
        description={t("modal.description")}
        size="xl"
      >
        <FormServicioReproductivo
          hembras={hembras}
          machos={machos}
          setOpenModal={setOpenModalEdit}
          servicio={selectedServicio}
          onSuccess={() => setOpenModalEdit(true)}
          moneda={moneda}
        />
      </Modal>
    </div>
  );
};

export default VistaTabla;
