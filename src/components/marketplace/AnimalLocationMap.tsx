"use client";

import React, { useMemo } from "react";

interface Props {
  direccion: string;
}

const AnimalLocationMap: React.FC<Props> = ({ direccion }) => {
  const mapUrl = useMemo(() => {
    const query = encodeURIComponent(direccion);
    return `https://www.google.com/maps?q=${query}&output=embed`;
  }, [direccion]);

  if (!direccion) return null;

  return (
    <div className="w-full h-[100px] md:h-[200px] rounded-xl overflow-hidden border">
      <iframe
        title="Ubicación del producto"
        src={mapUrl}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default AnimalLocationMap;
