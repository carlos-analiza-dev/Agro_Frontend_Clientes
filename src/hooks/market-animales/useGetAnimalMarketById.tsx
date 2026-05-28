import { obtenerAnimalMarketById } from "@/api/market-animales/accions/obtener-animal-market-id";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalMarketById = (id: string) => {
  return useQuery({
    queryKey: ["animal-market-id", id],
    queryFn: () => obtenerAnimalMarketById(id),
    enabled: !!id,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAnimalMarketById;
