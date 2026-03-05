import { ObtenerGananciaMensualByFinca } from "@/api/dashboard/accions/obtenerGananciaMensualByFinca";
import { useQuery } from "@tanstack/react-query";

const useGetGananciaPesoByFinca = (fincaId: string, year: number) => {
  return useQuery({
    queryKey: ["ganancia-mensual-fincas", fincaId, year],
    queryFn: () => ObtenerGananciaMensualByFinca(fincaId, year),
    enabled: !!fincaId && !!year,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetGananciaPesoByFinca;
