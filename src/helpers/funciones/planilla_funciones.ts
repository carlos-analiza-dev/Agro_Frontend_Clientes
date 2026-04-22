import {
  EstadoPlanilla,
  TipoPeriodoPago,
} from "@/interfaces/enums/planillas.enums";
import { Ban, CheckCircle, CreditCard } from "lucide-react";

export const getAvailableActions = (estado: EstadoPlanilla) => {
  switch (estado) {
    case EstadoPlanilla.BORRADOR:
      return {
        primary: {
          action: "confirmar",
          label: "Confirmar",
          icon: CheckCircle,
          color: "blue",
        },
        secondary: [],
        menu: ["ver", "editar"],
      };
    case EstadoPlanilla.CONFIRMADA:
      return {
        primary: {
          action: "pagar",
          label: "Pagar",
          icon: CreditCard,
          color: "green",
        },
        secondary: [
          {
            action: "anular",
            label: "Anular",
            icon: Ban,
            color: "destructive",
          },
        ],
        menu: ["ver"],
      };
    case EstadoPlanilla.PAGADA:
      return {
        primary: null,
        secondary: [],
        menu: ["ver"],
      };
    case EstadoPlanilla.ANULADA:
      return {
        primary: null,
        secondary: [],
        menu: ["ver"],
      };
    default:
      return {
        primary: null,
        secondary: [],
        menu: ["ver"],
      };
  }
};

export const getPeriodoText = (tipoPeriodo: TipoPeriodoPago) => {
  const periodos = {
    [TipoPeriodoPago.SEMANAL]: "Semanal",
    [TipoPeriodoPago.QUINCENAL]: "Quincenal",
    [TipoPeriodoPago.MENSUAL]: "Mensual",
  };
  return periodos[tipoPeriodo] || tipoPeriodo;
};
