import { obtenerSucursalByEmpleado } from "@/api/agroservicio/agro-sucursales/accions/obtener-sucursales-agro";
import { useQuery } from "@tanstack/react-query";

const useGetSucursalByEmpleado = () => {
  return useQuery({
    queryKey: ["sucursal-empleado"],
    queryFn: () => obtenerSucursalByEmpleado(),
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetSucursalByEmpleado;
