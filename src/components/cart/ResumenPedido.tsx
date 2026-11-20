import { TipoEntrega } from "@/api/pedidos/interface/crear-pedido.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  MapPin,
  Truck,
  Store,
  Info,
  AlertCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useCartStore } from "@/providers/store/useCartStore";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect } from "react";
import useGetSucursalesCercanas from "@/hooks/sucursales/useGetSucursalesCercanas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslations } from "next-intl";

interface UbicacionPedido {
  tipo: "finca" | "sucursal" | "otra";
  fincaId?: string;
  tipoEntrega: TipoEntrega;
  costoDelivery?: number;
  direccion_entrega?: string;
  latitud?: number;
  longitud?: number;
  nombre_finca?: string;
}

interface Props {
  totalItems: () => number;
  totalPrice: () => number;
  moneda: string;
  handleCheckout: (ubicacion: UbicacionPedido) => void;
  handleContinueShopping: () => void;
  isProcessing?: boolean;
  ubicacionSeleccionada?: UbicacionPedido | null;
  onSeleccionarUbicacion: () => void;
  isErrorAuth: string;
  sonDiferentesSucursales: boolean;
  sucursalCercana: string;
  setSucursalCercana: Dispatch<SetStateAction<string>>;
}

const ResumenPedido = ({
  totalItems,
  totalPrice,
  moneda,
  handleCheckout,
  handleContinueShopping,
  isProcessing = false,
  ubicacionSeleccionada,
  onSeleccionarUbicacion,
  isErrorAuth,
  sonDiferentesSucursales,
  sucursalCercana,
  setSucursalCercana,
}: Props) => {
  const { calcularImpuestos } = useCartStore();
  const impuestos = calcularImpuestos();
  const t = useTranslations("resumenPedido");
  const { data: sucursales, isLoading } = useGetSucursalesCercanas(
    ubicacionSeleccionada?.latitud,
    ubicacionSeleccionada?.longitud,
  );

  const sucursalMasCercana = sucursales?.[0];

  const sucursalSeleccionada = sucursales?.find(
    (s) => s.sucursal.id === sucursalCercana,
  );

  useEffect(() => {
    if (sucursalMasCercana && !sucursalCercana) {
      setSucursalCercana(sucursalMasCercana.sucursal.id);
    }
  }, [sucursalMasCercana, sucursalCercana, setSucursalCercana]);

  const costoDelivery = ubicacionSeleccionada?.costoDelivery || 0;

  const precioTotal = impuestos.total_general + costoDelivery;

  const obtenerTextoUbicacion = () => {
    if (!ubicacionSeleccionada) return t("location.notSelected");

    switch (ubicacionSeleccionada.tipo) {
      case "finca":
        return t("location.farm", {
          name: ubicacionSeleccionada.nombre_finca || t("location.selected"),
        });
      case "sucursal":
        return t("location.pickup");
      default:
        return t("location.custom");
    }
  };

  const obtenerTextoTipoEntrega = () => {
    if (!ubicacionSeleccionada) return "";

    return ubicacionSeleccionada.tipoEntrega === "delivery"
      ? t("location.homeDelivery")
      : t("location.pickup");
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sonDiferentesSucursales && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-amber-800 font-medium">
                  {t("differentBranches.title")}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {t("differentBranches.deliveryTime")}{" "}
                  <strong>{t("differentBranches.businessDays")}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("location.label")}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSeleccionarUbicacion}
              className="h-auto p-1"
            >
              {ubicacionSeleccionada ? (
                <>{t("location.change")}</>
              ) : (
                <>{t("location.select")}</>
              )}
            </Button>
          </div>

          {ubicacionSeleccionada ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{obtenerTextoUbicacion()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {ubicacionSeleccionada.tipoEntrega === "delivery" ? (
                  <Truck className="h-4 w-4" />
                ) : (
                  <Store className="h-4 w-4" />
                )}
                <span>{obtenerTextoTipoEntrega()}</span>
              </div>
              {ubicacionSeleccionada.direccion_entrega && (
                <div className="text-xs text-gray-600 mt-1">
                  {ubicacionSeleccionada.direccion_entrega}
                </div>
              )}
              {ubicacionSeleccionada.costoDelivery &&
                ubicacionSeleccionada.costoDelivery > 0 && (
                  <div className="text-sm text-orange-600 font-medium">
                    {t("location.delivery")} +{moneda || "$"}
                    {ubicacionSeleccionada.costoDelivery.toFixed(2)}
                  </div>
                )}
            </div>
          ) : (
            <p className="text-sm text-red-600">{t("location.mustSelect")}</p>
          )}
        </div>

        <Separator />
        {sucursales && sucursales.length > 0 && (
          <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-600" />

              <div>
                <p className="text-sm font-medium">{t("branches.select")}</p>

                <p className="text-xs text-muted-foreground">
                  {t("branches.description")}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("branches.searching")}
              </div>
            ) : (
              <Select
                value={sucursalCercana}
                onValueChange={setSucursalCercana}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("branches.placeholder")} />
                </SelectTrigger>

                <SelectContent>
                  {sucursales.map((item, index) => (
                    <SelectItem key={item.sucursal.id} value={item.sucursal.id}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span>{item.sucursal.nombre}</span>

                          {index === 0 && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              {t("branches.nearest")}
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {item.distancia_km.toFixed(2)} km
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {sucursalSeleccionada && (
              <div className="rounded-md border bg-white p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("branches.selected")}
                  </span>

                  <span className="text-sm font-semibold text-blue-600">
                    {sucursalSeleccionada.sucursal.nombre}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("branches.distance")}
                  </span>

                  <span className="text-sm">
                    {sucursalSeleccionada.distancia_km.toFixed(2)} km
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {sucursalSeleccionada.sucursal.direccion_complemento}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("totals.subtotal")}</span>
            <span className="font-semibold">
              {moneda || "$"}
              {impuestos.sub_total.toFixed(2)}
            </span>
          </div>

          {impuestos.importe_exento > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.exempt")}</span>
              <span className="text-green-600">
                -{moneda || "$"}
                {impuestos.importe_exento.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.importe_exonerado > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.exonerated")}</span>
              <span className="text-green-600">
                -{moneda || "$"}
                {impuestos.importe_exonerado.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.importe_gravado_15 > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.taxableBase15")}</span>
              <span>
                {moneda || "$"}
                {impuestos.importe_gravado_15.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.isv_15 > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.isv15")}</span>
              <span className="text-red-600">
                +{moneda || "$"}
                {impuestos.isv_15.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.importe_gravado_18 > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.taxableBase18")}</span>
              <span>
                {moneda || "$"}
                {impuestos.importe_gravado_18.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.isv_18 > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("totals.isv18")}</span>
              <span className="text-red-600">
                +{moneda || "$"}
                {impuestos.isv_18.toFixed(2)}
              </span>
            </div>
          )}

          {impuestos.total_impuestos > 0 && (
            <div className="flex justify-between text-sm font-medium pt-1 border-t">
              <span className="text-gray-700">{t("totals.totalTaxes")}</span>
              <span className="text-red-600">
                +{moneda || "$"}
                {impuestos.total_impuestos.toFixed(2)}
              </span>
            </div>
          )}

          {costoDelivery > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t("totals.deliveryCost")}</span>
              <span className="font-semibold text-orange-600">
                +{moneda || "$"}
                {costoDelivery.toFixed(2)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>{t("totals.total")}</span>
            <span className="text-green-600">
              {moneda || "$"}
              {precioTotal.toFixed(2)}
            </span>
          </div>

          {impuestos.total_impuestos > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Info className="h-3 w-3" />
              <span>{t("totals.taxesIncluded")}</span>
            </div>
          )}
        </div>

        <Button
          onClick={() =>
            ubicacionSeleccionada && handleCheckout(ubicacionSeleccionada)
          }
          disabled={isProcessing || !ubicacionSeleccionada}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {t("buttons.processing")}
            </>
          ) : (
            <>{t("buttons.checkout")}</>
          )}
        </Button>

        {isErrorAuth && (
          <div className="w-full max-w-md mx-auto animate-in fade-in duration-300 px-4 sm:px-0">
            <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start mb-3">
                    <div className="bg-red-100 rounded-full p-3">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-sm font-semibold text-red-800 mb-2">
                    {t("authentication.title")}
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {typeof isErrorAuth === "string"
                      ? isErrorAuth
                      : "Ha ocurrido un error al verificar tu sesión"}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <LogIn className="h-4 w-4 flex-shrink-0" />
                    <span>{t("buttons.login")}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 w-full rounded-md border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm transition-all hover:bg-red-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <UserPlus className="h-4 w-4 flex-shrink-0" />
                    <span>{t("buttons.register")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleContinueShopping}
          variant="outline"
          className="w-full"
          disabled={isProcessing}
        >
          {t("buttons.continueShopping")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumenPedido;
export type { UbicacionPedido };
