"use client";

import { useTranslations } from "next-intl";

interface Props {
  moneda: string;
  descuentoProducto: number;
  subtotalProducto: number;
  bonificacion: number;
  cantidadPagada: number;
  impuestoProducto: number;
  totalProducto: number;
}

const ResumenCompra = ({
  descuentoProducto,
  cantidadPagada,
  subtotalProducto,
  bonificacion,
  moneda,
  impuestoProducto,
  totalProducto,
}: Props) => {
  const t = useTranslations("comprasProductosPage.summary");

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3 bg-green-50 rounded-lg text-sm">
      <div>
        <span className="font-semibold">{t("paidQuantity")}: </span>
        {cantidadPagada}
      </div>

      <div>
        <span className="font-semibold">{t("bonus")}: </span>
        {bonificacion}
      </div>

      <div>
        <span className="font-semibold">{t("subtotal")}: </span>
        {moneda} {subtotalProducto.toFixed(2)}
      </div>

      <div>
        <span className="font-semibold">{t("discount")}: </span>
        {moneda} {descuentoProducto.toFixed(2)}
      </div>

      <div>
        <span className="font-semibold">{t("tax")}: </span>
        {moneda} {impuestoProducto.toFixed(2)}
      </div>

      <div>
        <span className="font-semibold">{t("productTotal")}: </span>
        {moneda} {totalProducto.toFixed(2)}
      </div>
    </div>
  );
};

export default ResumenCompra;
