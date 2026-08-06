import ObtenerInsumosDisponibles from "@/api/agroservicio/insumos/accions/obtener-insumos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetInsumosDisponibles = (propietarioId: string) => {
  return useQuery({
    queryKey: ["insumos-disponibles", propietarioId],
    queryFn: () => ObtenerInsumosDisponibles(propietarioId),
    enabled: !!propietarioId,
    retry: false,
  });
};

export default useGetInsumosDisponibles;
