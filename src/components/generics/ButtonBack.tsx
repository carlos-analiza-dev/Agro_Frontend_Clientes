import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  isMobil?: boolean;
}

const ButtonBack = ({ isMobil = false }: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {isMobil ? "" : "Volver"}
      </Button>
    </div>
  );
};

export default ButtonBack;
