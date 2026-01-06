export interface ResponseOpinionesByProducto {
  limit: number;
  offset: number;
  total: number;
  opiniones: Opinione[];
}

export interface Opinione {
  id: string;
  rating: number;
  titulo: string;
  comentario: string;
  createdAt: Date;
  cliente: Cliente;
}

export interface Cliente {
  id: string;
  nombre: string;
  profileImages: ProfileImage[];
  profileImage: ProfileImage;
}

export interface ProfileImage {
  id: string;
  url: string;
  createdAt: Date;
}
