import { Cliente } from "@/interfaces/auth/cliente";

export const getSimboloMoneda = (cliente: Cliente | undefined) => {
  return cliente ? cliente.pais.simbolo_moneda : "$";
};
