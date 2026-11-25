import { CrearFacturaAgroInterface } from "@/api/agroservicio/facturacion/interface/crear-factura-agro.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import React from "react";
import { FieldArrayWithId } from "react-hook-form";
import { useTranslations } from "next-intl";

interface Props {
  subTotal: number;
  fields: FieldArrayWithId<
    CrearFacturaAgroInterface & {
      cantidadAnimales?: number;
    },
    "detalles",
    "id"
  >[];
  totalGeneral: number;
  cargosExtra: number;
  simbolo: string;
}

const ResumenFactura = ({
  subTotal,
  cargosExtra,
  fields,
  totalGeneral,
  simbolo,
}: Props) => {
  const t = useTranslations("resumenFactura");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full">
              {t("subtotal")}
            </Badge>
            <p className="text-xl font-bold">
              {simbolo} {subTotal.toFixed(2)}
            </p>
          </div>
          {cargosExtra > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t("extraCharges")}</span>
              <span className="font-medium text-blue-600">
                + {simbolo} {cargosExtra.toFixed(2)}
              </span>
            </div>
          )}
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full">
              {t("items")}
            </Badge>
            <p className="text-xl font-bold">{fields.length}</p>
          </div>
          <div className="space-y-2">
            <Badge variant="default" className="w-full">
              {t("grandTotal")}
            </Badge>
            <p className="text-2xl font-bold text-green-600">
              {simbolo} {totalGeneral.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenFactura;
