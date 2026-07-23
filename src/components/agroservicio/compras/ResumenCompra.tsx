import React from "react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3 bg-green-50 rounded-lg text-sm">
      <div>
        <span className="font-semibold">Cant. Pagada: </span>
        {cantidadPagada}
      </div>
      <div>
        <span className="font-semibold">Bonificación: </span>
        {bonificacion}
      </div>
      <div>
        <span className="font-semibold">Subtotal: </span>
        {moneda} {subtotalProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Descuento: </span>
        {moneda} {descuentoProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Impuesto: </span>
        {moneda} {impuestoProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Total Producto: </span>
        {moneda} {totalProducto.toFixed(2)}
      </div>
    </div>
  );
};

export default ResumenCompra;
