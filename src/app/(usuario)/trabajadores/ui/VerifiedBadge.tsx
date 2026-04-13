import { Badge } from "@/components/ui/badge";

const VerifiedBadge = (verified: boolean) => {
  return verified ? (
    <Badge variant="outline" className="border-blue-500 text-blue-500">
      Verificado
    </Badge>
  ) : (
    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
      No verificado
    </Badge>
  );
};

export default VerifiedBadge;
