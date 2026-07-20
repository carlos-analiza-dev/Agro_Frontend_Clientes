import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

interface LogoImageSideBar {
  id: string;
  agroservicioId: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  agroservicio: string;
}

export const obtenerLogoAgro = async (propietarioId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/logos-agroservicios/${propietarioId}`;
  const respose = await veterinariaAPI.get<LogoImageSideBar>(url);
  return respose.data;
};
