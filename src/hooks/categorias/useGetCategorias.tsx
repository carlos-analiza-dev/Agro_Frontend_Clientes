import { ObtenerCategorias } from "@/api/categorias/accions/obtener-categorias";
import { useQuery } from "@tanstack/react-query";

const useGetCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: () => ObtenerCategorias(),
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetCategorias;
