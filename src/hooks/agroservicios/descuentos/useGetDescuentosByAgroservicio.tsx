import { obtenerDescuentosAgro } from "@/api/agroservicio/descuentos/accions/obtener-descuentos-agro";
import { useQuery } from "@tanstack/react-query";

const useGetDescuentosByAgroservicio = (propietarioId: string) => {
  return useQuery({
    queryKey: ["descuentos-agro", propietarioId],
    queryFn: () => obtenerDescuentosAgro(propietarioId),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetDescuentosByAgroservicio;
