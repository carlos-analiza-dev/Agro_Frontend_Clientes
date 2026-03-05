import { ObtenerGananciaMensualAnimal } from "@/api/dashboard/accions/obtenerGananciaMensualByAnimal";
import { useQuery } from "@tanstack/react-query";

const useGananciaMensual = (animalId: string, year: number) => {
  return useQuery({
    queryKey: ["ganancia-mensual", animalId, year],
    queryFn: () => ObtenerGananciaMensualAnimal(animalId, year),
    enabled: !!animalId && !!year,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGananciaMensual;
