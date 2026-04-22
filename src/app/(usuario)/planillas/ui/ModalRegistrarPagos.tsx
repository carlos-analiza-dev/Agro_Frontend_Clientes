// components/planillas-trabajadores/ModalRegistrarPagos.tsx
"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import Modal from "@/components/generics/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { PagarPlanilla } from "@/api/planillas-trabajadores/accions/pagar-planilla";
import useGetDetailsPlanilla from "@/hooks/planillas/useGetDetailsPlanilla";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CreditCard } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  planillaId: string;
  planillaNombre: string;
  moneda: string;
  onSuccess: () => void;
}

const ModalRegistrarPagos = ({
  open,
  setOpen,
  planillaId,
  planillaNombre,
  moneda,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: detalles, isLoading } = useGetDetailsPlanilla(planillaId);
  const [selectedPayments, setSelectedPayments] = useState<{
    [detalleId: string]: { selected: boolean; metodoPago: string };
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (!detalles?.planilla?.detalles) return;

    const newSelected: typeof selectedPayments = {};
    detalles.planilla.detalles.forEach((detalle: any) => {
      if (!detalle.pagado) {
        newSelected[detalle.id] = {
          selected: checked,
          metodoPago: checked ? "efectivo" : "",
        };
      }
    });
    setSelectedPayments(newSelected);
  };

  const handleSelectOne = (detalleId: string, checked: boolean) => {
    setSelectedPayments((prev) => ({
      ...prev,
      [detalleId]: {
        selected: checked,
        metodoPago: checked ? prev[detalleId]?.metodoPago || "efectivo" : "",
      },
    }));
  };

  const handleMetodoPagoChange = (detalleId: string, metodoPago: string) => {
    setSelectedPayments((prev) => ({
      ...prev,
      [detalleId]: {
        ...prev[detalleId],
        metodoPago,
      },
    }));
  };

  const handleSubmit = async () => {
    const pagos = Object.entries(selectedPayments)
      .filter(([_, value]) => value.selected && value.metodoPago)
      .map(([detalleId, value]) => ({
        detalleId,
        metodoPago: value.metodoPago,
      }));

    if (pagos.length === 0) {
      toast.error("Seleccione al menos un trabajador para pagar");
      return;
    }

    setLoading(true);
    try {
      await PagarPlanilla(planillaId, pagos);
      toast.success("Pagos registrados exitosamente");
      onSuccess();
      setOpen(false);
      setSelectedPayments({});
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al registrar los pagos";
        toast.error(errorMessage);
      } else {
        toast.error("Ocurrió un error al registrar los pagos");
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotalSeleccionado = () => {
    if (!detalles?.planilla?.detalles) return 0;
    let total = 0;
    detalles.planilla.detalles.forEach((detalle: any) => {
      if (selectedPayments[detalle.id]?.selected) {
        total += Number(detalle.totalAPagar);
      }
    });
    return total;
  };

  const trabajadoresPendientes =
    detalles?.planilla?.detalles?.filter((d: any) => !d.pagado).length || 0;

  if (isLoading) {
    return (
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Registrar Pagos"
        size="2xl"
      >
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={`Registrar Pagos - ${planillaNombre}`}
      description={`${trabajadoresPendientes} trabajadores pendientes de pago`}
      size="3xl"
    >
      <div className="space-y-6">
        {/* Resumen */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total a Pagar Seleccionado
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(getTotalSeleccionado(), moneda)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(true)}
            >
              Seleccionar Todos
            </Button>
          </div>
        </div>

        {/* Lista de trabajadores */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {detalles?.planilla?.detalles?.map((detalle: any) => {
            if (detalle.pagado) return null;

            return (
              <div key={detalle.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={detalle.id}
                      checked={selectedPayments[detalle.id]?.selected || false}
                      onCheckedChange={(checked) =>
                        handleSelectOne(detalle.id, checked as boolean)
                      }
                    />
                    <div>
                      <Label
                        htmlFor={detalle.id}
                        className="font-medium cursor-pointer"
                      >
                        {detalle.trabajador.nombre}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {detalle.trabajador.identificacion}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(detalle.totalAPagar, moneda)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {detalle.diasTrabajados} días trabajados
                    </p>
                  </div>
                </div>

                {selectedPayments[detalle.id]?.selected && (
                  <div className="ml-7">
                    <RadioGroup
                      value={selectedPayments[detalle.id]?.metodoPago}
                      onValueChange={(value) =>
                        handleMetodoPagoChange(detalle.id, value)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="efectivo"
                          id={`efectivo-${detalle.id}`}
                        />
                        <Label htmlFor={`efectivo-${detalle.id}`}>
                          Efectivo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="transferencia"
                          id={`transferencia-${detalle.id}`}
                        />
                        <Label htmlFor={`transferencia-${detalle.id}`}>
                          Transferencia
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="cheque"
                          id={`cheque-${detalle.id}`}
                        />
                        <Label htmlFor={`cheque-${detalle.id}`}>Cheque</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            );
          })}

          {trabajadoresPendientes === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">
                Todos los trabajadores ya están pagados
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || getTotalSeleccionado() === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? "Registrando..." : "Registrar Pagos"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRegistrarPagos;
