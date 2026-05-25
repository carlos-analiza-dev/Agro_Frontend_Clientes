export const determinarTasaImpuesto = (item: any): number => {
  if (item.tax?.porcentaje) {
    return Number(item.tax.porcentaje) / 100;
  }

  if (item.categoria?.nombre) {
    const categoriaNombre = item.categoria.nombre.toLowerCase();
    switch (categoriaNombre) {
      case "exento":
      case "exentos":
        return 0;
      case "15%":
      case "gravado 15":
        return 0.15;
      case "18%":
      case "gravado 18":
        return 0.18;
      case "exonerado":
        return 0;
    }
  }

  return 0.15;
};
