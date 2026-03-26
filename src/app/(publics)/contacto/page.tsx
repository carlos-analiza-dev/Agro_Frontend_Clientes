import ContactoClient from "@/components/home/ContactoClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | El Sembrador",
  description:
    "Contáctanos para consultas sobre productos agropecuarios, servicios veterinarios o cualquier duda. Estamos en Comayagua, Honduras.",
  keywords: [
    "contacto",
    "agroservicios",
    "veterinaria",
    "El Sembrador",
    "Honduras",
  ],
  openGraph: {
    title: "Contacto | El Sembrador",
    description:
      "Contáctanos para consultas sobre productos agropecuarios y servicios veterinarios.",
    url: "https://www.clientes.interactivecore.app/contacto",
    type: "website",
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
