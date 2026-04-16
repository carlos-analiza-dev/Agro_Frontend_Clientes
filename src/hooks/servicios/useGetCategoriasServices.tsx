import { ObtenerCategoriasServices } from "@/api/servicios/accions/obtener-servicios-categorias";
import { useQuery } from "@tanstack/react-query";

const useGetCategoriasServices = (
  paisId: string,
  limit: number,
  offset: number,
) => {
  return useQuery({
    queryKey: ["categorias-servicios", paisId, limit, offset],
    queryFn: () => ObtenerCategoriasServices(paisId, limit, offset),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCategoriasServices;
