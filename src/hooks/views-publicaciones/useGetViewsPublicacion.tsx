import { obtenerViesPublicacion } from "@/api/view-publicaciones/acciones/obtener-views-publicacion";
import { useQuery } from "@tanstack/react-query";

const useGetViewsPublicacion = (publicacionId: string) => {
  return useQuery({
    queryKey: ["views", publicacionId],
    queryFn: () => obtenerViesPublicacion(publicacionId),
    retry: 0,
    staleTime: 1000 * 60,
  });
};

export default useGetViewsPublicacion;
