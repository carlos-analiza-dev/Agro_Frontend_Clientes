import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationInterface } from "@/interfaces/filtros/paginacion/paginacion.interface";
import { ResponseEmpleadosAgroInterface } from "../interface/response-empleados-agro.interface";

export const obtenerEmpleadosAgro = async (filtros?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/empleados-agro`;

  const response = await veterinariaAPI.get<ResponseEmpleadosAgroInterface>(
    url,
    {
      params: filtros,
    },
  );

  return response.data;
};
