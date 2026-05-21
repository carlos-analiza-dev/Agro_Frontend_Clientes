import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export interface ExistenciaProductoSucursal {
  existencia: number;
  sucursalesConExistencia: {
    id: string;
    nombre: string;
    existencia: number;
  }[];
}

export const ObtenerExistenciaProductoBySucursal = async (
  productoId: string,
  sucursalId: string,
) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/lotes/existencia/producto/${productoId}/sucursal/${sucursalId}`;

  const response = await veterinariaAPI.get<ExistenciaProductoSucursal>(url);
  return response.data;
};
