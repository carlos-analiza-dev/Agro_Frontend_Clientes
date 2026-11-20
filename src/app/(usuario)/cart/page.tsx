"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useCartStore } from "@/providers/store/useCartStore";
import { CrearPedido } from "@/api/pedidos/accions/crear-pedido";
import {
  EstadoPedido,
  CrearPedidoInterface,
} from "@/api/pedidos/interface/crear-pedido.interface";
import { toast } from "react-toastify";
import { Loader2, ShoppingCart, Truck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useState } from "react";
import ResumenPedido, {
  UbicacionPedido,
} from "@/components/cart/ResumenPedido";
import CardCarrito from "@/components/cart/CardCarrito";
import SeleccionUbicacion from "@/components/cart/SeleccionaUbicacion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { determinarTasaImpuesto } from "@/helpers/funciones/cart/determinarTasaImpuesto";
import { useTranslations } from "next-intl";

const CarritoPage = () => {
  const t = useTranslations("cartPage");
  const router = useRouter();
  const { cliente } = useAuthStore();
  const [isErrorAuth, setIsErrorAuth] = useState("");
  const clienteId = cliente?.id || "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();
  const sucursales = cart.map((item) => item.sucursalId);
  const sucursalesUnicas = [...new Set(sucursales)];
  const sonDiferentesSucursales = sucursalesUnicas.length > 1;
  const [sucursalCercana, setSucursalCercana] = useState("");

  const productosPorSucursal = cart.reduce(
    (acc, item) => {
      const sucursalId = item.sucursalId;
      if (!acc[sucursalId]) {
        acc[sucursalId] = {
          sucursalId,
          nombreSucursal: item.nombreSucursal || t("branches.unknownBranch"),
          productos: [],
          totalProductos: 0,
          subtotal: 0,
        };
      }
      acc[sucursalId].productos.push(item);
      acc[sucursalId].totalProductos += item.quantity;
      acc[sucursalId].subtotal +=
        item.quantity * parseFloat(item.preciosPorPais?.[0]?.precio ?? "0");
      return acc;
    },
    {} as Record<string, any>,
  );
  const { data: fincas } = useFincasPropietarios(clienteId);

  const [ubicacionSeleccionada, setUbicacionSeleccionada] =
    useState<UbicacionPedido | null>(null);
  const [mostrarSeleccionUbicacion, setMostrarSeleccionUbicacion] =
    useState(false);

  const queryClient = useQueryClient();
  const crearPedidoMutation = useMutation({
    mutationFn: async (pedidosData: CrearPedidoInterface[]) => {
      const promises = pedidosData.map((pedidoData) => CrearPedido(pedidoData));
      return await Promise.all(promises);
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["pedidos-cliente"] });
      toast.success(t("checkout.success"));
      router.push("/pedidos");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || t("checkout.error");
        toast.error(errorMessage);
      }
    },
  });

  const handleContinueShopping = () => {
    router.push("/productos");
  };

  const handleCheckout = (ubicacion: UbicacionPedido) => {
    if (!cliente) {
      setIsErrorAuth(t("checkout.authRequired"));
      toast.error(t("checkout.authError"));
      return;
    }

    if (cart.length === 0) {
      toast.error(t("checkout.emptyCart"));
      return;
    }

    if (!ubicacion) {
      toast.error(t("checkout.locationRequired"));
      return;
    }

    const detalles = cart.map((item) => ({
      id_producto: item.id,
      id_sucursal: item.sucursalId || undefined,
      cantidad: item.quantity,
      precio: parseFloat(item.preciosPorPais?.[0]?.precio ?? "0"),
      total:
        item.totalPrecio ||
        item.quantity * parseFloat(item.preciosPorPais?.[0]?.precio ?? "0"),
    }));

    const sub_total = detalles.reduce((sum, detalle) => sum + detalle.total, 0);

    let importe_gravado_15 = 0;
    let importe_gravado_18 = 0;
    let isv_15 = 0;
    let isv_18 = 0;
    let importe_exento = 0;

    for (const item of cart) {
      const totalLinea =
        item.quantity * parseFloat(item.preciosPorPais?.[0]?.precio ?? "0");
      const tasaImpuesto = determinarTasaImpuesto(item);

      if (tasaImpuesto === 0.15) {
        importe_gravado_15 += totalLinea;
        isv_15 += totalLinea * 0.15;
      } else if (tasaImpuesto === 0.18) {
        importe_gravado_18 += totalLinea;
        isv_18 += totalLinea * 0.18;
      } else {
        importe_exento += totalLinea;
      }
    }

    const total = sub_total + isv_15 + isv_18 + (ubicacion.costoDelivery || 0);

    const pedidoData: CrearPedidoInterface = {
      id_sucursal_cercana: sonDiferentesSucursales
        ? sucursalCercana
        : sucursalesUnicas[0],
      sub_total: sub_total,
      importe_exento: importe_exento,
      importe_exonerado: 0,
      importe_gravado_15: importe_gravado_15,
      importe_gravado_18: importe_gravado_18,
      isv_15: isv_15,
      isv_18: isv_18,
      total: total,
      estado: EstadoPedido.PENDIENTE,
      detalles: detalles,
      direccion_entrega: ubicacion.direccion_entrega,
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
      tipo_entrega: ubicacion.tipoEntrega,
      costo_delivery: ubicacion.costoDelivery || 0,
      nombre_finca: ubicacion.nombre_finca,
    };

    crearPedidoMutation.mutate([pedidoData]);
  };

  const handleUbicacionSeleccionada = (ubicacion: UbicacionPedido) => {
    setUbicacionSeleccionada(ubicacion);
    setMostrarSeleccionUbicacion(false);
    toast.success(t("location.success"));
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("empty.title")}
        </h2>
        <p className="text-gray-600 mb-8">{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600 mt-2">{t("description")}</p>
      </div>

      {sonDiferentesSucursales && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Truck className="h-5 w-5 text-amber-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 text-base sm:text-lg">
                  {t("branches.title")}
                </h3>

                <p className="text-amber-700 text-sm sm:text-base mt-1">
                  {t("branches.description", {
                    count: sucursalesUnicas.length,
                  })}
                </p>
                <Separator className="my-3 bg-amber-200" />
                <div className="space-y-2">
                  <p className="text-xs text-amber-700 font-medium">
                    📦 {t("branches.productsByBranch")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(productosPorSucursal).map((sucursal) => (
                      <Badge
                        key={sucursal.sucursalId}
                        variant="secondary"
                        className="bg-white border border-amber-300 text-amber-700"
                      >
                        {sucursal.nombreSucursal}:{" "}
                        {t("branches.productCount", {
                          count: sucursal.totalProductos,
                        })}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CardCarrito
              key={`${item.id}-${item.sucursalId}`}
              item={item}
              moneda={moneda}
              removeFromCart={removeFromCart}
              decreaseQuantity={decreaseQuantity}
              increaseQuantity={increaseQuantity}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <ResumenPedido
            totalItems={totalItems}
            moneda={moneda}
            isErrorAuth={isErrorAuth}
            totalPrice={totalPrice}
            handleCheckout={handleCheckout}
            handleContinueShopping={handleContinueShopping}
            isProcessing={crearPedidoMutation.isPending}
            ubicacionSeleccionada={ubicacionSeleccionada}
            onSeleccionarUbicacion={() => setMostrarSeleccionUbicacion(true)}
            sonDiferentesSucursales={sonDiferentesSucursales}
            setSucursalCercana={setSucursalCercana}
            sucursalCercana={sucursalCercana}
          />
        </div>
      </div>

      {mostrarSeleccionUbicacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{t("location.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <SeleccionUbicacion
                fincas={fincas?.data.fincas || []}
                onUbicacionSeleccionada={handleUbicacionSeleccionada}
                cliente={cliente}
                sonDiferentesSucursales={sonDiferentesSucursales}
              />
              <Button
                variant="outline"
                onClick={() => setMostrarSeleccionUbicacion(false)}
                className="w-full mt-4"
              >
                {t("location.cancel")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {crearPedidoMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("processing.title")}
            </h3>
            <p className="text-gray-600">{t("processing.description")}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CarritoPage;
