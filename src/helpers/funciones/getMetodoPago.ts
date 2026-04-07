import { MetodoPago } from "@/interfaces/enums/gastos.enums";

export const getMetodoPagoLabel = (metodo: MetodoPago) => {
  const labels: Record<string, string> = {
    EFECTIVO: "Efectivo",
    TRANSFERENCIA: "Transferencia",
    TARJETA_CREDITO: "Tarjeta Crédito",
    TARJETA_DEBITO: "Tarjeta Débito",
    CHEQUE: "Cheque",
    OTRO: "Otro",
  };
  return labels[metodo] || metodo;
};
