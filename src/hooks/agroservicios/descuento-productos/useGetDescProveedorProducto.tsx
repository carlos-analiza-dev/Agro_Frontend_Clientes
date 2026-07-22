import { ObtenerDescuentoProveedorAndProducto } from "@/api/agroservicio/descuentos_producto/accions/descuentos-proveedor-producto";
import { useQuery } from "@tanstack/react-query";

const useGetDescProveedorProducto = (
  proveedorId: string,
  productoId: string,
) => {
  return useQuery({
    queryKey: ["descuento-proveedor-producto", proveedorId, productoId],
    queryFn: () =>
      ObtenerDescuentoProveedorAndProducto(proveedorId, productoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!proveedorId && !!productoId,
  });
};

export default useGetDescProveedorProducto;
