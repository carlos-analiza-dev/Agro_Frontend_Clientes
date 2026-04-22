"use client";
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
import { formatDate } from "@/helpers/funciones/formatDate";
import {
  AlertCircle,
  Calendar,
  Edit,
  Eye,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import getEstadoBadgePlanilla from "./getEstadoBadgePlanilla";
import { Planilla } from "@/api/planillas-trabajadores/interfaces/response-planillas.interface";
import { GenerarPlanilla } from "@/api/planillas-trabajadores/accions/generar-planilla";
import { ConfirmarPlanilla } from "@/api/planillas-trabajadores/accions/confirmar-planilla";
import { AnularPlanilla } from "@/api/planillas-trabajadores/accions/anular-planilla";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ModalViewDetails from "./ModalViewDetails";
import Modal from "@/components/generics/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EstadoPlanilla,
  TipoPeriodoPago,
} from "@/interfaces/enums/planillas.enums";
import ModalRegistrarPagos from "./ModalRegistrarPagos";
import {
  getAvailableActions,
  getPeriodoText,
} from "@/helpers/funciones/planilla_funciones";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { MobilePlanillaCard } from "./MobilePlanillaCard";

interface Props {
  planillas: Planilla[];
  handleEditPlanilla: (planilla: Planilla) => void;
  moneda: string;
}

const TablePlanillas = ({ planillas, handleEditPlanilla, moneda }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [openPagosModal, setOpenPagosModal] = useState(false);
  const [planillaId, setPlanillaId] = useState("");
  const [planillaSeleccionada, setPlanillaSeleccionada] =
    useState<Planilla | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "confirmar" | "anular";
    planillaId: string;
    planillaNombre: string;
  }>({
    open: false,
    type: "confirmar",
    planillaId: "",
    planillaNombre: "",
  });

  const [anularMotivo, setAnularMotivo] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const generatePlanilla = async (id: string) => {
    setLoadingAction(`generar_${id}`);
    try {
      await GenerarPlanilla(id);
      toast.success("Planilla Generada Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al generar la planilla";

        toast.error(errorMessage, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      } else {
        toast.error("Ocurrió un error al generar la planilla");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const confirmarPlanilla = async (id: string) => {
    setLoadingAction(`confirmar_${id}`);
    try {
      await ConfirmarPlanilla(id);
      toast.success("Planilla Confirmada Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
      setConfirmModal({ ...confirmModal, open: false });
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al confirmar la planilla";

        toast.error(errorMessage, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      } else {
        toast.error("Ocurrió un error al confirmar la planilla");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const openPagosModalHandler = (planilla: Planilla) => {
    setPlanillaSeleccionada(planilla);
    setOpenPagosModal(true);
  };

  const anularPlanilla = async (id: string, motivo: string) => {
    if (!motivo || motivo.trim() === "") {
      toast.error("Debe proporcionar un motivo para anular la planilla");
      return;
    }

    setLoadingAction(`anular_${id}`);
    try {
      await AnularPlanilla(id, motivo);
      toast.success("Planilla Anulada Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
      setConfirmModal({ ...confirmModal, open: false });
      setAnularMotivo("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al anular la planilla";

        toast.error(errorMessage, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      } else {
        toast.error("Ocurrió un error al anular la planilla");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleViewDetailsPlanilla = (id: string) => {
    setOpenViewDetails(true);
    setPlanillaId(id);
  };

  const openConfirmModal = (
    type: "confirmar" | "anular",
    planillaId: string,
    planillaNombre: string,
  ) => {
    setConfirmModal({
      open: true,
      type,
      planillaId,
      planillaNombre,
    });
    if (type === "anular") {
      setAnularMotivo("");
    }
  };

  const getModalText = () => {
    switch (confirmModal.type) {
      case "confirmar":
        return {
          title: "Confirmar Planilla",
          description: `¿Estás seguro de que deseas confirmar la planilla "${confirmModal.planillaNombre}"? Una vez confirmada, podrás proceder al pago.`,
          confirmText: "Confirmar",
          confirmVariant: "default",
        };
      case "anular":
        return {
          title: "Anular Planilla",
          description: `¿Estás seguro de que deseas anular la planilla "${confirmModal.planillaNombre}"? Esta acción no se puede deshacer.`,
          confirmText: "Anular",
          confirmVariant: "destructive",
        };
    }
  };

  const modalText = getModalText();

  return (
    <div>
      {isMobile ? (
        <div className="space-y-2">
          {planillas.map((planilla) => (
            <MobilePlanillaCard
              key={planilla.id}
              planilla={planilla}
              loadingAction={loadingAction}
              handleViewDetailsPlanilla={handleViewDetailsPlanilla}
              handleEditPlanilla={handleEditPlanilla}
              moneda={moneda}
              generatePlanilla={generatePlanilla}
              openConfirmModal={openConfirmModal}
              openPagosModalHandler={openPagosModalHandler}
            />
          ))}
          {planillas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay planillas registradas
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Fecha Pago</TableHead>
                <TableHead>Total Neto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
                <TableHead className="text-right">Más</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {planillas.map((planilla: Planilla) => {
                const estado = planilla.estado as EstadoPlanilla;
                const actions = getAvailableActions(estado);
                const isLoading =
                  loadingAction === `generar_${planilla.id}` ||
                  loadingAction === `confirmar_${planilla.id}` ||
                  loadingAction === `anular_${planilla.id}`;

                return (
                  <TableRow key={planilla.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{planilla.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {planilla.descripcion || "Sin descripción"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {formatDate(planilla.fechaInicio)} -{" "}
                          {formatDate(planilla.fechaFin)}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {getPeriodoText(
                            planilla.tipoPeriodo as TipoPeriodoPago,
                          )}{" "}
                          ({planilla.diasPeriodo} días)
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(planilla.fechaPago)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(planilla.totalNeto, moneda)}
                      </p>
                    </TableCell>

                    <TableCell>
                      {getEstadoBadgePlanilla(planilla.estado)}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {estado === EstadoPlanilla.BORRADOR && (
                          <Button
                            onClick={() => generatePlanilla(planilla.id)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            className="gap-1"
                          >
                            {isLoading &&
                            loadingAction === `generar_${planilla.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                            Generar
                          </Button>
                        )}

                        {actions.primary &&
                          actions.primary.action === "confirmar" && (
                            <Button
                              onClick={() =>
                                openConfirmModal(
                                  "confirmar",
                                  planilla.id,
                                  planilla.nombre,
                                )
                              }
                              variant="default"
                              size="sm"
                              disabled={isLoading}
                              className="gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              {isLoading &&
                              loadingAction === `confirmar_${planilla.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <actions.primary.icon className="h-4 w-4" />
                              )}
                              {actions.primary.label}
                            </Button>
                          )}

                        {actions.primary &&
                          actions.primary.action === "pagar" && (
                            <Button
                              onClick={() => openPagosModalHandler(planilla)}
                              variant="default"
                              size="sm"
                              disabled={isLoading}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <CreditCard className="h-4 w-4" />
                              {actions.primary.label}
                            </Button>
                          )}

                        {actions.secondary.map((secAction) => (
                          <Button
                            key={secAction.action}
                            onClick={() =>
                              openConfirmModal(
                                secAction.action as "anular",
                                planilla.id,
                                planilla.nombre,
                              )
                            }
                            variant={
                              secAction.color === "destructive"
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            disabled={isLoading}
                            className="gap-1"
                          >
                            {isLoading &&
                            loadingAction ===
                              `${secAction.action}_${planilla.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <secAction.icon className="h-4 w-4" />
                            )}
                            {secAction.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewDetailsPlanilla(planilla.id)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          {actions.menu.includes("editar") && (
                            <DropdownMenuItem
                              onClick={() => handleEditPlanilla(planilla)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal
        open={confirmModal.open && confirmModal.type === "confirmar"}
        onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
        title={modalText.title}
        description={modalText.description}
        size="md"
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setConfirmModal({ ...confirmModal, open: false })}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => confirmarPlanilla(confirmModal.planillaId)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {modalText.confirmText}
          </Button>
        </div>
      </Modal>

      <Modal
        open={confirmModal.open && confirmModal.type === "anular"}
        onOpenChange={(open) => {
          if (!open) {
            setAnularMotivo("");
          }
          setConfirmModal({ ...confirmModal, open });
        }}
        title={modalText.title}
        description={modalText.description}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="motivo" className="text-sm font-medium">
              Motivo de anulación *
            </Label>
            <Input
              id="motivo"
              placeholder="Ej: Error en cálculo de horas extras"
              value={anularMotivo}
              onChange={(e) => setAnularMotivo(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmModal({ ...confirmModal, open: false })}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                anularPlanilla(confirmModal.planillaId, anularMotivo)
              }
              variant="destructive"
              disabled={!anularMotivo.trim()}
            >
              {modalText.confirmText}
            </Button>
          </div>
        </div>
      </Modal>

      {planillaSeleccionada && (
        <ModalRegistrarPagos
          open={openPagosModal}
          setOpen={setOpenPagosModal}
          planillaId={planillaSeleccionada.id}
          planillaNombre={planillaSeleccionada.nombre}
          moneda={moneda}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["planillas"] });
            queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
          }}
        />
      )}

      <ModalViewDetails
        openViewDetails={openViewDetails}
        setOpenViewDetails={setOpenViewDetails}
        planillaId={planillaId}
        moneda={moneda}
      />
    </div>
  );
};

export default TablePlanillas;
