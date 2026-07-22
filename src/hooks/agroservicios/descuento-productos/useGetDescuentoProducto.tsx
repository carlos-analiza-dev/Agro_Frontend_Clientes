import { ObtenerDescuentoProducto } from "@/api/agroservicio/descuentos_producto/accions/obtener-descuento-producto";
import { useQuery } from "@tanstack/react-query";
const useGetDescuentoProducto = (productoId: string) => {
  return useQuery({
    queryKey: ["descuento-producto", productoId],
    queryFn: () => ObtenerDescuentoProducto(productoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetDescuentoProducto;
