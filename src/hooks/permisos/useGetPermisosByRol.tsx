import { obtenerPermisosByRol } from "@/api/agroservicio/permisos/accions/obtener-permisos-agro";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByRol = (rolId: string) => {
  return useQuery({
    queryKey: ["permisos-empleados-rol", rolId],
    queryFn: () => obtenerPermisosByRol(rolId),
    enabled: !!rolId,
    retry: 0,
  });
};

export default useGetPermisosByRol;
