import HomeClient from "@/components/home/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Sembrador | Agroservicios y Veterinaria",
  description:
    "Sistema de agroservicios y veterinaria para control de ganado, productos agropecuarios, razas, pesos promedio y gestión agrícola en Centroamérica.",
  keywords: [
    "agroservicios",
    "veterinaria",
    "ganado",
    "razas bovinas",
    "peso promedio ganado",
    "agricultura",
    "agro veterinaria",
    "Centroamérica",
    "Honduras",
    "El Sembrador",
  ],
  openGraph: {
    title: "El Sembrador | Agroservicios y Veterinaria",
    description:
      "Soluciones integrales para el campo centroamericano. Productos agropecuarios, servicios veterinarios y gestión agrícola.",
    url: "https://www.clientes.interactivecore.app",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "El Sembrador - Agroservicios y Veterinaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Sembrador | Agroservicios y Veterinaria",
    description:
      "Soluciones integrales para el campo centroamericano. Productos agropecuarios, servicios veterinarios y gestión agrícola.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-google-verification-code",
  },
  alternates: {
    canonical: "https://www.clientes.interactivecore.app",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
