const ESPECIES = {
  AVES: ["aves", "avicola", "pollos", "gallinas"],
  EQUINO: ["equino", "caballo", "yegua", "potro"],
  BOVINO: ["bovino", "vaca", "toro", "ternero"],
  PORCINO: ["porcino", "cerdo", "chancho"],
  OVINO: ["ovino", "oveja", "carnero"],
  CAPRINO: ["caprino", "cabra", "chivo"],
  PECES: [
    "piscicola",
    "pez",
    "peces",
    "tilapia",
    "trucha",
    "salmón",
    "carpa",
    "mojarra",
  ],
};

export const getEspecieTipo = (nombreEspecie: string): string => {
  if (!nombreEspecie) return "default";

  const nombreLower = nombreEspecie.toLowerCase();

  if (ESPECIES.AVES.some((e) => nombreLower.includes(e))) return "aves";
  if (ESPECIES.EQUINO.some((e) => nombreLower.includes(e))) return "equino";
  if (ESPECIES.BOVINO.some((e) => nombreLower.includes(e))) return "bovino";
  if (ESPECIES.PORCINO.some((e) => nombreLower.includes(e))) return "porcino";
  if (ESPECIES.OVINO.some((e) => nombreLower.includes(e))) return "ovino";
  if (ESPECIES.CAPRINO.some((e) => nombreLower.includes(e))) return "caprino";
  if (ESPECIES.PECES.some((e) => nombreLower.includes(e))) return "peces";

  return "default";
};
