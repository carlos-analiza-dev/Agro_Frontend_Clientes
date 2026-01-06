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
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import CardCarrito from "./ui/CardCarrito";
import ResumenPedido, { UbicacionPedido } from "./ui/ResumenPedido";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useState } from "react";
import SeleccionUbicacion from "./ui/SeleccionaUbicacion";

const CarritoPage = () => {
  const router = useRouter();
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id || "";
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();
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
      toast.success("¡Pedido realizado con éxito!");
      router.push("/pedidos");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al realizar el pedido";
        toast.error(errorMessage);
      }
    },
  });

  const handleContinueShopping = () => {
    router.push("/productos");
  };

  const handleCheckout = (ubicacion: UbicacionPedido) => {
    if (!cliente) {
      toast.error("Debes iniciar sesión para realizar un pedido");
      router.push("/");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!ubicacion) {
      toast.error("Debes seleccionar una ubicación de entrega");
      return;
    }

    const itemsPorSucursal = cart.reduce(
      (acc, item) => {
        const sucursalId = item.sucursalId || "default";
        if (!acc[sucursalId]) {
          acc[sucursalId] = {
            sucursalId: sucursalId,
            nombreSucursal: item.nombreSucursal || "Sucursal Principal",
            items: [],
          };
        }
        acc[sucursalId].items.push(item);
        return acc;
      },
      {} as Record<
        string,
        { sucursalId: string; nombreSucursal: string; items: any[] }
      >
    );

    // Obtener los detalles procesados UNA SOLA VEZ
    const { detalles: todosLosDetalles, totales } = useCartStore
      .getState()
      .procesarDetallesCarrito();

    const pedidosData = Object.values(itemsPorSucursal).map((grupoSucursal) => {
      // Filtrar detalles para esta sucursal específica
      const detallesSucursal = todosLosDetalles.filter((detalle) =>
        grupoSucursal.items.some((item) => item.id === detalle.id_producto)
      );

      // Calcular subtotal para esta sucursal
      const subtotalSucursal = detallesSucursal.reduce(
        (sum, detalle) => sum + detalle.total,
        0
      );

      // Calcular impuestos proporcionales para esta sucursal
      const proporcion = subtotalSucursal / (totales.subTotal || 1); // Evitar división por cero

      const pedidoData: CrearPedidoInterface = {
        id_cliente: cliente.id,
        id_sucursal:
          grupoSucursal.sucursalId === "default"
            ? undefined
            : grupoSucursal.sucursalId,
        sub_total: subtotalSucursal,
        importe_exento: Number(
          (
            totales.subTotal -
            (totales.importeGravado15 + totales.importeGravado18) * proporcion
          ).toFixed(2)
        ),
        importe_exonerado: 0,
        importe_gravado_15: Number(
          (totales.importeGravado15 * proporcion).toFixed(2)
        ),
        importe_gravado_18: Number(
          (totales.importeGravado18 * proporcion).toFixed(2)
        ),
        isv_15: Number((totales.isv15 * proporcion).toFixed(2)),
        isv_18: Number((totales.isv18 * proporcion).toFixed(2)),
        total: Number(
          (
            subtotalSucursal +
            (totales.isv15 + totales.isv18) * proporcion +
            (ubicacion.costoDelivery || 0)
          ).toFixed(2)
        ),
        estado: EstadoPedido.PENDIENTE,
        detalles: detallesSucursal,
        direccion_entrega: ubicacion.direccion_entrega,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        tipo_entrega: ubicacion.tipoEntrega,
        costo_delivery: ubicacion.costoDelivery || 0,
        nombre_finca: ubicacion.nombre_finca,
      };

      return pedidoData;
    });

    crearPedidoMutation.mutate(pedidosData);
  };
  const handleUbicacionSeleccionada = (ubicacion: UbicacionPedido) => {
    setUbicacionSeleccionada(ubicacion);
    setMostrarSeleccionUbicacion(false);
    toast.success("Ubicación de entrega configurada");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-8">
          Agrega algunos productos para comenzar a comprar
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        <p className="text-gray-600 mt-2">
          Revisa y gestiona los productos en tu carrito
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CardCarrito
              key={`${item.id}-${item.sucursalId}`}
              item={item}
              cliente={cliente}
              removeFromCart={removeFromCart}
              decreaseQuantity={decreaseQuantity}
              increaseQuantity={increaseQuantity}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <ResumenPedido
            totalItems={totalItems}
            cliente={cliente}
            totalPrice={totalPrice}
            handleCheckout={handleCheckout}
            handleContinueShopping={handleContinueShopping}
            isProcessing={crearPedidoMutation.isPending}
            ubicacionSeleccionada={ubicacionSeleccionada}
            onSeleccionarUbicacion={() => setMostrarSeleccionUbicacion(true)}
          />
        </div>
      </div>

      {mostrarSeleccionUbicacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Selecciona Ubicación de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <SeleccionUbicacion
                fincas={fincas?.data.fincas || []}
                onUbicacionSeleccionada={handleUbicacionSeleccionada}
                cliente={cliente}
              />
              <Button
                variant="outline"
                onClick={() => setMostrarSeleccionUbicacion(false)}
                className="w-full mt-4"
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {crearPedidoMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Procesando Pedido</h3>
            <p className="text-gray-600">
              Estamos creando tu pedido, por favor espera...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CarritoPage;
