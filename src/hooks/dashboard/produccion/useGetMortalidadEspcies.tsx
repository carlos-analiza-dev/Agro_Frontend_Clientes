import { obtenerMortalidadPorEspecie } from "@/api/dashboard/accions/produccion/obtener-mortalidad-especies";
import { useQuery } from "@tanstack/react-query";

const useGetMortalidadEspcies = (mes?: string) => {
  return useQuery({
    queryKey: ["mortalidad", mes],
    queryFn: () => obtenerMortalidadPorEspecie(mes),
    retry: 1,
  });
};

export default useGetMortalidadEspcies;
