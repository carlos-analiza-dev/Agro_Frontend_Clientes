export const formatearFechaParaInput = (
  fecha: string | Date | undefined,
): string => {
  if (!fecha) return "";

  if (typeof fecha === "string") {
    if (fecha.includes(" ")) {
      const [date, time] = fecha.split(" ");

      const timeOnly = time.split("+")[0].split("-")[0];
      return `${date}T${timeOnly}`;
    }

    return fecha.split(".")[0];
  }

  if (fecha instanceof Date) {
    return fecha.toISOString().slice(0, 16);
  }

  return "";
};

export const formatearFechaParaEnviar = (fecha: string): string => {
  if (!fecha) return "";

  if (fecha.includes("T")) {
    const [datePart, timePart] = fecha.split("T");

    let cleanTime = timePart;

    if (cleanTime.includes("+") || cleanTime.includes("-")) {
      cleanTime = cleanTime.split(/[+-]/)[0];
    }

    if (cleanTime.includes("Z")) {
      cleanTime = cleanTime.replace("Z", "");
    }

    const timeComponents = cleanTime.split(":");
    const hours = (timeComponents[0] || "00").padStart(2, "0");
    const minutes = (timeComponents[1] || "00").padStart(2, "0");
    let seconds = (timeComponents[2] || "00").split(".")[0];
    seconds = seconds.padStart(2, "0");

    return `${datePart}T${hours}:${minutes}:${seconds}Z`;
  }

  return `${fecha}T00:00:00Z`;
};
