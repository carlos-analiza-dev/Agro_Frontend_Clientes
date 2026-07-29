import { obtenerImpuestosAgroProductos } from "@/api/agroservicio/impuestos/accions/obtener-impuestos-agro-productos";
import { useQuery } from "@tanstack/react-query";

const useGetImpuestosByAgroservicio = (propietarioId: string) => {
  return useQuery({
    queryKey: ["impuestos-agro", propietarioId],
    queryFn: () => obtenerImpuestosAgroProductos(propietarioId),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetImpuestosByAgroservicio;
