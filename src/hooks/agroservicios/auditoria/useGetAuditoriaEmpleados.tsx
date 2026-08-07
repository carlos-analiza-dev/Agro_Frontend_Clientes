import { obtenerAuditoriaEmpleados } from "@/api/agroservicio/auditoria/accions/obtener-auditoria-empleados";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAuditoriaEmpleados = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["auditoria-empleados", filtros],
    queryFn: () => obtenerAuditoriaEmpleados(filtros),
    retry: 1,
  });
};

export default useGetAuditoriaEmpleados;
