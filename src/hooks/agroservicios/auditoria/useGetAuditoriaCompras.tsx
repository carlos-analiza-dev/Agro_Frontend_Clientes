import { obtenerAuditoriaCompra } from "@/api/agroservicio/auditoria/accions/obtener-auditoria-compra";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAuditoriaCompras = (filtros?: PaginationInterface) => {
  return useQuery({
    queryKey: ["auditoria-compras", filtros],
    queryFn: () => obtenerAuditoriaCompra(filtros),
    retry: 1,
  });
};

export default useGetAuditoriaCompras;
