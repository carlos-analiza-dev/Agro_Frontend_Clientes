export const generarOpcionesMeses = () => {
  const opciones = [];
  const fecha = new Date();

  for (let i = 0; i < 12; i++) {
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const fechaMes = new Date(year, month - i, 1);
    const value = `${fechaMes.getFullYear()}-${String(fechaMes.getMonth() + 1).padStart(2, "0")}`;
    const label = fechaMes.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
    opciones.push({ value, label });
  }

  return opciones;
};
