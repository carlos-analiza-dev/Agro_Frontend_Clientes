import { obtenerPaqueteClienteHistorial } from "@/api/paquetes/accions/obtener-paquete-by-cliente-historial";
import { useQuery } from "@tanstack/react-query";

const useGetHistorialPaquetesByCliente = () => {
  return useQuery({
    queryKey: ["paquetes-historial"],
    queryFn: obtenerPaqueteClienteHistorial,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetHistorialPaquetesByCliente;
