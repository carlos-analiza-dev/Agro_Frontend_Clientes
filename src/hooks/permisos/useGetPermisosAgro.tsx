import { obtenerPermisosAgro } from "@/api/agroservicio/permisos/accions/obtener-permisos-agro";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosAgro = () => {
  return useQuery({
    queryKey: ["permisos-agro"],
    queryFn: obtenerPermisosAgro,
    retry: 1,
  });
};

export default useGetPermisosAgro;
