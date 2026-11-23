import { EditarPedido } from "@/api/pedidos/accions/editar-pedido";
import {
  CrearPedidoInterface,
  EstadoPedido,
  TipoEntrega,
} from "@/api/pedidos/interface/crear-pedido.interface";
import {
  Detalle,
  Pedido,
} from "@/api/pedidos/interface/response-pedidos.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { Cliente } from "@/interfaces/auth/cliente";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Package,
  Receipt,
  Info,
  AlertTriangleIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { useTranslations } from "next-intl";

interface Props {
  pedido: Pedido;
  cliente: Cliente | undefined;
}

const PedidoCard = ({ pedido, cliente }: Props) => {
  const t = useTranslations("pedidoCard");
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarImpuestos, setMostrarImpuestos] = useState(false);
  const queryClient = useQueryClient();
  const simbolo = cliente?.pais.simbolo_moneda || "$";

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { label: t("status.pending"), variant: "secondary" as const },
      procesado: { label: t("status.processed"), variant: "default" as const },
      facturado: { label: t("status.invoiced"), variant: "default" as const },
      cancelado: {
        label: t("status.cancelled"),
        variant: "destructive" as const,
      },
    };

    const estadoConfig =
      estados[estado as keyof typeof estados] || estados.pendiente;

    return <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>;
  };

  const mutationEdit = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearPedidoInterface>;
    }) => EditarPedido(id, data),
  });

  const handleCancelarPedido = () => {
    if (!pedido.id) return;

    mutationEdit.mutate(
      { id: pedido.id, data: { estado: EstadoPedido.CANCELADO } },
      {
        onSuccess: () => {
          toast.success(t("messages.cancelSuccess"));
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["pedidos-cliente"] });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || t("errors.cancelOrder"),
          );
        },
      },
    );
  };

  const totalImpuestos =
    (parseFloat(pedido.isv_15) || 0) + (parseFloat(pedido.isv_18) || 0);

  const baseGravableTotal =
    (parseFloat(pedido.importe_gravado_15) || 0) +
    (parseFloat(pedido.importe_gravado_18) || 0);

  const sucursalesUnicas = Array.from(
    new Map(pedido.detalles.map((d) => [d.sucursal.id, d.sucursal])).values(),
  );

  const sucursalesIds = pedido.detalles.map((sucs) => sucs.sucursal.id);
  const esMismaSucursal = new Set(sucursalesIds).size === 1;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {!esMismaSucursal && (
          <div className="w-full flex justify-center">
            <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <AlertTriangleIcon />
              <AlertTitle>{t("multipleBranches.title")}</AlertTitle>
              <AlertDescription>
                {t("multipleBranches.description")}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  {t("orderNumber", { id: pedido.id.slice(-8) })}
                </CardTitle>
                {getEstadoBadge(pedido.estado)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDateOnly(pedido.created_at)}
              </CardDescription>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(pedido.total, simbolo)}
              </div>
              <Button
                id="btn-impuestos-pedidos"
                variant="ghost"
                size="sm"
                onClick={() => setMostrarImpuestos(!mostrarImpuestos)}
                className="mt-1 text-xs"
              >
                <Receipt className="h-3 w-3 mr-1" />
                {mostrarImpuestos ? t("taxes.hide") : t("taxes.view")}{" "}
                {t("taxes.label")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("branches")}
                  </h3>

                  <div>
                    {sucursalesUnicas.map((sucursal) => (
                      <div key={sucursal.id}>
                        <p className="text-sm text-gray-600">
                          {sucursal.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          {sucursal.direccion_complemento}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("delivery.title")}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {pedido.tipo_entrega}
                  </p>
                  {pedido.direccion_entrega && (
                    <p className="text-sm text-gray-500">
                      {pedido.direccion_entrega}
                    </p>
                  )}
                  {pedido.nombre_finca && (
                    <p className="text-sm text-gray-500">
                      {t("delivery.farm")}: {pedido.nombre_finca}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  {t("taxSummary")}
                </h4>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-700">{t("subtotal")}:</span>
                    <span className="font-medium">
                      {formatCurrency(pedido.sub_total, simbolo)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">{t("taxes.label")}:</span>
                    <span className="font-medium text-red-600">
                      +{formatCurrency(totalImpuestos.toString(), simbolo)}
                    </span>
                  </div>
                  {pedido.tipo_entrega === TipoEntrega.DELIVERY && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        {t("delivery.title")}:
                      </span>
                      <span className="font-medium text-orange-600">
                        +{formatCurrency(pedido.costo_delivery, simbolo)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("products", { count: pedido.detalles.length })}
              </h3>

              <div className="space-y-3">
                {pedido.detalles.map((detalle: Detalle) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {detalle.producto.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {detalle.producto.atributos && (
                          <span className="block text-xs">
                            {detalle.producto.atributos}
                          </span>
                        )}
                        <span>
                          {t("productCode")}: {detalle.producto.codigo}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {detalle.cantidad} x{" "}
                          {formatCurrency(detalle.precio, simbolo)}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(detalle.total, simbolo)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mostrarImpuestos && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    {t("taxes.breakdown")}
                  </h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.taxableBase15")}:
                        </span>
                        <div className="font-medium">
                          {formatCurrency(pedido.importe_gravado_15, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.taxableBase18")}:
                        </span>
                        <div className="font-medium">
                          {formatCurrency(pedido.importe_gravado_18, simbolo)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.exemptAmount")}:
                        </span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(pedido.importe_exento, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.exoneratedAmount")}:
                        </span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(pedido.importe_exonerado, simbolo)}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.isv15")}:
                        </span>
                        <div className="font-medium text-red-600">
                          +{formatCurrency(pedido.isv_15, simbolo)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("taxes.isv18")}:
                        </span>
                        <div className="font-medium text-red-600">
                          +{formatCurrency(pedido.isv_18, simbolo)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-yellow-800 font-medium">
                          {t("taxes.total")}:
                        </span>
                        <span className="text-red-600 font-bold">
                          +{formatCurrency(totalImpuestos.toString(), simbolo)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {t("subtotal")}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(pedido.sub_total, simbolo)}
                    </span>
                  </div>

                  {totalImpuestos > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {t("taxes.label")}
                      </span>
                      <span className="text-red-600 font-medium">
                        +{formatCurrency(totalImpuestos.toString(), simbolo)}
                      </span>
                    </div>
                  )}

                  {pedido.tipo_entrega === TipoEntrega.DELIVERY && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {t("delivery.cost")}
                      </span>
                      <span className="text-orange-600 font-medium">
                        +{formatCurrency(pedido.costo_delivery, simbolo)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {t("grandTotal")}
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(pedido.total, simbolo)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            {pedido.estado === "pendiente" && (
              <Button
                id="id-cancel-pedido"
                onClick={() => setIsOpen(true)}
                variant="destructive"
                size="sm"
              >
                {t("buttons.cancelOrder")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel className="rounded-full p-1 hover:bg-muted">
              ✕
            </AlertDialogCancel>
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-destructive">
              {t("cancelDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t("cancelDialog.description")}{" "}
              <span className="font-semibold">
                {t("cancelDialog.irreversible")}
              </span>
              . {t("cancelDialog.consequences")}{" "}
              {t("cancelDialog.confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
            <AlertDialogCancel className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition">
              {t("cancelDialog.back")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90 transition"
              onClick={handleCancelarPedido}
            >
              {t("cancelDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PedidoCard;
