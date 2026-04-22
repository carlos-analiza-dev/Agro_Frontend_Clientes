import { obtenerJornadasTrabajadoresById } from "@/api/jornadas-trabajador/accions/obtener-jornadas-id";
import { useQuery } from "@tanstack/react-query";

const useGetJornadasTranajadoresById = (id: string) => {
  return useQuery({
    queryKey: ["jornadas-id", id],
    queryFn: () => obtenerJornadasTrabajadoresById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetJornadasTranajadoresById;
