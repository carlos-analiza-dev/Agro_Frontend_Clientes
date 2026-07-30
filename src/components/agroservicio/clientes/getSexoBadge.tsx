import { Badge } from "@/components/ui/badge";

export const getSexoBadge = (sexo: string) => {
  const sexoMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    M: { label: "Masculino", variant: "default" },
    F: { label: "Femenino", variant: "secondary" },
    Otro: { label: "Otro", variant: "outline" },
  };

  const info = sexoMap[sexo] || { label: sexo, variant: "outline" };

  return <Badge variant={info.variant}>{info.label}</Badge>;
};
