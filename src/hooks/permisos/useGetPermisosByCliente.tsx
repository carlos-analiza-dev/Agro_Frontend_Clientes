import { ObtenerPermisosClienteId } from "@/api/permisos/accions/obtener-permisos-cliente";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByCliente = (cliendeId: string) => {
  return useQuery({
    queryKey: ["permisos-clienteId", cliendeId],
    queryFn: () => ObtenerPermisosClienteId(cliendeId),
    enabled: !!cliendeId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPermisosByCliente;
