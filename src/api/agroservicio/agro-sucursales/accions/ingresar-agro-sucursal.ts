import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateAgroSucursale } from "../interface/crear-sucursal.interface";

export const ingresarAgroSucursal = async (data: CreateAgroSucursale) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-sucursales`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
