import { ObtenerAlimentacionAnimales } from "@/api/alimentacion_animal/accions/obtener-alimentacion-animales";
import { useQuery } from "@tanstack/react-query";

const useGetAlimentacionAnimales = () => {
  return useQuery({
    queryKey: ["alimentacion-animales"],
    queryFn: ObtenerAlimentacionAnimales,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetAlimentacionAnimales;
