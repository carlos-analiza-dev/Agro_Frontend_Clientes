import { obtenerFincasAsignadas } from "@/api/fincas-trabajador/accions/obtener-fincas-asignadas";
import { useQuery } from "@tanstack/react-query";

const useGetFincasByTrabajador = (trabajadorId: string) => {
  return useQuery({
    queryKey: ["fincas-trabajador", trabajadorId],
    queryFn: () => obtenerFincasAsignadas(trabajadorId),
    staleTime: 60 * 5 * 1000,
    retry: 0,
  });
};

export default useGetFincasByTrabajador;
