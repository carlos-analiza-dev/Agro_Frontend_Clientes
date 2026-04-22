"use client";
import Modal from "@/components/generics/Modal";
import useGetDetailsPlanilla from "@/hooks/planillas/useGetDetailsPlanilla";
import { Dispatch, SetStateAction, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/helpers/funciones/getInitials";
import getEstadoBadgePlanilla from "./getEstadoBadgePlanilla";
import {
  exportPlanillaDetalleOnly,
  exportPlanillaToExcel,
} from "@/helpers/funciones/exportDetallesPlanillaToExcel";
import { toast } from "react-toastify";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
  openViewDetails: boolean;
  setOpenViewDetails: Dispatch<SetStateAction<boolean>>;
  planillaId: string;
  moneda: string;
}

const ModalViewDetails = ({
  openViewDetails,
  setOpenViewDetails,
  planillaId,
  moneda,
}: Props) => {
  const { data: detalles, isLoading } = useGetDetailsPlanilla(planillaId);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null);

  const handleExportToExcel = () => {
    if (!detalles?.planilla) return;

    try {
      exportPlanillaToExcel(
        detalles.planilla,
        `Planilla_${detalles.planilla.nombre}`,
      );
      toast.success("Excel exportado exitosamente");
    } catch (error) {
      toast.error("Error al exportar el Excel");
    }
  };

  const handleExportDetalleOnly = () => {
    if (!detalles?.planilla) return;

    try {
      exportPlanillaDetalleOnly(
        detalles.planilla,
        `Detalle_${detalles.planilla.nombre}`,
      );
      toast.success("Detalle exportado exitosamente");
    } catch (error) {
      toast.error("Error al exportar el detalle");
    }
  };

  const toggleWorkerExpand = (workerId: string) => {
    if (expandedWorker === workerId) {
      setExpandedWorker(null);
    } else {
      setExpandedWorker(workerId);
    }
  };

  if (isLoading) {
    return (
      <Modal
        open={openViewDetails}
        onOpenChange={setOpenViewDetails}
        title="Detalles de Planilla"
        description="Cargando información de la planilla..."
        size="4xl"
        height="auto"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Modal>
    );
  }

  if (!detalles?.planilla) {
    return (
      <Modal
        open={openViewDetails}
        onOpenChange={setOpenViewDetails}
        title="Detalles de Planilla"
        description="No se pudo cargar la información"
        size="3xl"
        height="auto"
      >
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500">
            Error al cargar los detalles de la planilla
          </p>
        </div>
      </Modal>
    );
  }

  const { planilla, resumen } = detalles;

  const WorkerCard = ({ detalle }: { detalle: any }) => {
    const isExpanded = expandedWorker === detalle.id;

    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(detalle.trabajador.nombre)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-base">
                  {detalle.trabajador.nombre}
                </p>
                <p className="text-xs text-muted-foreground">
                  {detalle.trabajador.identificacion}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-purple-600 text-lg">
                {formatCurrency(detalle.totalAPagar, moneda)}
              </p>
              {detalle.pagado ? (
                <Badge variant="outline" className="gap-1 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Pagado
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Pendiente
                </Badge>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Días</p>
              <p className="font-semibold text-base">
                {detalle.diasTrabajados}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Salario Base</p>
              <p className="font-semibold text-sm">
                {formatCurrency(detalle.salarioBase, moneda)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Horas Extras</p>
              <p className="font-semibold text-sm text-green-600">
                {formatCurrency(detalle.totalHorasExtras, moneda)}
              </p>
            </div>
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={() => toggleWorkerExpand(detalle.id)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Ver menos detalles
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Ver más detalles
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Bonificaciones:
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {formatCurrency(detalle.bonificaciones, moneda)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Deducciones:
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {formatCurrency(detalle.deducciones, moneda)}
                  </span>
                </div>
              </div>

              <Separator />

              {(detalle.horasExtraDiurnas > 0 ||
                detalle.horasExtraNocturnas > 0 ||
                detalle.horasExtraFestivas > 0) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Desglose de Horas Extras:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {detalle.horasExtraDiurnas > 0 && (
                      <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                        <p className="text-xs text-muted-foreground">Diurnas</p>
                        <p className="font-medium">
                          {detalle.horasExtraDiurnas}h
                        </p>
                        <p className="text-xs text-green-600">
                          {formatCurrency(detalle.valorHoraExtraDiurna, moneda)}
                          /h
                        </p>
                      </div>
                    )}
                    {detalle.horasExtraNocturnas > 0 && (
                      <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                        <p className="text-xs text-muted-foreground">
                          Nocturnas
                        </p>
                        <p className="font-medium">
                          {detalle.horasExtraNocturnas}h
                        </p>
                        <p className="text-xs text-orange-600">
                          {formatCurrency(
                            detalle.valorHoraExtraNocturna,
                            moneda,
                          )}
                          /h
                        </p>
                      </div>
                    )}
                    {detalle.horasExtraFestivas > 0 && (
                      <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                        <p className="text-xs text-muted-foreground">
                          Festivas
                        </p>
                        <p className="font-medium">
                          {detalle.horasExtraFestivas}h
                        </p>
                        <p className="text-xs text-red-600">
                          {formatCurrency(
                            detalle.valorHoraExtraFestiva,
                            moneda,
                          )}
                          /h
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detalle.observaciones && (
                <div className="p-2 bg-muted/30 rounded">
                  <p className="text-xs text-muted-foreground">
                    Observaciones:
                  </p>
                  <p className="text-sm">{detalle.observaciones}</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  };

  return (
    <Modal
      open={openViewDetails}
      onOpenChange={setOpenViewDetails}
      title="Detalles de Planilla"
      description={`Período: ${planilla.fechaInicio} al ${planilla.fechaFin}`}
      size={isMobile ? "full" : "3xl"}
      height="auto"
    >
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold">{planilla.nombre}</h3>
            {planilla.descripcion && (
              <p className="text-xs md:text-sm text-muted-foreground">
                {planilla.descripcion}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size={isMobile ? "default" : "sm"}
              onClick={handleExportDetalleOnly}
              className="gap-1"
            >
              <FileText className="h-4 w-4" />
              {!isMobile && "Exportar Detalle"}
            </Button>
            <Button
              variant="default"
              size={isMobile ? "default" : "sm"}
              onClick={handleExportToExcel}
              className="gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {!isMobile && "Exportar Excel"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Total Trabajadores
                  </p>
                  <p className="text-xl md:text-2xl font-bold">
                    {resumen.totalTrabajadores}
                  </p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Total Neto
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    {formatCurrency(planilla.totalNeto, moneda)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Pagos
                  </p>
                  <p className="text-xl md:text-2xl font-bold">
                    {resumen.totalPagados}/{resumen.totalTrabajadores}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pendientes: {resumen.totalPendientes}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="text-[10px] md:text-xs">
                    {formatCurrency(resumen.montoTotalPagado, moneda)} pagado
                  </Badge>
                  <Badge
                    variant="destructive"
                    className="text-[10px] md:text-xs"
                  >
                    {formatCurrency(resumen.montoTotalPendiente, moneda)}{" "}
                    pendiente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Estado
                  </p>
                  <div className="mt-1">
                    {getEstadoBadgePlanilla(planilla.estado)}
                  </div>
                </div>
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-2">
                Pago: {planilla.fechaPago}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Resumen Financiero
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Salarios Base
                </p>
                <p className="text-sm md:text-lg font-semibold">
                  {formatCurrency(planilla.totalSalarios, moneda)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Horas Extras
                </p>
                <p className="text-sm md:text-lg font-semibold text-green-600">
                  {formatCurrency(planilla.totalHorasExtras, moneda)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  Bonificaciones
                </p>
                <p className="text-sm md:text-lg font-semibold text-blue-600">
                  {formatCurrency(planilla.totalBonificaciones, moneda)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  Deducciones
                </p>
                <p className="text-sm md:text-lg font-semibold text-red-600">
                  {formatCurrency(planilla.totalDeducciones, moneda)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-4">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Total Neto
                </p>
                <p className="text-base md:text-xl font-bold text-purple-600">
                  {formatCurrency(planilla.totalNeto, moneda)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Detalle por Trabajador
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            {isMobile ? (
              <div className="space-y-3">
                {planilla.detalles?.map((detalle: any) => (
                  <WorkerCard key={detalle.id} detalle={detalle} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Trabajador</TableHead>
                      <TableHead>Días</TableHead>
                      <TableHead>Salario Base</TableHead>
                      <TableHead>Horas Extras</TableHead>
                      <TableHead>Bonif.</TableHead>
                      <TableHead>Deducc.</TableHead>
                      <TableHead>Total a Pagar</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planilla.detalles?.map((detalle: any) => (
                      <TableRow key={detalle.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(detalle.trabajador.nombre)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {detalle.trabajador.nombre}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {detalle.trabajador.identificacion}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-medium">
                              {detalle.diasTrabajados}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              días
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(detalle.salarioBase, moneda)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="text-green-600 font-medium">
                              {formatCurrency(detalle.totalHorasExtras, moneda)}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              {detalle.horasExtraDiurnas > 0 &&
                                `${detalle.horasExtraDiurnas}h D `}
                              {detalle.horasExtraNocturnas > 0 &&
                                `${detalle.horasExtraNocturnas}h N `}
                              {detalle.horasExtraFestivas > 0 &&
                                `${detalle.horasExtraFestivas}h F`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600">
                            {formatCurrency(detalle.bonificaciones, moneda)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-red-600">
                            {formatCurrency(detalle.deducciones, moneda)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-purple-600">
                            {formatCurrency(detalle.totalAPagar, moneda)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {detalle.pagado ? (
                            <Badge variant="outline" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Pagado
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {!isMobile &&
          planilla.detalles?.some(
            (d: any) =>
              d.horasExtraDiurnas > 0 ||
              d.horasExtraNocturnas > 0 ||
              d.horasExtraFestivas > 0,
          ) && (
            <Card>
              <CardHeader className="p-3 md:p-6">
                <CardTitle className="text-base md:text-lg">
                  Detalle de Horas Extras
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="space-y-4">
                  {planilla.detalles?.map(
                    (detalle: any) =>
                      (detalle.horasExtraDiurnas > 0 ||
                        detalle.horasExtraNocturnas > 0 ||
                        detalle.horasExtraFestivas > 0) && (
                        <div
                          key={detalle.id}
                          className="border-b last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">
                                {detalle.trabajador.nombre}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Salario diario:{" "}
                                {formatCurrency(detalle.salarioDiario, moneda)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              Total extras:{" "}
                              {formatCurrency(detalle.totalHorasExtras, moneda)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {detalle.horasExtraDiurnas > 0 && (
                              <div className="text-center p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  Horas Diurnas
                                </p>
                                <p className="font-medium">
                                  {detalle.horasExtraDiurnas} horas
                                </p>
                                <p className="text-xs text-green-600">
                                  {formatCurrency(
                                    detalle.valorHoraExtraDiurna,
                                    moneda,
                                  )}
                                  /h
                                </p>
                              </div>
                            )}
                            {detalle.horasExtraNocturnas > 0 && (
                              <div className="text-center p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  Horas Nocturnas
                                </p>
                                <p className="font-medium">
                                  {detalle.horasExtraNocturnas} horas
                                </p>
                                <p className="text-xs text-orange-600">
                                  {formatCurrency(
                                    detalle.valorHoraExtraNocturna,
                                    moneda,
                                  )}
                                  /h
                                </p>
                              </div>
                            )}
                            {detalle.horasExtraFestivas > 0 && (
                              <div className="text-center p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  Horas Festivas
                                </p>
                                <p className="font-medium">
                                  {detalle.horasExtraFestivas} horas
                                </p>
                                <p className="text-xs text-red-600">
                                  {formatCurrency(
                                    detalle.valorHoraExtraFestiva,
                                    moneda,
                                  )}
                                  /h
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {planilla.observaciones && (
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                {planilla.observaciones}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default ModalViewDetails;
