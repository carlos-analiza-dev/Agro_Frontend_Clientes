import { ProductoCompra } from "@/api/agroservicio/compras_productos/interface/productos_compra.interface";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
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
  productosWatch: ProductoCompra[];
  productos: AgroProducto[];
  moneda: string;
  subtotal: number;
  totalDescuentos: number;
  totalImpuestos: number;
  total: number;
}

const DetailsConfirmCompra = ({
  proveedorSeleccionado,
  tipoPagoSeleccionado,
  productosWatch,
  productos,
  moneda,
  subtotal,
  totalDescuentos,
  totalImpuestos,
  total,
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
        <h3 className="font-semibold p-3 bg-gray-100">
          Productos en la compra:
        </h3>
        <div className="max-h-60 overflow-y-auto">
          {productosWatch?.map((producto, index) => {
            const productoInfo = productos.find(
              (p) => p.id === producto.productoId,
            );
            if (!productoInfo) return null;

            const subtotalProducto = producto.cantidad * producto.costoUnitario;
            const descuentoProducto =
              subtotalProducto * (producto.descuento / 100);
            const impuestoProducto =
              (subtotalProducto - descuentoProducto) *
              (producto.impuesto / 100);

            return (
              <div key={index} className="p-3 border-b grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <p className="font-medium">{productoInfo.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {producto.cantidad}
                  </p>
                  <p className="text-sm text-gray-500">
                    Bonificacion: {producto.bonificacion}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    Precio: {moneda} {producto.costoUnitario.toFixed(2)}
                  </p>
                  <p className="text-sm">Desc: {producto.descuento}%</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {moneda} {subtotalProducto.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Imp: {moneda} {impuestoProducto.toFixed(2)}
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

export default DetailsConfirmCompra;
