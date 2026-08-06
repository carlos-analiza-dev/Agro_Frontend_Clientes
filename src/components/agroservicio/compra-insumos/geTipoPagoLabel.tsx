import { TipoPagoProveedor } from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";
import { tiposPagos } from "@/helpers/data/compras/tiposPagos";

export const getTipoPagoLabel = (value: TipoPagoProveedor) => {
  const tipo = tiposPagos.find((t) => t.value === value);
  return tipo ? tipo.label : value;
};
