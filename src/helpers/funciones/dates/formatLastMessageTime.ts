import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const formatLastMessageTime = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return "recientemente";
  }
};
