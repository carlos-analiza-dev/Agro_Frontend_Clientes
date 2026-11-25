import { ResponseExistenciaProductosInterface } from "@/api/agroservicio/existencia_productos/interfaces/response-existencia-productos.interface";
import { Badge } from "@/components/ui/badge";
import { UseQueryResult } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  precio?: number;
  cantidadMin?: number;
  cantidadMax?: number;
}

interface Props {
  productoId: string;
  cantidad: number;
  productosYServicios: ProductoServicioUnificado[];
  mapaExistencias: { [key: string]: number };
  existenciasQueries: UseQueryResult<
    ResponseExistenciaProductosInterface[],
    Error
  >[];
}

const ExistenciaBadge = ({
  cantidad,
  productoId,
  mapaExistencias,
  existenciasQueries,
}: Props) => {
  const t = useTranslations("existenciaBadge");

  if (!productoId) return null;

  const existencia = mapaExistencias[productoId];
  const isLoading = existenciasQueries.some((query) => query.isLoading);
  const suficiente = existencia !== undefined && existencia >= cantidad;

  if (isLoading) {
    return (
      <Badge variant="outline" className="ml-2">
        <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent mr-1" />
        {t("loading")}
      </Badge>
    );
  }

  if (existencia === undefined) {
    return (
      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
        {t("noStock")}
      </Badge>
    );
  }

  return (
    <Badge variant={suficiente ? "default" : "destructive"} className="ml-2">
      {suficiente
        ? t("available", { quantity: existencia })
        : t("insufficient", { quantity: existencia })}
    </Badge>
  );
};

export default ExistenciaBadge;
