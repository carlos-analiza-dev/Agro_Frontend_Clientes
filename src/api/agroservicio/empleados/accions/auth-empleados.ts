import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { Departamento, Municipio, Pais } from "@/interfaces/auth/cliente";
import {
  AgroservicioEmpleado,
  RoleEmpleado,
  SucursalEmpleado,
} from "@/interfaces/auth/empleado";

export interface AuthResponse {
  id: string;
  email: string;
  nombre: string;
  role: RoleEmpleado;
  sexo: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  isActive: boolean;
  createdAt: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Municipio;
  sucursal: SucursalEmpleado;
  agroservicio: AgroservicioEmpleado;
  token: string;
}

export const returnEmpleadoToken = (data: AuthResponse) => {
  const { token, ...empleado } = data;

  const adaptedEmpleado = {
    ...empleado,
    name: empleado.nombre,
  };

  return { empleado: adaptedEmpleado, token };
};

export const authLoginEmpleado = async (email: string, password: string) => {
  try {
    email = email.toLowerCase().trim();

    const { data } = await veterinariaAPI.post<AuthResponse>(
      "/empleados-agro/login",
      {
        email,
        password,
      },
    );

    if (!data) {
      return null;
    }

    return returnEmpleadoToken(data);
  } catch (error: any) {
    return null;
  }
};

export const authCheckStatusEmpleado = async () => {
  try {
    const { data } = await veterinariaAPI.get<AuthResponse>(
      "/empleados-agro/check-status",
    );
    return returnEmpleadoToken(data);
  } catch (error) {
    return null;
  }
};
