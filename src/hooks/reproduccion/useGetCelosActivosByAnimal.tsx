import { ObtenerCelosActivosByAnimales } from "@/api/reproduccion/accions/celos/obtener-celos-activos-by-animal";
import { useQuery } from "@tanstack/react-query";

const useGetCelosActivosByAnimal = (id: string) => {
  return useQuery({
    queryKey: ["celos-by-animal", id],
    queryFn: () => ObtenerCelosActivosByAnimales(id),
    enabled: !!id,
    retry: 0,
  });
};

export default useGetCelosActivosByAnimal;
