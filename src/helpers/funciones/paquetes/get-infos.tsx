import { PaqueteActivo } from "@/interfaces/auth/cliente";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import { Crown, Shield, Sparkles, Star, Zap } from "lucide-react";

export const getPlanIcon = (tipo: string) => {
  switch (tipo) {
    case TipoPaquete.FREE:
      return <Shield className="w-10 h-10 text-blue-500" />;
    case TipoPaquete.BASICO:
      return <Star className="w-10 h-10 text-green-500" />;
    case TipoPaquete.PREMIUM:
      return <Crown className="w-10 h-10 text-yellow-500" />;
    case TipoPaquete.EMPRESARIAL:
      return <Sparkles className="w-10 h-10 text-purple-500" />;
    default:
      return <Zap className="w-10 h-10 text-gray-500" />;
  }
};

export const getPlanColor = (tipo: string) => {
  switch (tipo) {
    case TipoPaquete.FREE:
      return "border-blue-200 bg-blue-50/50";
    case TipoPaquete.BASICO:
      return "border-green-200 bg-green-50/50";
    case TipoPaquete.PREMIUM:
      return "border-yellow-200 bg-yellow-50/50";
    case TipoPaquete.EMPRESARIAL:
      return "border-purple-200 bg-purple-50/50";
    default:
      return "border-gray-200 bg-gray-50/50";
  }
};

export const getBadgeColor = (tipo: string) => {
  switch (tipo) {
    case TipoPaquete.FREE:
      return "bg-blue-100 text-blue-800";
    case TipoPaquete.BASICO:
      return "bg-green-100 text-green-800";
    case TipoPaquete.PREMIUM:
      return "bg-yellow-100 text-yellow-800";
    case TipoPaquete.EMPRESARIAL:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPlanInfo = (
  esPropietario: boolean,
  planActivo: PaqueteActivo,
) => {
  if (!esPropietario) {
    return {
      label: "",
      color: "",
      progress: 0,
      daysLeft: 0,
    };
  }

  if (!planActivo) {
    return {
      label: "Sin plan activo",
      color: "bg-red-100 text-red-700",
      progress: 0,
      daysLeft: 0,
    };
  }

  const tipo = planActivo.paquete?.tipo || "FREE";
  const progress =
    planActivo.diasTotales > 0
      ? ((planActivo.diasTotales - planActivo.diasRestantes) /
          planActivo.diasTotales) *
        100
      : 0;

  switch (tipo) {
    case TipoPaquete.FREE:
      return {
        label: "Plan Gratuito",
        color: "bg-gray-100 text-gray-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
    case TipoPaquete.BASICO:
      return {
        label: "Plan Básico",
        color: "bg-blue-100 text-blue-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
    case TipoPaquete.PREMIUM:
      return {
        label: "Plan Premium",
        color: "bg-yellow-100 text-yellow-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
    case TipoPaquete.EMPRESARIAL:
      return {
        label: "Plan Empresarial",
        color: "bg-purple-100 text-purple-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
    case TipoPaquete.AGRO_GESTION:
      return {
        label: "Agro Gestión",
        color: "bg-green-100 text-green-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
    default:
      return {
        label: tipo,
        color: "bg-gray-100 text-gray-700",
        progress,
        daysLeft: planActivo.diasRestantes,
      };
  }
};
