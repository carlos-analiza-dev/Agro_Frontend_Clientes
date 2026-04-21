import { Clock, Moon, Star, Sun } from "lucide-react";

const getHoraExtraIcon = (tipo: string) => {
  switch (tipo) {
    case "diurnas":
      return <Sun className="h-3 w-3" />;
    case "nocturnas":
      return <Moon className="h-3 w-3" />;
    case "festivas":
      return <Star className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};
export default getHoraExtraIcon;
