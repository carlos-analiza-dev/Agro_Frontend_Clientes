import { ObtenerFincasByPropietario } from "@/api/fincas/accions/get-fincas-by-propietario";
import { useQuery } from "@tanstack/react-query";

export const useFincasPropietarios = (userId: string, name?: string) => {
  return useQuery({
    queryKey: ["fincas-propietario", userId, name],
    queryFn: () => ObtenerFincasByPropietario(userId, name),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};
