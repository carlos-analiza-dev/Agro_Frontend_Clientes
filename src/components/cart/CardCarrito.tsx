import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/providers/store/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  item: CartItem;
  moneda: string;
  removeFromCart: (productoId: string, sucursalId: string) => void;
  decreaseQuantity: (productoId: string, sucursalId: string) => void;
  increaseQuantity: (productoId: string, sucursalId: string) => void;
}

const CardCarrito = ({
  item,
  moneda,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleRemoveCart = async (item: CartItem) => {
    setIsDeleting(true);
    try {
      removeFromCart(item.id, item.sucursalId);
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      toast.error("Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  const precioUnitario = parseFloat(getPrecio(item));
  const totalItem = precioUnitario * item.quantity;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 mx-auto sm:mx-0">
            <Image
              src={getImagenPrincipal(item.imagenes)}
              unoptimized
              alt={item.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2">
                  {item.nombre}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  {item.marca?.nombre || "Sin marca"}
                </p>
                {item.sucursalId && item.nombreSucursal && (
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs inline-block max-w-full truncate"
                  >
                    Sucursal: {item.nombreSucursal}
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCart(item)}
                disabled={isDeleting}
                className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                aria-label="Eliminar producto"
              >
                <Trash2
                  className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`}
                />
              </Button>
            </div>

            <div className="mt-3 sm:mt-4">
              <div className="flex flex-col sm:hidden gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      Precio unitario
                    </span>
                    <span className="text-base font-bold text-green-600">
                      {moneda || "$"} {precioUnitario.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Total</span>
                    <p className="text-base font-bold text-green-600">
                      {moneda || "$"} {totalItem.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decreaseQuantity(item.id, item.sucursalId)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="text-base font-bold min-w-[2rem] text-center">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increaseQuantity(item.id, item.sucursalId)}
                      className="h-8 w-8"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <span className="text-xs text-gray-500 ml-1">
                      {item.unidad_venta || "unidad"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decreaseQuantity(item.id, item.sucursalId)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>

                  <span className="text-base sm:text-lg font-bold min-w-[2rem] text-center">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => increaseQuantity(item.id, item.sucursalId)}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>

                  <span className="text-xs sm:text-sm text-gray-600 ml-1">
                    {item.unidad_venta || "unidad"}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <div>
                      <span className="text-xs text-gray-500">
                        Precio unitario
                      </span>
                      <p className="text-sm sm:text-base text-gray-700">
                        {moneda || "$"} {precioUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Total</span>
                      <p className="text-base sm:text-lg font-bold text-green-600">
                        {moneda || "$"} {totalItem.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardCarrito;
