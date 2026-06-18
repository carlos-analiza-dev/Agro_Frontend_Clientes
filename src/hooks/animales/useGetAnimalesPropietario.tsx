import { ObtenerAnimales } from "@/api/animales/accions/get-animales-bypropietario";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalesPropietario = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["animales-propietario", filters],
    queryFn: () => ObtenerAnimales(filters),

    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAnimalesPropietario;
