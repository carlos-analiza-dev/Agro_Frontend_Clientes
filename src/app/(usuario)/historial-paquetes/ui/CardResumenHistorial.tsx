"use client";

import { useTranslations } from "next-intl";
import { PaqueteInterface } from "@/api/paquetes/interface/paquete.interface";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  historial: PaqueteInterface[];
  planActivo: PaqueteInterface | undefined;
}

const CardResumenHistorial = ({ historial, planActivo }: Props) => {
  const t = useTranslations("cardResumenHistorial");

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {historial.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t("contractedPlans")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {planActivo ? 1 : 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">{t("activePlan")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {
                historial.filter((h: any) => h.paquete.tipo === "PREMIUM")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t("premiumPlansPurchased")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardResumenHistorial;
