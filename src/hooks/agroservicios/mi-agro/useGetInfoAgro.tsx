import { obtenerInfoAgro } from "@/api/agroservicio/mi-agroservicio/accions/obtener-ingo-agro";
import { useQuery } from "@tanstack/react-query";

const useGetInfoAgro = () => {
  return useQuery({
    queryKey: ["info-agro"],
    queryFn: obtenerInfoAgro,
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetInfoAgro;
