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
import { useCartStore } from "@/providers/store/useCartStore";
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

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
  moneda: string;
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
  sucursal: ResponseInterfazPais | null;
  sucursalesDisponible:
    | {
        id: string;
        nombre: string;
        existencia: number;
      }[]
    | undefined;
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
  moneda,
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
  sucursal,
  sucursalesDisponible,
}: Props) => {
  const t = useTranslations("productDetails.detailsProduct");

  const { addToCart, cart } = useCartStore();

  const isInCart = cart.some(
    (item) => item.id === producto.id && item.sucursalId === sucursalId,
  );

  const handleAddToCart = () => {
    if (!isAvailable || !sucursalId) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(
        producto,
        sucursalId,
        nombreSucursal,
        Number(sucursal?.longitud),
        Number(sucursal?.latitud),
        notas,
      );
    }

    isInCart
      ? toast.success(
          t("cart.addedMore", {
            name: producto.nombre,
            count: quantity,
          }),
        )
      : toast.success(t("cart.added", { name: producto.nombre }));

    setNotas("");
    setQuantity(1);
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-0">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {producto.nombre}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
          {producto.atributos || "N/A"}
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
            <Label className="text-sm sm:text-base md:text-lg font-semibold">
              {t("selectBranch")}
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
                      ? t("loadingBranches")
                      : !sucursales?.length
                        ? t("noBranches")
                        : t("selectBranchPlaceholder")
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
                  {t("stockError")}
                </Badge>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      {t("availableAt", { branch: nombreSucursal })}:
                    </span>

                    <Badge
                      variant={isAvailable ? "default" : "destructive"}
                      className="text-xs sm:text-sm w-fit flex items-center px-3 py-1"
                    >
                      {isAvailable ? (
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      )}

                      <span className="font-medium">
                        {t("quantityUnits", {
                          count: cantidadDisponible,
                          unit: producto.unidad_venta || t("unit"),
                        })}
                      </span>
                    </Badge>
                  </div>

                  {!isAvailable &&
                    sucursalesDisponible &&
                    sucursalesDisponible.length > 0 && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />

                          <div className="space-y-2">
                            <p className="text-sm text-amber-800 font-medium">
                              {t("availableInOtherBranches")}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {sucursalesDisponible.map((dis) => (
                                <Badge
                                  key={dis.id}
                                  variant="secondary"
                                  className="px-3 py-1 text-xs sm:text-sm bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
                                >
                                  {dis.nombre}
                                  <span className="ml-1 font-semibold">
                                    ({dis.existencia})
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
          {moneda || "$"}
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
            ? t("availableWithQuantity", {
                count: cantidadDisponible,
                unit: producto.unidad_venta || t("unit"),
              })
            : t("outOfStock")}
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <span className="text-base sm:text-lg font-semibold">
            {t("quantity")}
          </span>

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
            {t("productNotes")}
          </Label>
          <Input
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder={t("notesPlaceholder")}
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <Separator className="my-2" />

      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-sm sm:text-base font-semibold">
              {t("productsCount", { count: quantity })}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {moneda || "$"}
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
              title={isFavorite ? t("removeFavorite") : t("addFavorite")}
            >
              <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-current" : ""}`}
              />
              <span className="xs:hidden ml-2">
                {isFavorite ? t("inFavorites") : t("addFavorite")}
              </span>
            </Button>

            <Button
              disabled={!isAvailable || !sucursalId}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="truncate">
                {!sucursalId
                  ? t("selectBranchFirst")
                  : isInCart
                    ? t("addMoreToCart")
                    : t("addToCart")}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-3 sm:p-4 pb-2">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">
            {t("productDetails")}
          </h3>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("unitOfMeasure")}
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {producto.unidad_venta || t("notSpecified")}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("selectedBranch")}
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {nombreSucursal || t("notSelected")}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("availableQuantity")}
            </span>
            <span className="font-semibold text-xs sm:text-sm">
              {sucursalId
                ? isLoadingExistencia
                  ? t("loading")
                  : t("quantityUnits", {
                      count: cantidadDisponible,
                      unit: producto.unidad_venta || t("unit"),
                    })
                : t("selectBranchFirst")}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("status")}
            </span>
            <Badge
              variant={isAvailable ? "default" : "destructive"}
              className="text-xs sm:text-sm w-fit"
            >
              {!sucursalId
                ? t("selectBranch")
                : isAvailable
                  ? t("available")
                  : t("outOfStock")}
            </Badge>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("inFavoritesLabel")}
            </span>
            <Badge
              variant={isFavorite ? "default" : "outline"}
              className="text-xs sm:text-sm w-fit"
            >
              {isFavorite ? t("yes") : t("no")}
            </Badge>
          </div>

          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2 text-sm sm:text-base">
            <span className="text-gray-600 text-xs sm:text-sm">
              {t("inCartLabel")}
            </span>
            <Badge
              variant={isInCart ? "default" : "outline"}
              className="text-xs sm:text-sm w-fit"
            >
              {isInCart ? t("yes") : t("no")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsProducto;
