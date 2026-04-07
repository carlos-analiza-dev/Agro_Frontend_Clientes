import { ObtenerIngresosById } from "@/api/finanzas/ingresos/accions/obtener-ingreso-by-id";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerIngresoById = (id: string) => {
  return useQuery({
    queryKey: ["ingreso-id", id],
    queryFn: () => ObtenerIngresosById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetObtenerIngresoById;
