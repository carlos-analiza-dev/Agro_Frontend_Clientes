import { Rangos } from "@/api/agroservicio/facturacion/interface/response-agro-rangos-factura.interface";

export const calcularUso = (rango: Rangos): number => {
  const total = rango.rango_final - rango.rango_inicial + 1;
  const usado = rango.correlativo_actual - rango.rango_inicial + 1;
  const porcentaje = Math.round((usado / total) * 100);
  return Math.min(Math.max(porcentaje, 0), 100);
};

export const estaProximoVencer = (fechaLimite: Date | string): boolean => {
  const limite = new Date(fechaLimite);
  const hoy = new Date();
  const diffTime = limite.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

export const estaVencido = (fechaLimite: Date | string): boolean => {
  const limite = new Date(fechaLimite);
  const hoy = new Date();
  return limite < hoy;
};

export const getUsoColor = (uso: number): string => {
  if (uso > 80) return "bg-red-500";
  if (uso > 50) return "bg-yellow-500";
  return "bg-green-500";
};
