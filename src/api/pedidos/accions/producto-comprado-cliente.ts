import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const productoComprado = async (productId: string) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos/verificar-compra/${productId}`;

  const response = await veterinariaAPI.get<boolean>(url);
  return response.data;
};
