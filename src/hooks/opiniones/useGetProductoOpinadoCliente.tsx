import { productoOpinionByCliente } from "@/api/opiniones/accions/cliente-opinion";
import { useQuery } from "@tanstack/react-query";

const useGetProductoOpinadoCliente = (productId: string) => {
  return useQuery({
    queryKey: ["producto-opinado", productId],
    queryFn: () => productoOpinionByCliente(productId),
    retry: false,
  });
};

export default useGetProductoOpinadoCliente;
