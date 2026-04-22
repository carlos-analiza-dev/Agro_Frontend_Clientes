import { Card, CardContent } from "@/components/ui/card";
import {
  getAvailableActions,
  getPeriodoText,
} from "@/helpers/funciones/planilla_funciones";
import {
  EstadoPlanilla,
  TipoPeriodoPago,
} from "@/interfaces/enums/planillas.enums";
import getEstadoBadgePlanilla from "./getEstadoBadgePlanilla";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { Planilla } from "@/api/planillas-trabajadores/interfaces/response-planillas.interface";

interface Props {
  planilla: Planilla;
  loadingAction: string | null;
  handleViewDetailsPlanilla: (id: string) => void;
  handleEditPlanilla: (planilla: Planilla) => void;
  moneda: string;
  generatePlanilla: (id: string) => Promise<void>;
  openConfirmModal: (
    type: "confirmar" | "anular",
    planillaId: string,
    planillaNombre: string,
  ) => void;
  openPagosModalHandler: (planilla: Planilla) => void;
}

export const MobilePlanillaCard = ({
  planilla,
  loadingAction,
  handleViewDetailsPlanilla,
  handleEditPlanilla,
  moneda,
  generatePlanilla,
  openConfirmModal,
  openPagosModalHandler,
}: Props) => {
  const estado = planilla.estado as EstadoPlanilla;
  const actions = getAvailableActions(estado);
  const isLoading =
    loadingAction === `generar_${planilla.id}` ||
    loadingAction === `confirmar_${planilla.id}` ||
    loadingAction === `anular_${planilla.id}`;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{planilla.nombre}</h3>
              {getEstadoBadgePlanilla(planilla.estado)}
            </div>
            {planilla.descripcion && (
              <p className="text-sm text-muted-foreground mt-1">
                {planilla.descripcion}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewDetailsPlanilla(planilla.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              {actions.menu.includes("editar") && (
                <DropdownMenuItem onClick={() => handleEditPlanilla(planilla)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Período:</span>
            <span className="text-sm text-right">
              {formatDate(planilla.fechaInicio)} -{" "}
              {formatDate(planilla.fechaFin)}
              <br />
              <span className="text-xs text-muted-foreground capitalize">
                {getPeriodoText(planilla.tipoPeriodo as TipoPeriodoPago)} (
                {planilla.diasPeriodo} días)
              </span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Fecha Pago:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{formatDate(planilla.fechaPago)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Neto:</span>
            <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
              {formatCurrency(planilla.totalNeto, moneda)}
            </span>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex flex-wrap gap-2">
          {estado === EstadoPlanilla.BORRADOR && (
            <Button
              onClick={() => generatePlanilla(planilla.id)}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex-1 gap-1"
            >
              {isLoading && loadingAction === `generar_${planilla.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Generar
            </Button>
          )}

          {actions.primary && actions.primary.action === "confirmar" && (
            <Button
              onClick={() =>
                openConfirmModal("confirmar", planilla.id, planilla.nombre)
              }
              variant="default"
              size="sm"
              disabled={isLoading}
              className="flex-1 gap-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && loadingAction === `confirmar_${planilla.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <actions.primary.icon className="h-4 w-4" />
              )}
              {actions.primary.label}
            </Button>
          )}

          {actions.primary && actions.primary.action === "pagar" && (
            <Button
              onClick={() => openPagosModalHandler(planilla)}
              variant="default"
              size="sm"
              disabled={isLoading}
              className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
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
                secAction.color === "destructive" ? "destructive" : "outline"
              }
              size="sm"
              disabled={isLoading}
              className="flex-1 gap-1"
            >
              {isLoading &&
              loadingAction === `${secAction.action}_${planilla.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <secAction.icon className="h-4 w-4" />
              )}
              {secAction.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
