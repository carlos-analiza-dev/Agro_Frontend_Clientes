import {
  Imagene,
  Producto,
} from "@/api/productos/interfaces/response-producto-by-id.interface";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  imagenes:
    | Imagene[]
    | {
        id: string;
        url: string;
        key: string;
        mimeType: string;
      }[];
  producto: Producto;
  setCarouselApi: Dispatch<SetStateAction<CarouselApi | undefined>>;
  selectedImageIndex: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number>>;
}

const CardDetailsProducto = ({
  imagenes,
  producto,
  setCarouselApi,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <Carousel className="w-full" setApi={setCarouselApi}>
          <CarouselContent>
            {imagenes.map((imagen, index) => (
              <CarouselItem key={imagen.id}>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={imagen.url}
                    unoptimized
                    alt={`${producto.nombre} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {imagenes.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>

        {imagenes.length > 1 && (
          <div className="mt-4">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                dragFree: true,
              }}
            >
              <CarouselContent>
                {imagenes.map((imagen, index) => (
                  <CarouselItem
                    key={imagen.id}
                    className="basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    <div
                      className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={imagen.url}
                        alt={`${producto.nombre} - Miniatura ${index + 1}`}
                        unoptimized
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-0 scale-75" />
              <CarouselNext className="right-0 scale-75" />
            </Carousel>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CardDetailsProducto;
