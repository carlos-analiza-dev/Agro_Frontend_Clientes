import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const productoOpinionByCliente = async (productId: string) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/producto-opiniones/verificar-opinion/${productId}`;

  const response = await veterinariaAPI.get<boolean>(url);
  return response.data;
};
