import { obtenerMunicipiosDeptoById } from "@/api/municipios/accions/obtener-municipiosByDepto";
import { useQuery } from "@tanstack/react-query";

const useGetMunicipiosByDepto = (deptoId: string) => {
  return useQuery({
    queryKey: ["municipios-depto", deptoId],
    queryFn: () => obtenerMunicipiosDeptoById(deptoId),
    retry: 0,
    enabled: !!deptoId,
  });
};

export default useGetMunicipiosByDepto;
