import PrivacidadClient from "@/components/home/PrivacidadClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | El Sembrador",
  description:
    "Conoce nuestra política de privacidad. En El Sembrador protegemos tus datos personales y te explicamos cómo recopilamos, usamos y protegemos tu información.",
  keywords: [
    "política de privacidad",
    "protección de datos",
    "privacidad",
    "El Sembrador",
    "agroservicios",
    "datos personales",
    "seguridad de datos",
  ],
  openGraph: {
    title: "Política de Privacidad | El Sembrador",
    description:
      "Conoce cómo protegemos tus datos personales en El Sembrador. Transparencia y seguridad en el manejo de tu información.",
    url: "https://www.clientes.interactivecore.app/privacidad",
    type: "website",
    images: [
      {
        url: "/images/privacidad-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Política de Privacidad - El Sembrador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Privacidad | El Sembrador",
    description:
      "Conoce cómo protegemos tus datos personales en El Sembrador. Transparencia y seguridad en el manejo de tu información.",
    images: ["/images/privacidad-og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.clientes.interactivecore.app/privacidad",
  },
};

export default function PrivacidadPage() {
  return <PrivacidadClient />;
}
