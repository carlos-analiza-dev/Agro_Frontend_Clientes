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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {producto.nombre}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {producto.atributos || "N/D"}
        </p>
      </div>

      {isSucursalDisabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Pedido en curso para {getCurrentSucursalName()}
            </span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            No puedes agregar productos de otras sucursales.
            <Button
              variant="link"
              className="p-0 h-auto text-yellow-800 font-semibold ml-1"
              onClick={() => router.push("/cart")}
            >
              Ver carrito
            </Button>
          </p>
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-gray-600" />
            <Label htmlFor="sucursal" className="text-lg font-semibold">
              Seleccionar sucursal
            </Label>
          </div>

          {isLoadingSucursales ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={sucursalId}
              onValueChange={handleSucursalChange}
              disabled={isLoadingSucursales || !sucursales?.length}
            >
              <SelectTrigger>
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
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {sucursalId && (
            <div className="flex items-center justify-between pt-2">
              {isLoadingExistencia ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : isErrorExistencia ? (
                <Badge variant="destructive" className="text-sm">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error al cargar existencia
                </Badge>
              ) : (
                <>
                  <span className="text-sm text-gray-600">
                    Disponible en {nombreSucursal}:
                  </span>
                  <Badge
                    variant={isAvailable ? "default" : "destructive"}
                    className="text-sm"
                  >
                    {isAvailable ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {cantidadDisponible} {producto.unidad_venta || "unidad"}{" "}
                    (as)
                  </Badge>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold text-green-600">
          {cliente?.pais?.simbolo_moneda || "$"}
          {precio}
        </span>

        <Badge
          variant={isAvailable ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          {isAvailable ? (
            <CheckCircle2 className="w-4 h-4 mr-1" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-1" />
          )}
          {isAvailable
            ? `Disponible (${cantidadDisponible} ${producto.unidad_venta || "unidad"})`
            : "Agotado"}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Cantidad</span>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={quantity <= 1 || !sucursalId}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="text-xl font-bold min-w-[3rem] text-center">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={
                !isAvailable || quantity >= cantidadDisponible || !sucursalId
              }
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notas" className="text-lg font-semibold">
            Notas para este producto
          </label>
          <Input
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Agregar notas especiales..."
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">
              {quantity} {quantity === 1 ? "producto" : "productos"}
            </span>
            <span className="text-2xl font-bold text-green-600">
              {cliente?.pais?.simbolo_moneda || "$"}
              {totalPrecio.toFixed(2)}
            </span>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="icon"
              className={`flex-1 max-w-[60px] transition-all duration-300 ${
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
                className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>

            <Button
              disabled={!isAvailable || !sucursalId || !canAddToCurrentSucursal}
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {!sucursalId
                ? "Selecciona una sucursal"
                : !canAddToCurrentSucursal
                  ? `Pedido para ${getCurrentSucursalName()}`
                  : isInCart
                    ? "Agregar más al carrito"
                    : "Agregar al carrito"}
            </Button>
          </div>

          {!canAddToCurrentSucursal && (
            <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Limpia el carrito para pedir de esta sucursal
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Detalles del producto</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Unidad de medida:</span>
            <span className="font-semibold">
              {producto.unidad_venta || "No especificada"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sucursal seleccionada:</span>
            <span className="font-semibold">
              {nombreSucursal || "No seleccionada"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cantidad disponible:</span>
            <span className="font-semibold">
              {sucursalId
                ? isLoadingExistencia
                  ? "Cargando..."
                  : `${cantidadDisponible} ${producto.unidad_venta || "unidad"}  (as)`
                : "Selecciona una sucursal"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estado:</span>
            <Badge variant={isAvailable ? "default" : "destructive"}>
              {!sucursalId
                ? "Selecciona sucursal"
                : isAvailable
                  ? "Disponible"
                  : "Agotado"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">En favoritos:</span>
            <Badge variant={isFavorite ? "default" : "outline"}>
              {isFavorite ? "Sí" : "No"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">En carrito:</span>
            <Badge variant={isInCart ? "default" : "outline"}>
              {isInCart ? "Sí" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsProducto;
