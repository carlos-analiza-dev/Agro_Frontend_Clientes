import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";

/* export const CreateAnimal = async (data: CrearAnimalByFinca) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca`;

  const response = await veterinariaAPI.post(url, data);
  return response;
}; */

export const CreateAnimal = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
