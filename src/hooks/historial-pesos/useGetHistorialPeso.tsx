import { ObtenerHistorialPesos } from "@/api/peso-promedio-animal/accions/obtener-historial-pesos-animal";
import { useQuery } from "@tanstack/react-query";

const useGetHistorialPeso = (id: string) => {
  return useQuery({
    queryKey: ["historial-peso", id],
    queryFn: () => ObtenerHistorialPesos(id),
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetHistorialPeso;
