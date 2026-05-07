export const formatHorasTrabajadas = (horas: string | number) => {
  const horasNum = typeof horas === "string" ? parseFloat(horas) : horas;
  const horasEnteras = Math.floor(horasNum);
  const minutos = Math.round((horasNum - horasEnteras) * 60);
  return `${horasEnteras}h ${minutos}min`;
};
