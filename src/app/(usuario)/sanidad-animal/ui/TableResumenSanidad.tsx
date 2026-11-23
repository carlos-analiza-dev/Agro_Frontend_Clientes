"use client";

import { eliminarSanidad } from "@/api/sanidad-animal/accions/eliminar-sanidad-animal";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helpers/funciones/formatDate";
import {
  getBadgeColor,
  getServiceIcon,
} from "@/helpers/funciones/sanidad-animal/sanidad-funciones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronDown, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface Props {
  paginatedData: Sanidad[];
  moneda: string;
  handleEditSanidad: (sanidad: Sanidad) => void;
  onDeleteSuccess?: () => void;
  acciones: boolean;
  isMobile: boolean;
}

const TableResumenSanidad = ({
  moneda,
  paginatedData,
  handleEditSanidad,
  onDeleteSuccess,
  acciones,
  isMobile,
}: Props) => {
  const t = useTranslations("tableResumenSanidad");

  const rounter = useRouter();
  const queryClient = useQueryClient();

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSanidad, setSelectedSanidad] = useState<Sanidad | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => eliminarSanidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanidad-animal"] });
      queryClient.invalidateQueries({ queryKey: ["costos-mensuales-sanidad"] });
      queryClient.invalidateQueries({ queryKey: ["sanidad-eliminados"] });

      toast.success(t("messages.deleteSuccess"));

      setOpenDelete(false);
      setSelectedSanidad(null);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("errors.deleteEvent");

        toast.error(errorMessage);
      } else {
        toast.error(t("errors.unexpected"));
      }
    },
  });

  const handleDeleteEvento = () => {
    if (selectedSanidad) {
      mutation.mutate(selectedSanidad.id);
    }
  };

  const openDeleteModal = (sanidad: Sanidad) => {
    setSelectedSanidad(sanidad);
    setOpenDelete(true);
  };

  const closeDeleteModal = () => {
    setOpenDelete(false);
    setSelectedSanidad(null);
  };

  const handleEditSanidadMobil = (id: string) => {
    rounter.push(`/sanidad-animal/${id}`);
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              {t("empty")}
            </div>
          ) : (
            paginatedData.map((item) => {
              const Icon = getServiceIcon(item.tipo_servicio);

              return (
                <div
                  key={item.id}
                  className="rounded-xl border bg-background p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <Badge className={getBadgeColor(item.tipo_servicio)}>
                        {item.tipo_servicio}
                      </Badge>
                    </div>

                    {acciones && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={mutation.isPending}
                            aria-label={t("actions.openMenu")}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditSanidadMobil(item.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("actions.edit")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openDeleteModal(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("actions.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        {t("labels.animalLocation")}
                      </p>

                      <p className="font-medium">
                        {item.animal?.nombre_animal ||
                          item.animal?.galpon ||
                          item.animal?.lote ||
                          t("values.notAvailable")}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.animal?.identificador
                          ? `${t("labels.id")}: ${item.animal.identificador}`
                          : item.animal?.galpon
                            ? `${t("labels.poultryHouse")}: ${item.animal.galpon}`
                            : item.animal?.lote
                              ? `${t("labels.batch")}: ${item.animal.lote}`
                              : t("values.noIdentification")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-muted-foreground">
                          {t("labels.date")}
                        </p>
                        <p>{formatDate(item.fecha_evento)}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          {t("labels.nextDate")}
                        </p>
                        <p>
                          {item.proxima_fecha_evento
                            ? formatDate(item.proxima_fecha_evento)
                            : t("values.notDefined")}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          {t("labels.responsible")}
                        </p>
                        <p>{item.responsable || t("values.notAvailable")}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          {t("labels.cost")}
                        </p>

                        {item.costo_real ? (
                          <p className="font-semibold">
                            {moneda}
                            {parseFloat(item.costo_real).toFixed(2)}
                          </p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.service")}</TableHead>
                <TableHead>{t("columns.animalLocation")}</TableHead>
                <TableHead>{t("columns.date")}</TableHead>
                <TableHead>{t("columns.nextDate")}</TableHead>
                <TableHead>{t("columns.responsible")}</TableHead>
                <TableHead>{t("columns.actualCost")}</TableHead>

                {acciones && (
                  <TableHead className="text-right">
                    {t("columns.actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => {
                  const Icon = getServiceIcon(item.tipo_servicio);

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <Badge className={getBadgeColor(item.tipo_servicio)}>
                            {item.tipo_servicio}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {item.animal?.nombre_animal ||
                              item.animal?.galpon ||
                              item.animal?.lote ||
                              t("values.notAvailable")}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {item.animal?.identificador
                              ? `${t("labels.id")}: ${item.animal.identificador}`
                              : item.animal?.galpon
                                ? `${t("labels.poultryHouse")}: ${item.animal.galpon}`
                                : item.animal?.lote
                                  ? `${t("labels.batch")}: ${item.animal.lote}`
                                  : t("values.noIdentification")}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{formatDate(item.fecha_evento)}</TableCell>

                      <TableCell>
                        {item.proxima_fecha_evento
                          ? formatDate(item.proxima_fecha_evento)
                          : t("values.notDefined")}
                      </TableCell>

                      <TableCell>
                        {item.responsable || t("values.notAvailable")}
                      </TableCell>

                      <TableCell>
                        {item.costo_real ? (
                          <span className="font-medium">
                            {moneda}
                            {parseFloat(item.costo_real).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {acciones && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={mutation.isPending}
                                aria-label={t("actions.openMenu")}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditSanidad(item)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("actions.edit")}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openDeleteModal(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("actions.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal
        open={openDelete}
        onOpenChange={(open) => {
          if (!mutation.isPending) {
            setOpenDelete(open);
            if (!open) setSelectedSanidad(null);
          }
        }}
        title={t("delete.title")}
        description={t("delete.description", {
          service: selectedSanidad?.tipo_servicio || "",
        })}
        size="md"
        height="auto"
        showCloseButton={false}
      >
        <div className="p-4">
          {selectedSanidad && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />

                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {t("delete.event", {
                      service: selectedSanidad.tipo_servicio,
                    })}
                  </p>

                  <p className="text-sm text-yellow-700">
                    {t("delete.animalLocation")}:{" "}
                    {selectedSanidad.animal?.identificador ||
                      selectedSanidad.animal?.galpon ||
                      selectedSanidad.animal?.lote ||
                      t("values.notAvailable")}
                  </p>

                  <p className="text-sm text-yellow-700">
                    {t("labels.date")}:{" "}
                    {formatDate(selectedSanidad.fecha_evento)}
                  </p>

                  {selectedSanidad.costo_real && (
                    <p className="text-sm text-yellow-700">
                      {t("labels.cost")}: {moneda}
                      {parseFloat(selectedSanidad.costo_real).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={mutation.isPending}
            >
              {t("buttons.cancel")}
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteEvento}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("buttons.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("actions.delete")}
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableResumenSanidad;
