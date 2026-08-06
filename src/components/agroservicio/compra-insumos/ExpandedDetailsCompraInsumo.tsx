import { CompraAgroInsumo } from "@/api/agroservicio/compras_insumos/interfaces/response-compras-insumos.interface";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Building2, Receipt, User } from "lucide-react";

interface Props {
  compra: CompraAgroInsumo;
  moneda: string;
}

const ExpandedDetailsCompraInsumo = ({ compra, moneda }: Props) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            Agroservicio
          </p>
          <p className="font-medium">
            {compra.agroservicio?.nombre_agroservicio || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-4 w-4" />
            Proveedor
          </p>
          <p className="font-medium">
            {compra.proveedor?.nombre_legal || "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            NIT: {compra.proveedor?.nit_rtn || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            Factura
          </p>
          <p className="font-medium">{compra.numero_factura}</p>
          <p className="text-sm text-muted-foreground">
            {formatDateOnly(compra.created_at)}
          </p>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                Insumo
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Cantidad
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Bonificación
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Costo Unit.
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Descuentos
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Impuestos
              </th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {compra.detalles?.map((detalle) => (
              <tr key={detalle.id} className="border-b last:border-0">
                <td className="py-2 px-3">
                  {detalle.insumo?.nombre || "N/A"}
                  <span className="block text-xs text-muted-foreground">
                    {detalle.insumo?.codigo || ""}
                  </span>
                </td>
                <td className="text-right py-2 px-3">{detalle.cantidad}</td>
                <td className="text-right py-2 px-3">{detalle.bonificacion}</td>
                <td className="text-right py-2 px-3">
                  {formatCurrency(detalle.costo_por_unidad, moneda)}
                </td>
                <td className="text-right py-2 px-3 text-red-600">
                  {formatCurrency(detalle.descuentos, moneda)}
                </td>
                <td className="text-right py-2 px-3 text-blue-600">
                  {formatCurrency(detalle.impuestos, moneda)}
                </td>
                <td className="text-right py-2 px-3 font-medium">
                  {formatCurrency(detalle.monto_total, moneda)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/50">
            <tr>
              <td colSpan={4} className="py-2 px-3 text-right font-medium">
                Totales
              </td>
              <td className="text-right py-2 px-3 font-medium text-red-600">
                {formatCurrency(compra.descuentos, moneda)}
              </td>
              <td className="text-right py-2 px-3 font-medium text-blue-600">
                {formatCurrency(compra.impuestos, moneda)}
              </td>
              <td className="text-right py-2 px-3 font-bold text-green-600">
                {formatCurrency(compra.total, moneda)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpandedDetailsCompraInsumo;
