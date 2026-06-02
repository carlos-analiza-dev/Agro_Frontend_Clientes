import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseConversacionesInterface } from "../interface/response-conversacion.interface";

export const obtenerConversaciones = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/chat-marketplace/conversations`;

  const response =
    await veterinariaAPI.get<ResponseConversacionesInterface[]>(url);

  return response.data;
};
