import { productoComprado } from "@/api/pedidos/accions/producto-comprado-cliente";
import { useQuery } from "@tanstack/react-query";

const useGetProductoCompradoByCliente = (productId: string) => {
  return useQuery({
    queryKey: ["producto-comprado", productId],
    queryFn: () => productoComprado(productId),
    retry: false,
  });
};

export default useGetProductoCompradoByCliente;
