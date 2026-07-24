import { obtenerAuditoriaProductos } from "@/api/agroservicio/auditoria/accions/obtener-auditoria-productos";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAuditoriaProductos = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["auditoria-productos", filtros],
    queryFn: () => obtenerAuditoriaProductos(filtros),
    retry: 1,
  });
};

export default useGetAuditoriaProductos;
