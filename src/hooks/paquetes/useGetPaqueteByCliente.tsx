import { obtenerPaqueteCliente } from "@/api/paquetes/accions/obtener-paquete-by-cliente";
import { useQuery } from "@tanstack/react-query";

const useGetPaqueteByCliente = () => {
  return useQuery({
    queryKey: ["paquete-cliente"],
    queryFn: obtenerPaqueteCliente,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPaqueteByCliente;
