import { ObtenerPesoPorRaza } from "@/api/peso-promedio-animal/accions/obtener-peso-promedio-by-raza";
import { useQuery } from "@tanstack/react-query";

const useGetPesosByRaza = () => {
  return useQuery({
    queryKey: ["pesos-by-razas"],
    queryFn: () => ObtenerPesoPorRaza(),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetPesosByRaza;
