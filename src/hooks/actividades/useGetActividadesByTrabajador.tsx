import { obtenerActividadesByTrabajador } from "@/api/actividades/accions/obtener-actividades-trabajador";
import { useQuery } from "@tanstack/react-query";

const useGetActividadesByTrabajador = (id: string, fecha?: string) => {
  return useQuery({
    queryKey: ["actividades-trabajador", id, fecha],
    queryFn: () => obtenerActividadesByTrabajador(id, fecha),
    enabled: !!id,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetActividadesByTrabajador;
