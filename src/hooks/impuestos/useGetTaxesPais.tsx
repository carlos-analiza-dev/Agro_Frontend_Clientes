import { ObtenerTaxesByPais } from "@/api/impuestos/accions/obtener-taxes-pais";
import { useQuery } from "@tanstack/react-query";

const useGetTaxesPais = (paisId: string) => {
  return useQuery({
    queryKey: ["taxes", paisId],
    queryFn: () => ObtenerTaxesByPais(paisId),
    retry: 1,
  });
};

export default useGetTaxesPais;
