import { obtenerRoleslesAgro } from "@/api/agroservicio/roles-agro/accions/obtener-roles-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetRolesAgro = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["roles-agro", filters],
    queryFn: () => obtenerRoleslesAgro(filters),
    retry: 1,
  });
};

export default useGetRolesAgro;
