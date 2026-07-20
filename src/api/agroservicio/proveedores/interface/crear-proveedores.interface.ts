import {
  TipoEscala,
  TipoPagoProveedor,
} from "./response-agro-proveedores.interface";

export interface CrearProveedoresAgro {
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  plazo?: number;
  nombre_contacto: string;
  departamentoId: string;
  municipioId: string;
  tipo_escala: TipoEscala;
  tipo_pago_default: TipoPagoProveedor;
}
