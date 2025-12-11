"use client";

import Image from "next/image";

interface AnimalItemProps {
  item: {
    value: string;
    label: string;
    imageUrl?: string;
    identificador: string;
    sexo: string;
    color: string;
  };
}

const AnimalItem = ({ item }: AnimalItemProps) => {
  return (
    <div className="flex items-center gap-3 p-2">
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.label}
          width={50}
          height={50}
          className="rounded-full object-cover"
          unoptimized
        />
      )}

      <div className="flex flex-col flex-1">
        <p className="text-base font-medium text-foreground">{item.label}</p>
        <p className="text-sm text-muted-foreground">
          {item.sexo} - {item.color}
        </p>
      </div>
    </div>
  );
};

export default AnimalItem;
