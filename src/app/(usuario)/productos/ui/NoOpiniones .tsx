import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface NoOpinionesProps {
  haComprado?: boolean;
  onAgregarOpinion?: () => void;
}

export default function NoOpiniones({
  haComprado = false,
  onAgregarOpinion,
}: NoOpinionesProps) {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Aún no hay opiniones sobre este producto
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Sé el primero en compartir tu experiencia con este producto.
      </p>

      {haComprado ? (
        <Button onClick={onAgregarOpinion} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Agregar mi opinión
        </Button>
      ) : (
        <p className="text-sm text-gray-500">
          Solo los clientes que han comprado este producto pueden agregar
          opiniones.
        </p>
      )}
    </div>
  );
}
