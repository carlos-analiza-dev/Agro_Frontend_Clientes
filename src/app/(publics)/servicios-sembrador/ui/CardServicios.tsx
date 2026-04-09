import { Servicio } from "@/api/servicios/interfaces/response-categorias-services";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import Image from "next/image";

interface Props {
  categoria: Servicio;
}

const CardServicios = ({ categoria }: Props) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={`/images/servicio_image.png`}
          alt={categoria.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-xl font-bold">{categoria.nombre}</CardTitle>
        {categoria.descripcion && (
          <p className="text-sm text-muted-foreground mt-1">
            {categoria.descripcion}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {categoria.subServicios.map((subServicio) => {
            const precioPorPais = subServicio.preciosPorPais?.[0];
            const simboloMoneda = precioPorPais?.pais?.simbolo_moneda || "L";
            const precio = precioPorPais?.precio || "0";

            return (
              <div
                key={subServicio.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {subServicio.nombre}
                  </h3>
                  <Badge
                    variant={subServicio.disponible ? "default" : "destructive"}
                  >
                    {subServicio.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </div>

                {subServicio.descripcion && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {subServicio.descripcion}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-2">
                  {precioPorPais && (
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">
                        {simboloMoneda} {parseFloat(precio).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {precioPorPais?.tiempo && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{precioPorPais.tiempo} hr(s)</span>
                    </div>
                  )}
                </div>

                {precioPorPais?.insumos && precioPorPais.insumos.length > 0 && (
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Insumos incluidos:{" "}
                      {precioPorPais.insumos
                        .map((i) => i.insumo.nombre)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardServicios;
