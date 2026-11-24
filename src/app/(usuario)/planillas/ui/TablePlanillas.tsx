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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("tablePlanillas");
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

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;

      if (Array.isArray(messages)) {
        return messages[0] ?? fallback;
      }

      if (typeof messages === "string") {
        return messages;
      }
    }

    return fallback;
  };

  const generatePlanilla = async (id: string) => {
    setLoadingAction(`generar_${id}`);

    try {
      await GenerarPlanilla(id);
      toast.success(t("messages.generateSuccess"));

      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });
    } catch (error) {
      toast.error(getErrorMessage(error, t("errors.generate")), {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const confirmarPlanilla = async (id: string) => {
    setLoadingAction(`confirmar_${id}`);

    try {
      await ConfirmarPlanilla(id);
      toast.success(t("messages.confirmSuccess"));

      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });

      setConfirmModal({ ...confirmModal, open: false });
    } catch (error) {
      toast.error(getErrorMessage(error, t("errors.confirm")), {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
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
      toast.error(t("validation.cancellationReason"));
      return;
    }

    setLoadingAction(`anular_${id}`);

    try {
      await AnularPlanilla(id, motivo);
      toast.success(t("messages.cancelSuccess"));

      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      queryClient.invalidateQueries({ queryKey: ["planilla-details"] });

      setConfirmModal({ ...confirmModal, open: false });
      setAnularMotivo("");
    } catch (error) {
      toast.error(getErrorMessage(error, t("errors.cancel")), {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
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
          title: t("modals.confirm.title"),
          description: t("modals.confirm.description", {
            name: confirmModal.planillaNombre,
          }),
          confirmText: t("buttons.confirm"),
        };

      case "anular":
        return {
          title: t("modals.cancel.title"),
          description: t("modals.cancel.description", {
            name: confirmModal.planillaNombre,
          }),
          confirmText: t("buttons.cancelPayroll"),
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
              {t("empty")}
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.name")}</TableHead>
                <TableHead>{t("columns.period")}</TableHead>
                <TableHead>{t("columns.paymentDate")}</TableHead>
                <TableHead>{t("columns.netTotal")}</TableHead>
                <TableHead>{t("columns.status")}</TableHead>
                <TableHead className="text-center">
                  {t("columns.actions")}
                </TableHead>
                <TableHead className="text-right">
                  {t("columns.more")}
                </TableHead>
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
                          {planilla.descripcion || t("values.noDescription")}
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
                          ({planilla.diasPeriodo} {t("values.days")})
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
                      <div
                        id="id-acciones-planilla"
                        className="flex justify-center gap-2"
                      >
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
                            {t("buttons.generate")}
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
                              {t("buttons.confirm")}
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
                              {t("buttons.pay")}
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
                            {t(`buttons.${secAction.action}`)}
                          </Button>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger id="id-detalle-planilla" asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLoading}
                            aria-label={t("actions.openMenu")}
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
                            {t("actions.viewDetails")}
                          </DropdownMenuItem>

                          {actions.menu.includes("editar") && (
                            <DropdownMenuItem
                              onClick={() => handleEditPlanilla(planilla)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("actions.edit")}
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
            {t("buttons.cancel")}
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
              {t("fields.cancellationReason")}
            </Label>

            <Input
              id="motivo"
              placeholder={t("placeholders.cancellationReason")}
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
              {t("buttons.cancel")}
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
            queryClient.invalidateQueries({
              queryKey: ["planilla-details"],
            });
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
