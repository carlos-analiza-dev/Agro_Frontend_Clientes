import { AllEscalasProducto } from "@/api/agroservicio/escala-producto/accions/obtener-escala-producto";
import { useQuery } from "@tanstack/react-query";

const useGetAllEscalasProductos = (productoId: string) => {
  return useQuery({
    queryKey: ["all-escalas", productoId],
    queryFn: () => AllEscalasProducto(productoId),
    retry: false,
  });
};

export default useGetAllEscalasProductos;
