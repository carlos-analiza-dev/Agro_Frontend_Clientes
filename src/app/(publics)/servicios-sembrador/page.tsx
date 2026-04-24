import { Metadata } from "next";
import ServiciosPublicosPage from "./ui/ServiciosPublicosPage";

export const metadata: Metadata = {
  title: "Servicios Públicos y Agroservicios",
  description:
    "Encuentra servicios públicos y agroservicios disponibles para el sector agrícola y ganadero. Soluciones profesionales para el campo.",
  keywords: [
    "servicios públicos",
    "agroservicios",
    "servicios agrícolas",
    "servicios ganaderos",
    "asesoría agrícola",
    "campo",
    "ganadería",
    "agricultura",
  ],
  openGraph: {
    title: "Servicios Agropecuarios | El Sembrador",
    description:
      "Explora servicios disponibles para mejorar la productividad en agricultura y ganadería.",
    url: "https://www.clientes.interactivecore.app/servicios-sembrador",
    type: "website",
  },
};

const CategoriaServiciosPage = () => {
  return <ServiciosPublicosPage />;
};

export default CategoriaServiciosPage;
