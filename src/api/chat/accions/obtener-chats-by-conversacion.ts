import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseChatsConversacionInterface } from "../interface/response-chats-conversacion";

export const obtenerChatsByConversacion = async (conversacionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/chat-marketplace/conversation/${conversacionId}/messages`;

  const response =
    await veterinariaAPI.get<ResponseChatsConversacionInterface[]>(url);

  return response.data;
};
