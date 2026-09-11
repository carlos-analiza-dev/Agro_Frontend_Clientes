import { obtenerAnimalMarketByIdPublic } from "@/api/market-animales/accions/obtener-animal-market-id";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalMarketByIdPublic = (id: string) => {
  return useQuery({
    queryKey: ["publicaciones-id", id],
    queryFn: () => obtenerAnimalMarketByIdPublic(id),
    enabled: !!id,
    retry: 0,
  });
};

export default useGetAnimalMarketByIdPublic;
