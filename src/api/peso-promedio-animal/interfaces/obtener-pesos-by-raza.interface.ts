export interface ResponsePesoByRaza {
  id: string;
  gananciaMinima: string;
  gananciaMaxima: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  raza: Raza;
}

export interface Raza {
  id: string;
  nombre: string;
  abreviatura: string;
  isActive: boolean;
}
