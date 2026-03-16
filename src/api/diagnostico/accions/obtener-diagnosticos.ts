import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ConsultarDiagnosticoInterface } from "../interface/consultar-diagnostico.interface";
import { ResponseDiagnosticoInterface } from "../interface/response-diagnostico.interface";

export const ObtenerDiagnostico = async (
  data: ConsultarDiagnosticoInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/diagnostico`;
  const respose = await veterinariaAPI.post<ResponseDiagnosticoInterface>(
    url,
    data,
  );
  return respose.data;
};
