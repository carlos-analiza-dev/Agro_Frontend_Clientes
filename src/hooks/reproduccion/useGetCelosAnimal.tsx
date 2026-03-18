import { ObtenerCelosAnimales } from "@/api/reproduccion/accions/celos/obtener-celos";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCelosAnimal = (filtros: FiltrosCelos) => {
  return useQuery({
    queryKey: ["celos-animal", filtros],
    queryFn: () => ObtenerCelosAnimales(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCelosAnimal;
