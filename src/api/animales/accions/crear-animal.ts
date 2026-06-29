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

export const CreateAnimalAvicolas = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/avicola`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const CreateAnimalPeces = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/peces`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const CreateAnimalCaprino = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/caprino`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const CreateAnimalOvino = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/ovino`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const cargaMasivaAnimales = async (
  file: File,
  fincaId: string,
  especieId: string,
  razaId: string,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/carga-masiva/${fincaId}/${especieId}/${razaId}`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
