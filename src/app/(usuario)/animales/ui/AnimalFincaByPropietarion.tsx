"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, User, FileText } from "lucide-react";

interface Props {
  fincaNombre: string;
  fincaAbreviatura: string;
  observaciones?: string | null;
}

const AnimalFincaByPropietarion = ({
  fincaNombre,
  fincaAbreviatura,
  observaciones,
}: Props) => {
  return (
    <div className="space-y-3">
      <Card className="rounded-xl shadow-sm">
        <CardContent className="flex items-start gap-2 p-3">
          <Home className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Finca:</span> {fincaNombre} (
            {fincaAbreviatura})
          </p>
        </CardContent>
      </Card>

      {observaciones && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="flex items-start gap-2 p-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Características:</span>{" "}
              {observaciones}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnimalFincaByPropietarion;
