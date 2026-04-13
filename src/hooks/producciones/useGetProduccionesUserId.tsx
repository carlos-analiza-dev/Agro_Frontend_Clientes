import { obtenerProduccionesByUserId } from "@/api/produccion/accions/obtener-producciones-userId";
import { useQuery } from "@tanstack/react-query";

const useGetProduccionesUserId = () => {
  return useQuery({
    queryKey: ["producciones-user"],
    queryFn: () => obtenerProduccionesByUserId(),
    staleTime: 60 * 5 * 100,
    retry: 0,
  });
};

export default useGetProduccionesUserId;
