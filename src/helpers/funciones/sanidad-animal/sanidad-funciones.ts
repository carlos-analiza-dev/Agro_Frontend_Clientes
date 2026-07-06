import { tiposServiciosSanidadData } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import { FileText } from "lucide-react";

export const getServiceIcon = (tipo: string) => {
  const service = tiposServiciosSanidadData.find((s) => s.value === tipo);
  return service?.icon || FileText;
};

export const getBadgeColor = (tipo: string) => {
  const colors: Record<string, string> = {
    Vacunacion: "bg-blue-100 text-blue-800",
    Desparasitacion: "bg-green-100 text-green-800",
    RevisionUbre: "bg-purple-100 text-purple-800",
    AtencionPezunas: "bg-yellow-100 text-yellow-800",
    LimpiezaCorral: "bg-gray-100 text-gray-800",
    Esquila: "bg-orange-100 text-orange-800",
    BanoSanitario: "bg-cyan-100 text-cyan-800",
    ControlMortalidad: "bg-red-100 text-red-800",
    Odontologia: "bg-pink-100 text-pink-800",
    AtencionCascos: "bg-indigo-100 text-indigo-800",
    RevisionLesiones: "bg-rose-100 text-rose-800",
    EvaluacionCondicionCorporal: "bg-teal-100 text-teal-800",
    CambioCamaNido: "bg-amber-100 text-amber-800",
    ControlProduccion: "bg-lime-100 text-lime-800",
    ControlCalidadAgua: "bg-sky-100 text-sky-800",
    RecambioAgua: "bg-blue-50 text-blue-700",
    MuestreoBiometrico: "bg-emerald-100 text-emerald-800",
  };
  return colors[tipo] || "bg-gray-100 text-gray-800";
};
