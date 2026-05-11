import { obtenerCultivoById } from "@/api/cultivos/accions/obtener-cultivos";
import { useQuery } from "@tanstack/react-query";

const useGetCultivoById = (id: string) => {
  return useQuery({
    queryKey: ["cultivo-id", id],
    queryFn: () => obtenerCultivoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCultivoById;
