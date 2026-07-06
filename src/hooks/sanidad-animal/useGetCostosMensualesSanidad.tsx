import { obtenerCostosMensuales } from "@/api/sanidad-animal/accions/obtener-costos-mensuales";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCostosMensualesSanidad = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["costos-mensuales-sanidad", filters],
    queryFn: () => obtenerCostosMensuales(filters),
    retry: 0,
  });
};

export default useGetCostosMensualesSanidad;
