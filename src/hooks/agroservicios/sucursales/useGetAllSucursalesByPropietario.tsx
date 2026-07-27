import { obtenerTodasSucursalesAgroByPropietario } from "@/api/agroservicio/agro-sucursales/accions/obtener-sucursales-agro";
import { useQuery } from "@tanstack/react-query";

const useGetAllSucursalesByPropietario = (propietarioId: string) => {
  return useQuery({
    queryKey: ["agro-propietario-sucursales", propietarioId],
    queryFn: () => obtenerTodasSucursalesAgroByPropietario(propietarioId),
    retry: 1,
  });
};

export default useGetAllSucursalesByPropietario;
