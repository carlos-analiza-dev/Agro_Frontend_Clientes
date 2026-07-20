import { Cliente } from "@/interfaces/auth/cliente";
import { Empleado } from "@/interfaces/auth/empleado";

export const getUserAgroInfo = (
  isPropietario: boolean,
  cliente: Cliente,
  empleado: Empleado,
) => {
  if (isPropietario) {
    return {
      nombre: cliente?.nombre || cliente?.nombre || "Propietario",
      email: cliente?.email || "",
      imagen:
        cliente?.profileImages && cliente?.profileImages?.length > 0
          ? cliente.profileImages[0].url
          : "/images/ProfileImage.png",
    };
  } else {
    return {
      nombre: empleado?.nombre || "Empleado",
      email: empleado?.email || "",
      imagen: "/images/ProfileImage.png",
      rol: empleado?.role?.name || "Sin rol",
      sucursal: empleado?.sucursal?.nombre || "",
      isActive: empleado?.isActive || false,
    };
  }
};
