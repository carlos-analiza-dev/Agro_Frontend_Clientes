import { obtenerEquiposActivos } from "@/api/equipos-maquinaria/accions/obtener-equipos";
import { useQuery } from "@tanstack/react-query";

const useGetEquiposMaquinariaActivos = () => {
  return useQuery({
    queryKey: ["equipos-activos"],
    queryFn: () => obtenerEquiposActivos(),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetEquiposMaquinariaActivos;
