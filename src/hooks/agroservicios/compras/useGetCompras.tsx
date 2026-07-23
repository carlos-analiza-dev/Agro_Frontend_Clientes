import { ObtenerCompras } from "@/api/agroservicio/compras_productos/accions/obtener-compras-productos";
import { useQuery } from "@tanstack/react-query";

const useGetCompras = (
  propietarioId: string,
  limit: number = 10,
  offset: number,
  proveedor: string,
  sucursal: string,
  tipoPago: string,
) => {
  return useQuery({
    queryKey: [
      "compras-agro-productos",
      propietarioId,
      limit,
      offset,
      proveedor,
      sucursal,
      tipoPago,
    ],
    queryFn: () =>
      ObtenerCompras(
        propietarioId,
        limit,
        offset,
        proveedor,
        sucursal,
        tipoPago,
      ),
    enabled: !!propietarioId,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetCompras;
