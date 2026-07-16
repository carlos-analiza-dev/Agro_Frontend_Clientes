import { obtenerEmpleadosAgro } from "@/api/agroservicio/empleados/accions/obtener-empleados";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetEmpleadosAgro = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["empleados-agro", filtros],
    queryFn: () => obtenerEmpleadosAgro(filtros),
    retry: 1,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetEmpleadosAgro;
