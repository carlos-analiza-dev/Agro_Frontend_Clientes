import { obtenerLogoAgro } from "@/api/agroservicio/logo/accions/obtener-logo-agro";
import { useQuery } from "@tanstack/react-query";

const useGetLogoAgro = (propietarioId: string) => {
  return useQuery({
    queryKey: ["logo-agro", propietarioId],
    queryFn: () => obtenerLogoAgro(propietarioId),
    retry: 1,
  });
};

export default useGetLogoAgro;
