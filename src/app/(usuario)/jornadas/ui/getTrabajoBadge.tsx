import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

const getTrabajoBadge = (trabajo: boolean) => {
  if (trabajo) {
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Trabajó
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      No trabajó
    </Badge>
  );
};

export default getTrabajoBadge;
