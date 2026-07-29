import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRangoAgroInterface } from "../interface/crear-agro-rango.interface";
import { empleadosAPI } from "@/helpers/api/empleadosAPI";

export const ingresarAgroRangosFactura = async (
  data: CrearRangoAgroInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-rango-factura`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};

export const ingresarAgroRangosFacturaEmpleado = async (
  data: CrearRangoAgroInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/agro-rango-factura/empleado`;
  const respose = await empleadosAPI.post(url, data);
  return respose;
};
