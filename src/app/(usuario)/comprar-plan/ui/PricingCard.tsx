import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export const PricingCard = ({
  paquete,
  precio,
  tipoPago,
  icon,
  badgeColor,
  cardColor,
  index,
  esPlanActual,
  esFree,
  ahorro,
  onComprar,
}: any) => {
  const t = useTranslations("pricingCard");

  const montoMostrar = tipoPago === "mensual" ? precio.mensual : precio.anual;
  const precioOriginal =
    tipoPago === "anual" && precio.mensual > 0 ? precio.mensual * 12 : null;

  return (
    <div
      className={`animate-in fade-in zoom-in duration-500 delay-${index * 100}`}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 ${cardColor}`}
      >
        {esPlanActual && (
          <div className="absolute top-0 right-0">
            <div className="bg-green-500 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
              {t("badges.currentPlan")}
            </div>
          </div>
        )}

        {!esFree && !esPlanActual && (
          <div className="absolute top-0 left-0">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-br-lg text-xs font-semibold">
              {t("badges.recommended")}
            </div>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${cardColor}`}>{icon}</div>
          </div>
          <div className="flex justify-center mb-2">
            <Badge className={badgeColor}>{paquete.tipo}</Badge>
          </div>
          <CardTitle className="text-2xl font-bold">{paquete.nombre}</CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            {precio.paisNombre}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">{precio.moneda}</span>
              <span className="text-4xl font-bold">
                {montoMostrar.toFixed(2)}
              </span>
              <span className="text-gray-500">
                /
                {tipoPago === "mensual"
                  ? t("billing.month")
                  : t("billing.year")}
              </span>
            </div>
            {precioOriginal && montoMostrar < precioOriginal && (
              <p className="text-sm text-green-600 mt-2">
                <span className="line-through text-gray-400">
                  {precio.moneda}
                  {precioOriginal.toFixed(2)}
                </span>
                <span className="ml-2 font-semibold">
                  {t("pricing.save", { percentage: ahorro })}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">
              {t("features.title")}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t("features.farms", { count: paquete.maxFincas })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>
                  {t("features.animals", { count: paquete.maxAnimales })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>
                  {t("features.workers", { count: paquete.maxTrabajadores })}
                </span>
              </div>
              {paquete && paquete.ecommerce && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t("features.marketplace")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onComprar}
            className={`w-full ${
              esPlanActual
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
            size="lg"
          >
            {esPlanActual
              ? t("buttons.renew")
              : esFree
                ? t("buttons.startFree")
                : t("buttons.subscribe")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
