import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cliente } from "@/interfaces/auth/cliente";
import { CartItem } from "@/providers/store/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  item: CartItem;
  cliente: Cliente | undefined;
  removeFromCart: (productoId: string, sucursalId: string) => void;
  decreaseQuantity: (productoId: string, sucursalId: string) => void;
  increaseQuantity: (productoId: string, sucursalId: string) => void;
}

const CardCarrito = ({
  item,
  cliente,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
}: Props) => {
  const getImagenPrincipal = (imagenes: any[]) => {
    if (!imagenes || imagenes.length === 0) {
      return "/images/ProductNF.png";
    }
    return imagenes[0]?.url || "/images/ProductNF.png";
  };

  const getPrecio = (item: CartItem) => {
    if (!item?.preciosPorPais || item.preciosPorPais.length === 0) {
      return "0.00";
    }
    return item.preciosPorPais[0]?.precio || "0.00";
  };

  const handleRemoveCart = (item: CartItem) => {
    removeFromCart(item.id, item.sucursalId);
    toast.success("Producto eliminado del carrito");
  };

  return (
    <Card key={`${item.id}-${item.sucursalId}`} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={getImagenPrincipal(item.imagenes)}
              unoptimized
              alt={item.nombre}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.marca?.nombre || "Sin marca"}
                </p>
                {item.sucursalId && item.nombreSucursal && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Sucursal: {item.nombreSucursal}
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCart(item)}
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => decreaseQuantity(item.id, item.sucursalId)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="text-lg font-bold min-w-[2rem] text-center">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => increaseQuantity(item.id, item.sucursalId)}
                  className="h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <span className="text-sm text-gray-600 ml-2">
                  {item.unidad_venta || "unidad"}
                </span>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {cliente?.pais?.simbolo_moneda || "$"}
                  {getPrecio(item)}
                </p>
                <p className="text-sm text-gray-600">
                  Total: {cliente?.pais?.simbolo_moneda || "$"}
                  {(parseFloat(getPrecio(item)) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardCarrito;
