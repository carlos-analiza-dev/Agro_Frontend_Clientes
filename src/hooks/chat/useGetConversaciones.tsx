import { obtenerConversaciones } from "@/api/chat/accions/obtener-all-conversacion";
import { useQuery } from "@tanstack/react-query";

const useGetConversaciones = () => {
  return useQuery({
    queryKey: ["conversaciones"],
    queryFn: () => obtenerConversaciones(),
    retry: 0,
  });
};

export default useGetConversaciones;
