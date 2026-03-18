import { Badge } from "@/components/ui/badge";

interface Props {
  intensidad: string;
}

const RenderIntensidadBadge = ({ intensidad }: Props) => {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    BAJO: {
      variant: "outline",
      className: "bg-gray-100 text-gray-800 border-gray-300",
    },
    MEDIO: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    ALTO: {
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    MUY_ALTO: {
      variant: "destructive",
      className: "bg-purple-100 text-purple-800 border-purple-300",
    },
  };

  const config = variants[intensidad] || variants.MEDIO;

  return (
    <Badge variant={config.variant} className={config.className}>
      {intensidad}
    </Badge>
  );
};

export default RenderIntensidadBadge;
