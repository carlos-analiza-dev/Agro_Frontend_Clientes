export type UnidadMedida = "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2";

export const UNIDADES_CONFIG: Record<
  UnidadMedida,
  { nombre: string; simbolo: string; factor: number }
> = {
  ha: { nombre: "hectáreas", simbolo: "ha", factor: 1 },
  mz: { nombre: "manzanas", simbolo: "mz", factor: 0.7 },
  m2: { nombre: "metros cuadrados", simbolo: "m²", factor: 0.0001 },
  km2: { nombre: "kilómetros cuadrados", simbolo: "km²", factor: 100 },
  ac: { nombre: "acres", simbolo: "ac", factor: 0.404686 },
  ft2: { nombre: "pies cuadrados", simbolo: "ft²", factor: 0.0000092903 },
  yd2: { nombre: "yardas cuadradas", simbolo: "yd²", factor: 0.0000836127 },
};
