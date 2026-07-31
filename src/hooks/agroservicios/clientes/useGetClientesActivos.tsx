import { obtenerClientesAgroActivos } from "@/api/agroservicio/clientes/accions/obtener-clientes-agro";
import { useQuery } from "@tanstack/react-query";

const useGetClientesActivos = (propietarioId: string) => {
  return useQuery({
    queryKey: ["clientes-activos", propietarioId],
    queryFn: () => obtenerClientesAgroActivos(propietarioId),
    retry: 0,
    enabled: !!propietarioId,
  });
};

export default useGetClientesActivos;
