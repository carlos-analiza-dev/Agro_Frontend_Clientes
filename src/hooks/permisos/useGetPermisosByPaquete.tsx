import { ObtenerPermisosPaqueteId } from "@/api/permisos/accions/obtener-permisos-by-paquete";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByPaquete = (paqueteId: string) => {
  return useQuery({
    queryKey: ["permisos-paquete", paqueteId],
    queryFn: () => ObtenerPermisosPaqueteId(paqueteId),
    enabled: !!paqueteId,
    retry: 0,
  });
};

export default useGetPermisosByPaquete;
