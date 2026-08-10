import { obtenerPermisosAgro } from "@/api/agroservicio/permisos/accions/obtener-permisos-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosAgro = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["permisos-agro", filters],
    queryFn: () => obtenerPermisosAgro(filters),
    retry: 1,
  });
};

export default useGetPermisosAgro;
