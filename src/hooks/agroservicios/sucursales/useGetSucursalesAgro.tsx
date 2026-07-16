import { obtenerSucursalesAgro } from "@/api/agroservicio/agro-sucursales/accions/obtener-sucursales-agro";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSucursalesAgro = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["agro-sucursales", filters],
    queryFn: () => obtenerSucursalesAgro(filters),
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetSucursalesAgro;
