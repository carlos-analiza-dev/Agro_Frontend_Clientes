import { ObtenerConfiguracionesTrabajadoresById } from "@/api/configuraciones-trabajadores/accions/obtener-configuraciones-id";
import { useQuery } from "@tanstack/react-query";

const useGetConfigTrabajadoresById = (id: string) => {
  return useQuery({
    queryKey: ["config-trabajadores-id", id],
    queryFn: () => ObtenerConfiguracionesTrabajadoresById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetConfigTrabajadoresById;
