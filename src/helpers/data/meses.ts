const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const getNombreMes = (mesNumero: number) => {
  return MESES[mesNumero - 1] || `Mes ${mesNumero}`;
};
