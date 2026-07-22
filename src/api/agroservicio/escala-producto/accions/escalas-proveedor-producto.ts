import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseAllEscalasProductos } from "../interfaces/response-all-escala-producto.interface";

export const ObtenerEscalasProveedorAndProducto = async (
  proveedorId: string,
  productoId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/escalas-agro-producto/proveedor/${proveedorId}/producto/${productoId}`;

  const response = await veterinariaAPI.get<ResponseAllEscalasProductos[]>(url);
  return response.data;
};
