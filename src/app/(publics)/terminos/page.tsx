import TerminosClient from "@/components/home/TerminosClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | El Sembrador",
  description:
    "Conoce los términos y condiciones de uso de El Sembrador. Información sobre aceptación, uso del sitio, productos, envíos, propiedad intelectual y limitación de responsabilidad.",
  keywords: [
    "términos y condiciones",
    "condiciones de uso",
    "El Sembrador",
    "agroservicios",
    "veterinaria",
    "políticas",
    "legal",
    "productos agropecuarios",
  ],
  openGraph: {
    title: "Términos y Condiciones | El Sembrador",
    description:
      "Conoce los términos y condiciones de uso de nuestros servicios agropecuarios y veterinarios. Información legal importante para nuestros usuarios.",
    url: "https://www.clientes.interactivecore.app/terminos",
    type: "website",
    images: [
      {
        url: "/images/terminos-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Términos y Condiciones - El Sembrador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Términos y Condiciones | El Sembrador",
    description:
      "Conoce los términos y condiciones de uso de nuestros servicios agropecuarios y veterinarios.",
    images: ["/images/terminos.jpg"],
  },
  alternates: {
    canonical: "https://www.clientes.interactivecore.app/terminos",
  },
};

export default function TerminosPage() {
  return <TerminosClient />;
}
