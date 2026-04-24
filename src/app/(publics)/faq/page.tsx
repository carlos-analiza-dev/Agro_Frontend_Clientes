import FAQClient from "@/components/home/FAQClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | El Sembrador",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre pedidos, envíos, pagos, productos y cuenta en El Sembrador. Todo lo que necesitas saber para tu experiencia de compra.",
  keywords: [
    "preguntas frecuentes",
    "faq",
    "ayuda",
    "soporte",
    "El Sembrador",
    "agroservicios",
    "veterinaria",
    "pedidos",
    "envíos",
    "pagos",
    "devoluciones",
    "garantía",
  ],
  openGraph: {
    title: "Preguntas Frecuentes | El Sembrador",
    description:
      "Encuentra respuestas a las preguntas más comunes sobre pedidos, envíos, pagos, productos y cuenta.",
    url: "https://www.clientes.interactivecore.app/faq",
    type: "website",
    images: [
      {
        url: "/images/faqs.jpg",
        width: 1200,
        height: 630,
        alt: "Preguntas Frecuentes - El Sembrador",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preguntas Frecuentes | El Sembrador",
    description:
      "Encuentra respuestas a las preguntas más comunes sobre pedidos, envíos, pagos, productos y cuenta.",
    images: ["/images/faqs.jpg"],
  },
  alternates: {
    canonical: "https://www.clientes.interactivecore.app/faq",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
