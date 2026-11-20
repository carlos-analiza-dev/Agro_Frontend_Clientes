import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface Props {
  verified: boolean;
}

const VerifiedBadge = ({ verified }: Props) => {
  const t = useTranslations("verifiedBadge");

  return verified ? (
    <Badge variant="outline" className="border-blue-500 text-blue-500">
      {t("verified")}
    </Badge>
  ) : (
    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
      {t("notVerified")}
    </Badge>
  );
};

export default VerifiedBadge;
