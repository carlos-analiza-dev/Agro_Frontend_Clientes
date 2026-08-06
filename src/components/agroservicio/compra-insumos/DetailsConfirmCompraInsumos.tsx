import { InsumoAgroCompra } from "@/api/agroservicio/compras_insumos/interfaces/insumos_compra.interface";
import { AgroInsumo } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import { ProveedoreAgro } from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";

interface Props {
  proveedorSeleccionado: ProveedoreAgro | undefined;
  tipoPagoSeleccionado:
    | {
        id: number;
        label: string;
        value: string;
      }
    | undefined;
  insumosWatch: InsumoAgroCompra[];
  insumos: AgroInsumo[];
  moneda: string;
  subtotal: number;
  totalDescuentos: number;
  totalImpuestos: number;
  total: number;
}

const DetailsConfirmCompraInsumos = ({
  insumos,
  insumosWatch,
  proveedorSeleccionado,
  subtotal,
  tipoPagoSeleccionado,
  total,
  totalDescuentos,
  totalImpuestos,
  moneda,
}: Props) => {
  return (
    <div className="space-y-4">
      <p className="text-center text-lg">
        ¿Estás seguro de ejecutar esta compra?
      </p>

      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-semibold">Proveedor:</h3>
          <p>{proveedorSeleccionado?.nombre_legal || "No seleccionado"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Tipo de Pago:</h3>
          <p>{tipoPagoSeleccionado?.label || "No seleccionado"}</p>
        </div>
      </div>

      <div className="border rounded-lg">
        <h3 className="font-semibold p-3 bg-gray-100">Insumos en la compra:</h3>
        <div className="max-h-60 overflow-y-auto">
          {insumosWatch?.map((insumo, index) => {
            const insumoInfo = insumos.find((p) => p.id === insumo.insumoId);
            if (!insumoInfo) return null;

            const subtotalinsumo = insumo.cantidad * insumo.costoUnitario;
            const descuentoinsumo = subtotalinsumo * (insumo.descuento / 100);
            const impuestoinsumo =
              (subtotalinsumo - descuentoinsumo) * (insumo.impuesto / 100);

            return (
              <div key={index} className="p-3 border-b grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <p className="font-medium">{insumoInfo.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {insumo.cantidad}
                  </p>
                  <p className="text-sm text-gray-500">
                    Bonificacion: {insumo.bonificacion}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    Precio: {moneda} {insumo.costoUnitario.toFixed(2)}
                  </p>
                  <p className="text-sm">Desc: {insumo.descuento}%</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {moneda} {subtotalinsumo.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Imp: {moneda} {impuestoinsumo.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal:</span>
            <span>
              {moneda} {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-red-500">
            <span className="font-semibold">Descuentos:</span>
            <span>
              -{moneda} {totalDescuentos.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Impuestos:</span>
            <span>
              {moneda} {totalImpuestos.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center border-l pl-4">
          <span className="text-sm text-gray-500">TOTAL</span>
          <span className="text-2xl font-bold text-blue-600">
            {moneda} {total.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Una vez ejecutes la compra, esta será procesada y no podrá ser
        revertida.
      </p>
    </div>
  );
};

export default DetailsConfirmCompraInsumos;
