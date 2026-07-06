export function formatDateOnly(date: string | Date): string {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateTimeLocal(date: string | Date): string {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Fecha inválida";

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();

  const ampm = hours >= 12 ? "p. m." : "a. m.";
  hours = hours % 12 || 12;

  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return `${day.toString().padStart(2, "0")} de ${monthNames[month]} de ${year}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDateLocal(date: string | Date): string {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Fecha inválida";

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return `${day.toString().padStart(2, "0")} de ${monthNames[month]} de ${year}`;
}

export function formatDateLocalAnyo(date: string | Date): string {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Fecha inválida";

  const year = d.getUTCFullYear();

  return ` ${year}`;
}

export const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateToISOString = (
  dateStr: string | null | undefined,
): string => {
  if (!dateStr) {
    return new Date().toISOString();
  }

  if (dateStr.includes("T")) {
    return dateStr;
  }

  const date = new Date(dateStr + "T00:00:00");

  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};
