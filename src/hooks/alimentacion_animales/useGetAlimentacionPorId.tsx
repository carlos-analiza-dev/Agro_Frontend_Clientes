import { ObtenerAlimentacionAnimales } from "@/api/alimentacion_animal/accions/obtener-alimentacion-animales";
import { ObtenerAlimentacionAnimalesByid } from "@/api/alimentacion_animal/accions/obtener-alimentacion-animales-id";
import { useQuery } from "@tanstack/react-query";

const useGetAlimentacionPorId = (id: string) => {
  return useQuery({
    queryKey: ["alimentacion-animales", id],
    queryFn: () => ObtenerAlimentacionAnimalesByid(id),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetAlimentacionPorId;
