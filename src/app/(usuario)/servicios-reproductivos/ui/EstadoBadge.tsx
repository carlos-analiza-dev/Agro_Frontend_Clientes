import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const EstadoBadge = ({ estado }: { estado: string }) => {
  const config = {
    PROGRAMADO: {
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      icon: Clock,
    },
    REALIZADO: {
      color: "bg-green-100 text-green-800 hover:bg-green-100",
      icon: CheckCircle,
    },
    FALLIDO: {
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      icon: XCircle,
    },
    CANCELADO: {
      color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      icon: AlertCircle,
    },
  };

  const { color, icon: Icon } =
    config[estado as keyof typeof config] || config.CANCELADO;

  return (
    <Badge className={`${color} border-0 flex items-center gap-1 w-fit`}>
      <Icon className="h-3 w-3" />
      {estado}
    </Badge>
  );
};

export default EstadoBadge;
