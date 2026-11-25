import { Compra } from "@/api/agroservicio/compras_productos/interface/response-compras.interface";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import { useTranslations } from "next-intl";

interface Props {
  selectedCompra: Compra;
  moneda: string;
}

const InfoCompra = ({ selectedCompra, moneda }: Props) => {
  const t = useTranslations("comprasProductosPage.details.info");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold mb-2">{t("purchaseInformation")}</h3>

        <p>
          <span className="font-medium">{t("provider")}: </span>
          {selectedCompra.proveedor.nombre_legal}
        </p>

        <p>
          <span className="font-medium">{t("invoice")}: </span>
          {selectedCompra.numero_factura}
        </p>

        <p>
          <span className="font-medium">{t("identification")}: </span>
          {selectedCompra.proveedor.nit_rtn}
        </p>

        <p>
          <span className="font-medium">{t("nrc")}: </span>
          {selectedCompra.proveedor.nrc}
        </p>

        <p>
          <span className="font-medium">{t("branch")}: </span>
          {selectedCompra.sucursal.nombre}
        </p>

        <p>
          <span className="font-medium">{t("date")}: </span>
          {formatDateLocal(selectedCompra.fecha)}
        </p>

        <div className="flex items-center">
          <span className="font-medium">{t("paymentType")}: </span>
          <Badge variant="outline" className="ml-2 capitalize">
            {selectedCompra.tipo_pago}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">{t("totals")}</h3>

        <p>
          <span className="font-medium">{t("subtotal")}: </span>
          {formatCurrency(selectedCompra.subtotal, moneda)}
        </p>

        <p>
          <span className="font-medium">{t("discounts")}: </span>
          {formatCurrency(selectedCompra.descuentos, moneda)}
        </p>

        <p>
          <span className="font-medium">{t("taxes")}: </span>
          {formatCurrency(selectedCompra.impuestos, moneda)}
        </p>

        <p>
          <span className="font-medium text-lg">{t("total")}: </span>
          <span className="text-lg font-bold ml-2">
            {formatCurrency(selectedCompra.total, moneda)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default InfoCompra;
