import { obtenerEquipoById } from "@/api/equipos-maquinaria/accions/obtener-equipos";
import { useQuery } from "@tanstack/react-query";

const useGetEquipoMaquinariaById = (id: string) => {
  return useQuery({
    queryKey: ["equipo-maquinaria-id", id],
    queryFn: () => obtenerEquipoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetEquipoMaquinariaById;
