import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface Props {
  moneda: string;
  subtotal: number;
  totalDescuentos: number;
  totalImpuestos: number;
  total: number;
}

const DetailsCompra = ({
  subtotal,
  total,
  totalDescuentos,
  totalImpuestos,
  moneda,
}: Props) => {
  const t = useTranslations("comprasProductosPage.totals");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
      <div className="space-y-1">
        <Label className="font-bold">{t("subtotal")}</Label>
        <p className="text-lg font-semibold">
          {moneda} {subtotal.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("discounts")}</Label>
        <p className="text-lg font-semibold text-red-500">
          {moneda} {totalDescuentos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("taxes")}</Label>
        <p className="text-lg font-semibold">
          {moneda} {totalImpuestos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold text-blue-600">{t("total")}</Label>
        <p className="text-2xl font-bold text-blue-600">
          {moneda} {total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DetailsCompra;
