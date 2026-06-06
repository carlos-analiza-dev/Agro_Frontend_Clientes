import { searchMarketPlace } from "@/api/market-animales/accions/search-markte";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSearchMarket = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["searc-market", filters],
    queryFn: () => searchMarketPlace(filters),
    enabled: !!filters,
    retry: 0,
  });
};

export default useGetSearchMarket;
