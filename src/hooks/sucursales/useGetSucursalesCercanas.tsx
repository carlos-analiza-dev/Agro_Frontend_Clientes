import { ObtenerSucursalesCercanas } from "@/api/sucursales/accions/obtener-sucursales-cercanas";
import { useQuery } from "@tanstack/react-query";

const useGetSucursalesCercanas = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ["sucursales-cercanas", lat, lon],

    queryFn: () => ObtenerSucursalesCercanas(lat!, lon!),

    enabled: lat !== undefined && lon !== undefined,

    retry: false,

    staleTime: 1000 * 60 * 5,
  });
};

export default useGetSucursalesCercanas;
