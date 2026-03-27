import { ObtenerServiciosReproductivoByHembraId } from "@/api/reproduccion/accions/servicios/obtener-servicio-hembra";
import { useQuery } from "@tanstack/react-query";

const useGetServicioByHembraId = (id: string) => {
  return useQuery({
    queryKey: ["servicio-reproductivo-hembra-id", id],
    queryFn: () => ObtenerServiciosReproductivoByHembraId(id),
    enabled: !!id && id !== "",
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetServicioByHembraId;
