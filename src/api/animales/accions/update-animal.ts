import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";
import { AvicolaData } from "../interfaces/crear-avicola.interface";
import { PecesData } from "../interfaces/crear-peces.interface";
import { FormCaprinoData } from "../interfaces/crear-caprino.interface";
import { FormOvinoData } from "../interfaces/crear-ovino.interface";
import { FormPorcinoData } from "../interfaces/crear-porcino.interface";
import { DescarteData } from "../interfaces/ingresar-descartes.interface";

export const ActualizarAnimal = async (
  id: string,
  data: Partial<CrearAnimalByFinca>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarAvicola = async (
  id: string,
  data: Partial<AvicolaData>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/avicola/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const ActualizarPeces = async (id: string, data: Partial<PecesData>) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/peces/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const UpdateAnimalCaprino = async (
  id: string,
  data: Partial<FormCaprinoData>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/caprino/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const UpdateAnimalOvino = async (
  id: string,
  data: Partial<FormOvinoData>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/ovino/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const UpdateAnimalPorcino = async (
  id: string,
  data: Partial<FormPorcinoData>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/porcino/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const descartarAnimal = async (id: string, data: DescarteData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/descartar/${id}`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const descartarAves = async (id: string, data: DescarteData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/descartar-aves/${id}`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const descartarPeces = async (id: string, data: DescarteData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/descartar-peces/${id}`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

/* export const ActualizarAnimal = async (
  id: string,
  data: Partial<CrearAnimalByFinca>
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
 */
