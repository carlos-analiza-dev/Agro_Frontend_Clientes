import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ProductosMasVendidosInterface } from "../interface/response-productos-vendidos-agro.interface";

export const obtenerMetricasProductosMasVendidos = async (
  filters?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboards/metricas-agro/productos`;

  const response = await veterinariaAPI.get<ProductosMasVendidosInterface[]>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
