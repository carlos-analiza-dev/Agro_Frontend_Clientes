import { Label } from "@/components/ui/label";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
      <div className="space-y-1">
        <Label className="font-bold">Subtotal</Label>
        <p className="text-lg font-semibold">
          {moneda} {subtotal.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Descuentos</Label>
        <p className="text-lg font-semibold text-red-500">
          {moneda} {totalDescuentos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Impuestos</Label>
        <p className="text-lg font-semibold">
          {moneda} {totalImpuestos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold text-blue-600">Total</Label>
        <p className="text-2xl font-bold text-blue-600">
          {moneda} {total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DetailsCompra;
