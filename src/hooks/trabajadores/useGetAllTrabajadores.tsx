import { obtenerAllTrabajadores } from "@/api/trabajadores/accions/obtener-all-trabajadores";
import { useQuery } from "@tanstack/react-query";

const useGetAllTrabajadores = () => {
  return useQuery({
    queryKey: ["all-trabajadores"],
    queryFn: () => obtenerAllTrabajadores(),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAllTrabajadores;
