import { ObtenerEscalasProveedorAndProducto } from "@/api/agroservicio/escala-producto/accions/escalas-proveedor-producto";
import { useQuery } from "@tanstack/react-query";

const useGetEscalasProveedorAndProducto = (
  proveedorId: string,
  productoId: string,
) => {
  return useQuery({
    queryKey: ["escalas-proveedor-producto", proveedorId, productoId],
    queryFn: () => ObtenerEscalasProveedorAndProducto(proveedorId, productoId),
    retry: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!proveedorId && !!productoId,
  });
};

export default useGetEscalasProveedorAndProducto;
