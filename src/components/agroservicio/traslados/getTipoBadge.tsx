import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { TipoMovimientoInventario } from "@/interfaces/enums/movimientos-inventario/tipos_movimientos.enum";

interface Props {
  tipo: TipoMovimientoInventario;
}

export const TipoMovimientoBadge = ({ tipo }: Props) => {
  const t = useTranslations("tipoMovimientoBadge");

  switch (tipo) {
    case TipoMovimientoInventario.TRANSFERENCIA:
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">{t("transfer")}</Badge>
      );

    case TipoMovimientoInventario.ENTRADA:
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{t("entry")}</Badge>
      );

    case TipoMovimientoInventario.SALIDA:
      return <Badge className="bg-red-500 hover:bg-red-600">{t("exit")}</Badge>;

    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};
