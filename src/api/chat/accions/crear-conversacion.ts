import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearConversacionInterface } from "../interface/crear-consersacion.interface";
import { ResponseConversacionesInterface } from "../interface/response-conversacion.interface";

export const crearConversacionChat = async (
  data: CrearConversacionInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/chat-marketplace/conversation`;

  const response = await veterinariaAPI.post<ResponseConversacionesInterface>(
    url,
    data,
  );
  return response.data;
};
