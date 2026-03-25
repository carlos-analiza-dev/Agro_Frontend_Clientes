import { ObtenerServiciosReproductivoById } from "@/api/reproduccion/accions/servicios/obtener-servicio-by-id";
import { useQuery } from "@tanstack/react-query";

const useGetServicioById = (id: string) => {
  return useQuery({
    queryKey: ["servicio-reproductivo-id", id],
    queryFn: () => ObtenerServiciosReproductivoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetServicioById;
