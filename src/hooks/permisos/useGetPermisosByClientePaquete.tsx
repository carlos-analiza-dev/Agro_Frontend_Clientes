import { ObtenerPermisosPaquete } from "@/api/permisos/accions/obtener-permisos-by-paquete";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByClientePaquete = (paqueteId: string) => {
  return useQuery({
    queryKey: ["permisos-cliente-paquete", paqueteId],
    queryFn: () => ObtenerPermisosPaquete(paqueteId),
    enabled: !!paqueteId,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPermisosByClientePaquete;
