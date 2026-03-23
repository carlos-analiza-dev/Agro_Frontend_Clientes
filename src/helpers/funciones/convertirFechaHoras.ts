export const convertirFechaHora = (fecha?: string) =>
  fecha
    ? new Date(fecha).toLocaleString("sv-SE").replace(" ", "T").slice(0, 16)
    : "";
