import { obtenerPermisoByPropietario } from "@/api/permisos/accions/obtener-permisos";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosPropietario = () => {
  return useQuery({
    queryKey: ["permisos-propietario"],
    queryFn: obtenerPermisoByPropietario,
    retry: 0,
  });
};

export default useGetPermisosPropietario;
