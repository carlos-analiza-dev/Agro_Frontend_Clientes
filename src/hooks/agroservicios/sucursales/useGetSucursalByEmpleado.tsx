import { obtenerSucursalByEmpleado } from "@/api/agroservicio/agro-sucursales/accions/obtener-sucursales-agro";
import { useQuery } from "@tanstack/react-query";

const useGetSucursalByEmpleado = (empeladoId: string) => {
  return useQuery({
    queryKey: ["sucursal-empleado", empeladoId],
    queryFn: () => obtenerSucursalByEmpleado(empeladoId),
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetSucursalByEmpleado;
