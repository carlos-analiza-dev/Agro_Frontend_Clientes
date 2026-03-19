import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseServicioReproductivoInterface } from "../../interfaces/response-servicio-repoductivo.interface";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";

export const ObtenerServiciosReproductivos = async (
  filtros?: FiltrosServicios,
): Promise<ResponseServicioReproductivoInterface> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/servicios-reproductivos`;

  const params = new URLSearchParams();

  if (filtros) {
    if (filtros.hembra_id) {
      params.append("hembra_id", filtros.hembra_id);
    }

    if (filtros.finca_id) {
      params.append("finca_id", filtros.finca_id);
    }

    if (filtros.tipo_servicio) {
      params.append("tipo_servicio", filtros.tipo_servicio);
    }

    if (filtros.estado) {
      params.append("estado", filtros.estado);
    }

    if (filtros.fecha_desde) {
      params.append("fecha_desde", filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      params.append("fecha_hasta", filtros.fecha_hasta);
    }

    if (filtros.exitoso !== undefined) {
      params.append("exitoso", filtros.exitoso.toString());
    }

    if (filtros.con_gestacion !== undefined) {
      params.append("con_gestacion", filtros.con_gestacion.toString());
    }

    if (filtros.page) {
      params.append("page", filtros.page.toString());
    }

    if (filtros.limit) {
      params.append("limit", filtros.limit.toString());
    }
  }

  const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

  const response =
    await veterinariaAPI.get<ResponseServicioReproductivoInterface>(finalUrl);
  return response.data;
};
