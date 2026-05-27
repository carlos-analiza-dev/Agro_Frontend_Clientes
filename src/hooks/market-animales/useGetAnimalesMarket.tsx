import { obtenerAnimalesMarket } from "@/api/market-animales/accions/obtener-animales-market";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalesMarket = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["animales-market", filters],
    queryFn: () => obtenerAnimalesMarket(filters),
    retry: 0,
  });
};

export default useGetAnimalesMarket;
