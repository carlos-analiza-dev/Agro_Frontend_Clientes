import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ArrowRightToLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  animal: Animal;
}

const CardAnimal = ({ animal }: Props) => {
  return (
    <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
      <Link href={`/peso-animales/${animal.id}`}>
        <Image
          className="rounded-base"
          unoptimized
          width={400}
          height={400}
          src={`${animal.profileImages.length > 0 ? animal.profileImages[0].url : "/images/Image-not-found.png"}`}
          alt={`imagen_animal_${animal.id}`}
        />
      </Link>
      <Link href={`/peso-animales/${animal.id}`}>
        <h5 className="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
          {animal.identificador}
        </h5>
      </Link>
      <p className="mb-6 text-body">Edad: {animal.edad_promedio} años</p>
      <div className="flex justify-center">
        <Link
          href={`/peso-animales/${animal.id}`}
          className="inline-flex items-center text-body bg-neutral-secondary-medium box-border gap-4 border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Ver Historial
          <ArrowRightToLine />
        </Link>
      </div>
    </div>
  );
};

export default CardAnimal;
