import {
  LotesFiltersInterafce,
  obtenerLotesSucursal,
} from "@/api/agroservicio/lotes/accions/obtener-lotes-sucursal";
import { useQuery } from "@tanstack/react-query";

const useGetLotesBySucursal = (
  sucursalId: string,
  propietarioId: string,
  filters?: LotesFiltersInterafce,
) => {
  return useQuery({
    queryKey: ["lotes-sucursal", sucursalId, propietarioId, filters],
    queryFn: () => obtenerLotesSucursal(sucursalId, propietarioId, filters),
    retry: 0,
  });
};

export default useGetLotesBySucursal;
