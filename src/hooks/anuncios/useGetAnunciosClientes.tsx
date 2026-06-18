import { obtenerAnuncios } from "@/api/anuncios/accions/obtener-anuncios";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAnunciosClientes = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["anuncios", filters],
    queryFn: () => obtenerAnuncios(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAnunciosClientes;
