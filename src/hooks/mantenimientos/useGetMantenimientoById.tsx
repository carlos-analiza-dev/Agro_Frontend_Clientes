import { obtenerMantenimientoById } from "@/api/mantenimientos/accions/obtener-mantenimientos";
import { useQuery } from "@tanstack/react-query";

const useGetMantenimientoById = (id: string) => {
  return useQuery({
    queryKey: ["mantenimiento-id", id],
    queryFn: () => obtenerMantenimientoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMantenimientoById;
