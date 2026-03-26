"use client";

import { useState } from "react";
import { ChevronDown, Headphones, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Pedidos",
    question: "¿Cómo puedo realizar un pedido?",
    answer:
      "Para realizar un pedido, simplemente navega por nuestro catálogo de productos, agrega los productos que deseas al carrito de compras y sigue el proceso de checkout. Necesitarás crear una cuenta o iniciar sesión si ya tienes una.",
  },
  {
    category: "Pedidos",
    question: "¿Puedo modificar o cancelar mi pedido después de realizarlo?",
    answer:
      "Puedes modificar o cancelar tu pedido dentro de las 2 horas posteriores a la realización. Para ello, contacta a nuestro servicio al cliente lo antes posible con el número de tu pedido.",
  },
  {
    category: "Envíos",
    question: "¿Cuánto tiempo tarda la entrega?",
    answer:
      "Los tiempos de entrega varían según tu ubicación. En general, las entregas en áreas urbanas tardan de 2 a 5 días hábiles, mientras que en áreas rurales pueden tardar de 5 a 10 días hábiles. Recibirás un número de seguimiento cuando tu pedido sea enviado.",
  },
  {
    category: "Envíos",
    question: "¿Realizan envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a todo el territorio nacional. Los costos de envío se calculan automáticamente al momento de realizar tu pedido según tu ubicación.",
  },
  {
    category: "Envíos",
    question: "¿Puedo recoger mi pedido en sucursal?",
    answer:
      "Sí, ofrecemos la opción de recoger tu pedido en nuestras sucursales sin costo adicional. Durante el proceso de checkout, selecciona la opción 'Recoger en sucursal' y elige la sucursal más conveniente para ti.",
  },
  {
    category: "Pagos",
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos pagos con tarjetas de crédito (Visa, Mastercard), transferencias bancarias, y pagos en efectivo a través de nuestro sistema de pago seguro. ",
  },
  {
    category: "Pagos",
    question: "¿Es seguro pagar en línea?",
    answer:
      "Sí, utilizamos tecnología de encriptación SSL para proteger toda la información de pago. Además, trabajamos con proveedores de pago certificados que cumplen con los más altos estándares de seguridad.",
  },
  {
    category: "Productos",
    question: "¿Qué garantía tienen los productos?",
    answer:
      "Todos nuestros productos cuentan con garantía contra defectos de fabricación. El período de garantía varía según el producto y se especifica en la descripción del mismo. Para productos veterinarios, consulta las condiciones específicas.",
  },
  {
    category: "Productos",
    question: "¿Puedo devolver un producto?",
    answer:
      "Sí, aceptamos devoluciones dentro de los 7 días posteriores a la recepción del producto, siempre que esté en su empaque original y sin uso. Los productos veterinarios y perecederos tienen condiciones especiales.",
  },
  {
    category: "Cuenta",
    question: "¿Cómo puedo cambiar mi contraseña?",
    answer:
      "Para cambiar tu contraseña, inicia sesión en tu cuenta, ve a 'Login' y selecciona la opción '¿Olvidaste tu contraseña?'. Recibirás un correo de confirmación cuando el cambio sea exitoso.",
  },
  {
    category: "Cuenta",
    question: "¿Cómo puedo eliminar mi cuenta?",
    answer:
      "Si deseas eliminar tu cuenta, por favor contacta a nuestro servicio al cliente. Ten en cuenta que al eliminar tu cuenta perderás el acceso a tu historial de compras y puntos acumulados.",
  },
];

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const categories = [
    "Todos",
    "Pedidos",
    "Envíos",
    "Pagos",
    "Productos",
    "Cuenta",
  ];

  const filteredFaqs =
    selectedCategory === "Todos"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-lg text-gray-600">
              Encuentra respuestas a las preguntas más comunes
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
              <Headphones className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-600 mb-6">
              Estamos aquí para ayudarte. Contáctanos y te responderemos lo
              antes posible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Contactar soporte
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
