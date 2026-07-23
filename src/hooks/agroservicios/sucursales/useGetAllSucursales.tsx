import { obtenerTodasSucursalesAgro } from "@/api/agroservicio/agro-sucursales/accions/obtener-sucursales-agro";
import { useQuery } from "@tanstack/react-query";

const useGetAllSucursales = () => {
  return useQuery({
    queryKey: ["agro-all-sucursales"],
    queryFn: obtenerTodasSucursalesAgro,
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetAllSucursales;
