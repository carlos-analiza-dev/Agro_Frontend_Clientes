import { Cliente } from "@/interfaces/auth/cliente";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export const getPropietarioId = (cliente: Cliente) => {
  if (cliente.rol === TipoCliente.PROPIETARIO) return cliente.id;

  return cliente.asignacionesTrabajador?.[0]?.asignadoPor?.id ?? null;
};
