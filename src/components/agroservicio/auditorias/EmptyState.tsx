import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">No hay auditorías disponibles</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
);
