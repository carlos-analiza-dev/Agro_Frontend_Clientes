import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { AsignarFincaData } from "../interface/asignar-finca.interface";

export const asignarFincaTrabajador = async (data: AsignarFincaData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-finca-trabajador`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
