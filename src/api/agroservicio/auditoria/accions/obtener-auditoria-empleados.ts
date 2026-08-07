import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseAuditoriaEmpleados } from "../interface/response-auditoria-empleados.interface";

export const obtenerAuditoriaEmpleados = async (
  filtros?: PaginationInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/empleados-agro/auditoria`;

  const response = await veterinariaAPI.get<ResponseAuditoriaEmpleados>(url, {
    params: filtros,
  });

  return response.data;
};
