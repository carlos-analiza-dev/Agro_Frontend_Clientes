import { ObtenerExistenciaProductoBySucursal } from "@/api/productos/accions/obtener-existencia-producto-sucursal";
import { useQuery } from "@tanstack/react-query";

const useGetExistenciaProductoBySucursal = (
  productoId: string,
  sucursalId: string,
) => {
  return useQuery({
    queryKey: ["existencia-producto-sucursal", productoId, sucursalId],
    queryFn: () => ObtenerExistenciaProductoBySucursal(productoId, sucursalId),
    retry: false,
  });
};

export default useGetExistenciaProductoBySucursal;
