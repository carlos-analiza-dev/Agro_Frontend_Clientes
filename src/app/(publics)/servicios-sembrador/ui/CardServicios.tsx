import { Servicio } from "@/api/servicios/interfaces/response-categorias-services";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  categoria: Servicio;
}

const CardServicios = ({ categoria }: Props) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/servicios-sembrador/${categoria.id}`)}
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 w-full">
        <Image
          src={`/images/servicio_image.png`}
          alt={categoria.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-lg border-none">
            {categoria.nombre}
          </Badge>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-xl font-bold line-clamp-1">
          {categoria.nombre}
        </CardTitle>
        {categoria.descripcion && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {categoria.descripcion}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {categoria.subServicios.slice(0, 3).map((subServicio) => {
            return (
              <div
                key={subServicio.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {subServicio.nombre}
                  </h3>
                  <Badge
                    variant={subServicio.disponible ? "default" : "destructive"}
                    className="flex-shrink-0 ml-2"
                  >
                    {subServicio.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
                {subServicio.descripcion && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subServicio.descripcion}
                  </p>
                )}
              </div>
            );
          })}

          {categoria.subServicios.length > 3 && (
            <div className="p-3 text-center text-sm text-muted-foreground bg-muted/30">
              +{categoria.subServicios.length - 3} servicios más
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardServicios;
