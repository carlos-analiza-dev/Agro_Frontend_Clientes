import { MovimientosInvFilters } from "@/api/agroservicio/lotes/accions/obtener-lotes-sucursal";
import { obtenerMovimientosInventario } from "@/api/agroservicio/movimientos-inventario/accions/obtener-movimientos-inventario";
import { useQuery } from "@tanstack/react-query";

const useGetMovimientosInventario = (
  propietarioId: string,
  filters?: MovimientosInvFilters,
) => {
  return useQuery({
    queryKey: ["movimientos-inventario", propietarioId, filters],
    queryFn: () => obtenerMovimientosInventario(propietarioId, filters),
    retry: 1,
    enabled: !!propietarioId,
  });
};

export default useGetMovimientosInventario;
