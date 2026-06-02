import { obtenerChatsByConversacion } from "@/api/chat/accions/obtener-chats-by-conversacion";
import { useQuery } from "@tanstack/react-query";

const useGetChatsByConversacion = (conversacionId: string) => {
  return useQuery({
    queryKey: ["chats", conversacionId],
    queryFn: () => obtenerChatsByConversacion(conversacionId),
    retry: 0,
  });
};

export default useGetChatsByConversacion;
