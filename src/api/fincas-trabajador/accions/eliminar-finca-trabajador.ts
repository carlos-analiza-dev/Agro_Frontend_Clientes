import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarFincaTrabajador = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-finca-trabajador/${id}`;

  const response = await veterinariaAPI.delete(url);
  return response;
};
