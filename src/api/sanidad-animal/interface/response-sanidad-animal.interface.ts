import { Animal } from "@/api/animales/interfaces/response-animales.interface";

export interface ResponseSanidadAnimalInterface {
  sanidad: Sanidad[];
  total: number;
}

export interface Sanidad {
  id: string;
  propietarioId: string;

  // Relación con Animal
  animalId: string;

  // CAMPOS GLOBALES
  tipo_servicio: string;
  responsable: string;
  fecha_evento: string;
  proxima_fecha_evento: string;
  observaciones: string;
  costo_base: string;
  precio_referencia: string;
  margen_referencia: string;
  costo_real: string;
  valor_estimado: string;
  tratamiento_aplicado: string;
  motivo: string;

  // VACUNAS
  vacuna_aplicada: string;
  via_aplicacion_vacuna: string;
  dosis_tratamiento: string;
  dosis: string;

  // DESPARASITACIÓN
  tipo_desparasitacion: string;
  peso_usado: string;

  // UBRE
  prueba_evento: string;
  cuarto_afectado: string;
  dias_retiro_leche: number;
  litros_diarios_actuales: string;

  // PEZUÑAS
  tipo_atencion: string;
  grado_cojera: string;
  miembro_afectado: string;

  // LIMPIEZA GENERAL
  potrero_corral_area: string;
  actividad: string;
  dias_descanso: null;
  producto_maquinaria_utilizada: null;
  carga_animal: string;
  costo_producto_maquinaria: string;

  // ESQUILA OVEJAS
  peso_lana: string;
  calidad_lana: string;
  color_lana: string;
  responsable_esquila: string;

  // BAÑOS OVEJAS
  motivo_baño: string;
  tiempo_baño: number;
  hallazgos_piel: string;

  // ODONTOLOGÍA EQUINOS
  procedimiento: string;
  hallazgos: string;

  // CASCOS EQUINOS
  tipo: string;
  herrador: string;

  // LESIONES EQUINOS
  tipo_lesion: string;
  zona_afectada: string;
  severidad: string;

  // CONDICIÓN CORPORAL EQUINOS
  peso_estimado: string;
  condicion_corporal: string;
  cambio_dieta: string;

  // BAJA/MORTALIDAD PORCINOS Y AVES
  cantidad_bajas: number;
  causa_baja_probable: string;
  accion_correctiva: string;

  // CAMA/NIDO AVES
  tipo_accion: string;
  material_utilizado: string;
  cantidad_usada: string;

  // PRODUCCIÓN SANITARIA AVES
  huevos_diarios: number;
  huevos_rotos: number;
  porcentaje_postura: number;
  calidad_huevo: string;

  // CALIDAD AGUA PECES
  temperatura: string;
  oxigeno: string;
  ph: string;
  amonio: string;
  nitritos: string;

  // RECAMBIO AGUA PECES
  porcentaje_recambio: number;
  volumen_estimado: string;

  // MUESTREO PECES
  cantidad_muestreo: string;
  peso_promedio: string;
  talla_promedio: string;
  biomasa_estimada: string;
  etapa_peces: string;

  // Relación
  animal: Animal;
}
