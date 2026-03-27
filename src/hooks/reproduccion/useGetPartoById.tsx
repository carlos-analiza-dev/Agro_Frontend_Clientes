import { ObtenerPartoById } from "@/api/reproduccion/accions/partos/obtener-parto-id";
import { useQuery } from "@tanstack/react-query";

const useGetPartoById = (id: string) => {
  return useQuery({
    queryKey: ["parto-id", id],
    queryFn: () => ObtenerPartoById(id),
    enabled: !!id,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPartoById;
