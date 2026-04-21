import { Badge } from "@/components/ui/badge";
import { estadosPlanilla } from "@/helpers/data/estadosPlanilla";

const getEstadoBadgePlanilla = (estado: string) => {
  const estadoConfig = estadosPlanilla.find((e) => e.value === estado);
  if (!estadoConfig || estado === "todos") return <Badge>{estado}</Badge>;

  return (
    <Badge className={`${estadoConfig.color} border-0`}>
      {estadoConfig.label}
    </Badge>
  );
};

export default getEstadoBadgePlanilla;
