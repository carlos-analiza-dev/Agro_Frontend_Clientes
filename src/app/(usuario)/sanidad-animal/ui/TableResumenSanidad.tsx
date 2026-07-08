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
import { useState } from "react";
import { toast } from "react-toastify";

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
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSanidad, setSelectedSanidad] = useState<Sanidad | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => eliminarSanidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanidad-animal"] });
      queryClient.invalidateQueries({ queryKey: ["costos-mensuales-sanidad"] });
      queryClient.invalidateQueries({ queryKey: ["sanidad-eliminados"] });
      toast.success("Evento eliminado con éxito");
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
            : "Hubo un error al eliminar el evento";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
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

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              No hay registros para mostrar
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
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditSanidad(item)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openDeleteModal(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Animal / Galpón / Lote
                      </p>
                      <p className="font-medium">
                        {item.animal?.nombre_animal ||
                          item.animal?.galpon ||
                          item.animal?.lote ||
                          "N/A"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.animal?.identificador
                          ? `ID: ${item.animal.identificador}`
                          : item.animal?.galpon
                            ? `Galpón: ${item.animal.galpon}`
                            : item.animal?.lote
                              ? `Lote: ${item.animal.lote}`
                              : "Sin identificación"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-muted-foreground">Fecha</p>
                        <p>{formatDate(item.fecha_evento)}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Próxima</p>
                        <p>{formatDate(item.proxima_fecha_evento)}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Responsable</p>
                        <p>{item.responsable || "N/A"}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Costo</p>

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
                <TableHead>Servicio</TableHead>
                <TableHead>Animal/Galpón/Lote</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Próxima fecha</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Costo real</TableHead>
                {acciones && (
                  <TableHead className="text-right">Acciones</TableHead>
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
                    No hay registros para mostrar
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
                              "N/A"}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {item.animal?.identificador
                              ? `ID: ${item.animal.identificador}`
                              : item.animal?.galpon
                                ? `Galpón: ${item.animal.galpon}`
                                : item.animal?.lote
                                  ? `Lote: ${item.animal.lote}`
                                  : "Sin identificación"}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{formatDate(item.fecha_evento)}</TableCell>

                      <TableCell>
                        {formatDate(item.proxima_fecha_evento)}
                      </TableCell>

                      <TableCell>{item.responsable || "N/A"}</TableCell>

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
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditSanidad(item)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openDeleteModal(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
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
        title="Eliminar evento sanitario"
        description={`¿Estás seguro que deseas eliminar el evento de ${selectedSanidad?.tipo_servicio}?`}
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
                    Evento: {selectedSanidad.tipo_servicio}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Animal/Galpon/Lote:{" "}
                    {selectedSanidad.animal?.identificador ||
                      selectedSanidad.animal?.galpon ||
                      selectedSanidad.animal?.lote ||
                      "N/A"}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Fecha: {formatDate(selectedSanidad.fecha_evento)}
                  </p>
                  {selectedSanidad.costo_real && (
                    <p className="text-sm text-yellow-700">
                      Costo: {moneda}
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
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteEvento}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
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
