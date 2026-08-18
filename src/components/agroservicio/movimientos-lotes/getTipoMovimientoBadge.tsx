import { TipoMovimiento } from "@/api/agroservicio/movimientos-lotes/interface/response-movimientos-lotes.interface";
import { Badge } from "@/components/ui/badge";

const getTipoMovimientoBadge = (tipo: TipoMovimiento) => {
  switch (tipo) {
    case TipoMovimiento.DEVOLUCION:
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
        >
          Devolución
        </Badge>
      );
    case TipoMovimiento.SALIDA:
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
        >
          Salida
        </Badge>
      );
    case TipoMovimiento.AJUSTE:
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
        >
          Ajuste
        </Badge>
      );
    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};

export default getTipoMovimientoBadge;
