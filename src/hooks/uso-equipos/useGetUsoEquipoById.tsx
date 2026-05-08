import { obtenerUsoEquipoById } from "@/api/uso-equipos/accions/obtener-uso-equipos";
import { useQuery } from "@tanstack/react-query";

const useGetUsoEquipoById = (id: string) => {
  return useQuery({
    queryKey: ["uso-equipo-id", id],
    queryFn: () => obtenerUsoEquipoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetUsoEquipoById;
