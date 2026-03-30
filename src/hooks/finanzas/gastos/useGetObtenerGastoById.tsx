import { ObtenerGastoById } from "@/api/finanzas/gastos/accions/obtener-gasto-id";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerGastoById = (id: string) => {
  return useQuery({
    queryKey: ["gasto-id", id],
    queryFn: () => ObtenerGastoById(id),
    retry: 0,
  });
};

export default useGetObtenerGastoById;
