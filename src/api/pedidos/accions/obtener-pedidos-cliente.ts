import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePedidosInterface } from "../interface/response-pedidos.interface";

export const ObtenerPedidosByCliente = async (
  limit: number = 10,
  offset: number = 0,
  estado: string = "",
) => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
    estado: estado.toString(),
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos/cliente?${queryString}`;

  const response = await veterinariaAPI.get<ResponsePedidosInterface>(url);
  return response.data;
};
