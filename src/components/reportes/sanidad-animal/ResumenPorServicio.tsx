"use client";

import { useTranslations } from "next-intl";
import { COLORS_SANIDAD } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";

interface Props {
  datosPorServicio: any[];
  moneda: string;
}

const ResumenPorServicio = ({ datosPorServicio, moneda }: Props) => {
  const t = useTranslations("resumenPorServicio");

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t("title")}</h4>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 font-medium text-sm">
          <div>{t("columns.service")}</div>
          <div className="text-right">{t("columns.quantity")}</div>
          <div className="text-right">{t("columns.total")}</div>
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          {datosPorServicio.map((servicio, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 p-3 border-t text-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS_SANIDAD[index % COLORS_SANIDAD.length],
                  }}
                />
                <span>{servicio.nombre}</span>
              </div>
              <div className="text-right">{servicio.cantidad}</div>
              <div className="text-right font-medium">
                {formatCurrency(servicio.total, moneda)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumenPorServicio;
