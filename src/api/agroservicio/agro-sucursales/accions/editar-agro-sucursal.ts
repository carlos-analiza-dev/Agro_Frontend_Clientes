import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateAgroSucursale } from "../interface/crear-sucursal.interface";

export const editarAgroSucursal = async (
  id: string,
  data: Partial<CreateAgroSucursale>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales/${id}`;
  const respose = await veterinariaAPI.patch(url, data);
  return respose;
};
