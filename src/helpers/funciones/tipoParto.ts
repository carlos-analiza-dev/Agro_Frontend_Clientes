export const getTipoPartoLabel = (tipo: string) => {
  const tipos: Record<string, string> = {
    NORMAL: "Normal",
    DISTOCICO: "Distócico",
    CESAREA: "Cesárea",
    ABORTO: "Aborto",
    MUERTE_NATAL: "Muerte Natal",
  };
  return tipos[tipo] || tipo;
};
