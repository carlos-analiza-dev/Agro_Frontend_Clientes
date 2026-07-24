import { obtenerAuditoriaProveedores } from "@/api/agroservicio/auditoria/accions/obtener-auditoria-proveedores";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAuditoriaProveedores = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["auditoria-proveedores", filtros],
    queryFn: () => obtenerAuditoriaProveedores(filtros),
    retry: 1,
  });
};

export default useGetAuditoriaProveedores;
