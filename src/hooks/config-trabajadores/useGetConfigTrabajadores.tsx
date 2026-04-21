import { ObtenerConfiguracionesTrabajadores } from "@/api/configuraciones-trabajadores/accions/obtener-configuraciones";
import { useQuery } from "@tanstack/react-query";

const useGetConfigTrabajadores = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["config-trabajadores", limit, offset],
    queryFn: () => ObtenerConfiguracionesTrabajadores(limit, offset),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetConfigTrabajadores;
