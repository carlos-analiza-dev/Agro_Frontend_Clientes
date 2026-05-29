import { ObtenerAnimales } from "@/api/animales/accions/get-animales-bypropietario";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalesPropietario = () => {
  return useQuery({
    queryKey: ["animales-propietario"],
    queryFn: () => ObtenerAnimales(),
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAnimalesPropietario;
