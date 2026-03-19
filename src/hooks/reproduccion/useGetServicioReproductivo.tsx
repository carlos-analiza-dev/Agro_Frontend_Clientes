import { ObtenerServiciosReproductivos } from "@/api/reproduccion/accions/servicios/obtener-servicios-reproductivos";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";
import { useQuery } from "@tanstack/react-query";

const useGetServicioReproductivo = (filtros?: FiltrosServicios) => {
  return useQuery({
    queryKey: ["servicios-reproductivos", filtros],
    queryFn: () => ObtenerServiciosReproductivos(filtros),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};
export default useGetServicioReproductivo;
