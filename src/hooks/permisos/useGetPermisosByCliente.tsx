import { ObtenerPermisosClienteId } from "@/api/permisos/accions/obtener-permisos-cliente";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByCliente = (cliendeId: string) => {
  return useQuery({
    queryKey: ["permisos-clienteId", cliendeId],
    queryFn: () => ObtenerPermisosClienteId(cliendeId),
    retry: 0,
  });
};

export default useGetPermisosByCliente;
