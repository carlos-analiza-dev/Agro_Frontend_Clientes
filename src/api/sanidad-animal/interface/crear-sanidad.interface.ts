export interface CreateSanidadAnimal {
  // Relación con Animal
  animalId: string;

  // CAMPOS GLOBALES
  tipo_Servicio: string;
  responsable: string;
  fecha_evento: Date | string;
  proxima_fecha_evento?: Date | string | null;
  observaciones?: string | null;
  costo_base?: number | null;
  precio_referencia?: number | null;
  margen_referencia?: number | null;
  costo_real?: number | null;
  valor_estimado?: number | null;
  tratamiento_aplicado?: string | null;
  motivo?: string | null;

  // VACUNAS
  vacuna_aplicada?: string | null;
  via_aplicacion_vacuna?: string | null;
  dosis_tratamiento?: string | null;
  dosis?: number | null;

  // DESPARACITACION
  tipo_desparasitacion?: string | null;
  peso_usado?: number | null;

  // UBRE
  prueba_evento?: string | null;
  cuarto_afectado?: string | null;
  dias_retiro_leche?: number | null;
  litros_diarios_actuales?: number | null;

  // PEZUÑAS
  tipo_atencion?: string | null;
  grado_cojera?: string | null;
  miembro_afectado?: string | null;

  // LIMPIEZA GENERAL
  potrero_corral_area?: string | null;
  actividad?: string | null;
  dias_descanso?: string[] | null;
  producto_maquinaria_utilizada?: string[] | null;
  carga_animal?: number | null;
  costo_producto_maquinaria?: number | null;

  // ESQUILA OVEJAS
  peso_lana?: number | null;
  calidad_lana?: string | null;
  color_lana?: string | null;
  responsable_esquila?: string | null;

  // BAÑOS OVEJAS
  motivo_baño?: string | null;
  tiempo_baño?: number | null;
  hallazgos_piel?: string | null;

  // ODONTOLOGIA EQUINOS
  procedimiento?: string | null;
  hallazgos?: string | null;

  // CASCOS EQUINOS
  tipo?: string | null;
  herrador?: string | null;

  // LESIONES EQUINOS
  tipo_lesion?: string | null;
  zona_afectada?: string | null;
  severidad?: string | null;

  // CONDICION CORPORAL EQUINOS
  peso_estimado?: number | null;
  condicion_corporal?: string | null;
  cambio_dieta?: string | null;

  // BAJA/MORTALIDAD PORCINOS y AVES
  cantidad_bajas?: number | null;
  causa_baja_probable?: string | null;
  accion_correctiva?: string | null;

  // CAMA/NIDO AVES
  tipo_accion?: string | null;
  material_utilizado?: string | null;
  cantidad_usada?: number | null;

  // PRODUCCION SANITARIA AVES
  huevos_diarios?: number | null;
  huevos_rotos?: number | null;
  porcentaje_postura?: number | null;
  calidad_huevo?: string | null;

  // CALIDAD AGUA PECES
  temperatura?: number | null;
  oxigeno?: number | null;
  ph?: number | null;
  amonio?: number | null;
  nitritos?: number | null;

  // RECAMBIO AGUA PECES
  porcentaje_recambio?: number | null;
  volumen_estimado?: number | null;

  // MUESTREO PECES
  cantidad_muestreo?: number | null;
  peso_promedio?: number | null;
  talla_promedio?: number | null;
  biomasa_estimada?: number | null;
  etapa_peces?: string | null;
}
