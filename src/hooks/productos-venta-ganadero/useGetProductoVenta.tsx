import { ObtenerProductosGanadero } from "@/api/productos-ganadero/accions/obtener-productos-ganadero";
import { useQuery } from "@tanstack/react-query";

const useGetProductoVenta = () => {
  return useQuery({
    queryKey: ["productos-venta"],
    queryFn: () => ObtenerProductosGanadero(),
    staleTime: 60 * 5 * 100,
  });
};

export default useGetProductoVenta;
