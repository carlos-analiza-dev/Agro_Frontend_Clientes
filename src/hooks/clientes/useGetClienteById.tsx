import { clienetById } from "@/api/cliente/accions/cliente-by-id";
import { useQuery } from "@tanstack/react-query";

const useGetClienteById = (id: string) => {
  return useQuery({
    queryKey: ["cliente", id],
    queryFn: () => clienetById(id),
    retry: 0,
  });
};

export default useGetClienteById;
