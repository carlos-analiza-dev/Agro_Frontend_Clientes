import { obtenerAllProveedoresAgro } from "@/api/agroservicio/proveedores/accions/obtener-agro-prov";
import { useQuery } from "@tanstack/react-query";

const useGetAllProveedores = (propietarioId: string) => {
  return useQuery({
    queryKey: ["all-agro-proveedores", , propietarioId],
    queryFn: () => obtenerAllProveedoresAgro(propietarioId),
    enabled: !!propietarioId,
    retry: 1,
  });
};

export default useGetAllProveedores;
