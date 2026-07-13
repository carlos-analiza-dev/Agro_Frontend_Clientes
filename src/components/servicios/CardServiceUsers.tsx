import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Servicio } from "@/api/servicios/interfaces/response-servicios.interface";
import ButtonAdd from "../generics/ButtonAdd";

interface Props {
  services: Servicio;
  onPress: () => void;
}

const CardServiceUsers = ({ services, onPress }: Props) => {
  return (
    <Card className="w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full h-32 md:h-60">
        <Image
          src="/images/servicio_image.png"
          alt={services.nombre}
          unoptimized
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
              {services.nombre}
            </h3>
          </div>
          <ButtonAdd
            Icon={ArrowRight}
            title="Agendar Cita"
            action={onPress}
            className="bg-green-600 hover:bg-green-700"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardServiceUsers;
