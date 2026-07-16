import { obtenerRoleslesAgro } from "@/api/agroservicio/roles-agro/accions/obtener-roles-agro";
import { useQuery } from "@tanstack/react-query";

const useGetRolesAgro = () => {
  return useQuery({
    queryKey: ["roles-agro"],
    queryFn: obtenerRoleslesAgro,
    retry: 1,
  });
};

export default useGetRolesAgro;
