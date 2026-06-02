import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

export const formatChatDate = (date: string) => {
  const d = new Date(date);

  if (isToday(d)) {
    return format(d, "HH:mm", { locale: es });
  }

  if (isYesterday(d)) {
    return `Ayer ${format(d, "HH:mm", { locale: es })}`;
  }

  return format(d, "dd/MM/yyyy HH:mm", { locale: es });
};
