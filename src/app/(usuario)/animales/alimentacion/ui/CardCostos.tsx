import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Props {
  title: string;
  moneda?: string;
  number: string | number;
  icon: React.ElementType;
  description: string;
  primary?: boolean;
}

const CardCostos = ({
  title,
  moneda = "",
  number,
  icon: Icon,
  description,
  primary = true,
}: Props) => {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        primary ? "bg-primary/5 border-primary/20" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-2xl sm:text-3xl font-bold text-primary">
          {moneda} {number}
        </p>

        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CardCostos;
