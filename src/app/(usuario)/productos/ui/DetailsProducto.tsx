import { Producto } from "@/api/productos/interfaces/response-producto-by-id.interface";
import { ResponseInterfazPais } from "@/api/sucursales/interfaces/response-sucursal-pais.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Cliente } from "@/interfaces/auth/cliente";
import { useCartStore } from "@/providers/store/useCartStore";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface Props {
  producto: Producto;
  isLoadingSucursales: boolean;
  sucursalId: string;
  handleSucursalChange: (value: string) => void;
  sucursales: ResponseInterfazPais[] | undefined;
  isLoadingExistencia: boolean;
  isErrorExistencia: boolean;
  nombreSucursal: string;
  isAvailable: boolean;
  cantidadDisponible: number;
  cliente: Cliente | undefined;
  precio: string;
  handleDecrease: () => void;
  setQuantity: Dispatch<SetStateAction<number>>;
  quantity: number;
  handleIncrease: () => void;
  notas: string;
  setNotas: Dispatch<SetStateAction<string>>;
  totalPrecio: number;
  isFavorite: boolean;
  handleToggleFavorite: () => void;
}

const DetailsProducto = ({
  producto,
  isLoadingSucursales,
  sucursalId,
  handleSucursalChange,
  sucursales,
  isLoadingExistencia,
  isErrorExistencia,
  nombreSucursal,
  isAvailable,
  cantidadDisponible,
  cliente,
  precio,
  handleDecrease,
  setQuantity,
  quantity,
  handleIncrease,
  notas,
  setNotas,
  totalPrecio,
  isFavorite,
  handleToggleFavorite,
}: Props) => {
  const router = useRouter();
  const {
    addToCart,
    cart,
    canAddToSucursal,
    getCurrentSucursal,
    currentSucursalId,
  } = useCartStore();

  const isInCart = cart.some(
    (item) => item.id === producto.id && item.sucursalId === sucursalId,
  );

  const canAddToCurrentSucursal = canAddToSucursal(sucursalId);
  const currentSucursal = getCurrentSucursal();

  const getCurrentSucursalName = () => {
    if (!currentSucursal) return "";
    const item = cart.find((item) => item.sucursalId === currentSucursal);
    return item?.nombreSucursal || "";
  };

  const handleAddToCart = () => {
    if (!isAvailable || !sucursalId) return;

    if (!canAddToCurrentSucursal) {
      toast.error(
        `No puedes agregar productos de ${nombreSucursal}. Tu pedido actual es para ${getCurrentSucursalName()}. Limpia el carrito para cambiar de sucursal.`,
      );
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(producto, sucursalId, nombreSucursal, notas);
    }
    isInCart
      ? toast.success(
          `${producto.nombre} ya estaba en el carrito. Se agregaron ${quantity} unidad${quantity > 1 ? "es" : ""} más.`,
        )
      : toast.success(`${producto.nombre} fue agregado al carrito.`);
    setNotas("");
    setQuantity(1);
  };

  const isSucursalDisabled =
    currentSucursal !== null && currentSucursal !== sucursalId;

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-0">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {producto.nombre}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
          {producto.atributos || "N/D"}
        </p>
      </div>

      {isSucursalDisabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center gap-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <span className="text-sm sm:text-base text-yellow-800 font-medium block sm:inline">
                Pedido en curso para {getCurrentSucursalName()}
              </span>
              <p className="text-xs sm:text-sm text-yellow-700 mt-1 sm:mt-0 sm:inline sm:ml-2">
                No puedes agregar productos de otras sucursales.
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-800 font-semibold ml-1 text-xs sm:text-sm"
                  onClick={() => router.push("/cart")}
                >
                  Ver carrito
                </Button>
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
            <Label className="text-sm sm:text-base md:text-lg font-semibold">
              Seleccionar sucursal
            </Label>
          </div>

          {isLoadingSucursales ? (
            <Skeleton className="h-9 sm:h-10 w-full" />
          ) : (
            <Select
              value={sucursalId}
              onValueChange={handleSucursalChange}
              disabled={isLoadingSucursales || !sucursales?.length}
            >
              <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                <SelectValue
                  placeholder={
                    isLoadingSucursales
                      ? "Cargando sucursales..."
                      : !sucursales?.length
                        ? "No hay sucursales disponibles"
                        : "Selecciona una sucursal"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sucursales?.map((sucursal) => (
                  <SelectItem
                    key={sucursal.id}
                    value={sucursal.id}
                    className="text-sm sm:text-base"
                  >
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {sucursalId && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
              {isLoadingExistencia ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded-full" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                </div>
              ) : isErrorExistencia ? (
                <Badge
                  variant="destructive"
                  className="text-xs sm:text-sm w-fit"
                >
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  Error al cargar existencia
                </Badge>
              ) : (
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Disponible en {nombreSucursal}:
                  </span>
                  <Badge
                    variant={isAvailable ? "default" : "destructive"}
                    className="text-xs sm:text-sm w-fit"
                  >
                    {isAvailable ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    )}
                    {cantidadDisponible} {producto.unidad_venta || "unidad"}
                    {cantidadDisponible !== 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
          {cliente?.pais?.simbolo_moneda || "$"}
          {precio}
        </span>

        <Badge
          variant={isAvailable ? "default" : "destructive"}
          className="text-xs sm:text-sm px-2 sm:px-3 py-1 w-fit"
        >
          {isAvailable ? (
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
          )}
          {isAvailable
            ? `Disponible (${cantidadDisponible} ${producto.unidad_venta || "unidad"}${cantidadDisponible !== 1 ? "s" : ""})`
            : "Agotado"}
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <span className="text-base sm:text-lg font-semibold">Cantidad</span>
          <div className="flex items-center justify-between xs:justify-end space-x-2 sm:space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={quantity <= 1 || !sucursalId}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <span className="text-lg sm:text-xl font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={
                !isAvailable || quantity >= cantidadDisponible || !sucursalId
              }
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="notas" className="text-sm sm:text-base font-semibold">
            Notas para este producto
          </Label>
          <Input
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Agregar notas especiales..."
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <Separator className="my-2" />

      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-sm sm:text-base font-semibold">
              {quantity} {quantity === 1 ? "producto" : "productos"}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {cliente?.pais?.simbolo_moneda || "$"}
              {totalPrecio.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <Button
              variant="outline"
              className={`xs:max-w-[60px] transition-all duration-300 ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
              onClick={handleToggleFavorite}
              title={
                isFavorite ? "Remover de favoritos" : "Agregar a favoritos"
              }
            >
              <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-current" : ""}`}
              />
              <span className="xs:hidden ml-2">
                {isFavorite ? "En favoritos" : "Agregar a favoritos"}
              </span>
            </Button>

            <Button
              disabled={!isAvailable || !sucursalId || !canAddToCurrentSucursal}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="truncate">
                {!sucursalId
                  ? "Selecciona una sucursal"
                  : !canAddToCurrentSucursal
                    ? `Pedido para ${getCurrentSucursalName()}`
                    : isInCart
                      ? "Agregar más al carrito"
                      : "Agregar al carrito"}
              </span>
            </Button>
          </div>

          {!canAddToCurrentSucursal && (
            <p className="text-xs sm:text-sm text-yellow-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Limpia el carrito para pedir de esta sucursal</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-2">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">
            Detalles del producto
          </h3>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              Unidad de medida:
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {producto.unidad_venta || "No especificada"}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              Sucursal seleccionada:
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {nombreSucursal || "No seleccionada"}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              Cantidad disponible:
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {sucursalId
                ? isLoadingExistencia
                  ? "Cargando..."
                  : `${cantidadDisponible} ${producto.unidad_venta || "unidad"}${cantidadDisponible !== 1 ? "s" : ""}`
                : "Selecciona una sucursal"}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">Estado:</span>
            <Badge
              variant={isAvailable ? "default" : "destructive"}
              className="text-xs sm:text-sm w-fit"
            >
              {!sucursalId
                ? "Selecciona sucursal"
                : isAvailable
                  ? "Disponible"
                  : "Agotado"}
            </Badge>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              En favoritos:
            </span>
            <Badge
              variant={isFavorite ? "default" : "outline"}
              className="text-xs sm:text-sm w-fit"
            >
              {isFavorite ? "Sí" : "No"}
            </Badge>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              En carrito:
            </span>
            <Badge
              variant={isInCart ? "default" : "outline"}
              className="text-xs sm:text-sm w-fit"
            >
              {isInCart ? "Sí" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsProducto;
