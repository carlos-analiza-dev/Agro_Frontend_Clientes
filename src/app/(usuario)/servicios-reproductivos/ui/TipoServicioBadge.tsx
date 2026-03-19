import { Badge } from "@/components/ui/badge";

const TipoServicioBadge = ({ tipo }: { tipo: string }) => {
  const colors = {
    MONTA_NATURAL: "bg-blue-100 text-blue-800",
    INSEMINACION_ARTIFICIAL: "bg-purple-100 text-purple-800",
    TRANSFERENCIA_EMBRIONES: "bg-indigo-100 text-indigo-800",
    FERTILIZACION_INVITRO: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={colors[tipo as keyof typeof colors]}>
      {tipo.replace(/_/g, " ")}
    </Badge>
  );
};

export default TipoServicioBadge;
