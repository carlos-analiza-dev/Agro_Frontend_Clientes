import { obtenerPaquetePais } from "@/api/paquetes/accions/obtener-paquete-pais";
import { useQuery } from "@tanstack/react-query";

const useGetPaquetesByPais = () => {
  return useQuery({
    queryKey: ["paquetes-pais"],
    queryFn: obtenerPaquetePais,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPaquetesByPais;
