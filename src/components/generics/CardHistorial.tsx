import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Props {
  total: number;
  titulo: string;
  colorIcon?: string;
  id?: string;
}

const CardHistorial = ({ titulo, total, colorIcon, id }: Props) => {
  return (
    <Card id={id}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{titulo}</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <FileText className={`h-8 w-8 ${colorIcon}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardHistorial;
