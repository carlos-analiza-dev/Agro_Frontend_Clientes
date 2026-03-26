import {
  Clock,
  CreditCard,
  Facebook,
  Heart,
  Instagram,
  Mail,
  Phone,
  Shield,
  Truck,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [{ name: "Productos", href: "/productos-agroservicios" }];

  const legalLinks = [
    { name: "Términos y Condiciones", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Preguntas Frecuentes", href: "/faq" },
    { name: "Contacto", href: "/contacto" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/elsembrador",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/elsembrador",
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/elsembrador",
      color: "hover:text-blue-400",
    },
  ];

  const benefits = [
    {
      icon: Truck,
      title: "Envíos a todo el país",
      description: "Entrega rápida y segura",
    },
    {
      icon: Shield,
      title: "Productos de calidad",
      description: "Garantía en todos nuestros productos",
    },
    {
      icon: CreditCard,
      title: "Pagos seguros",
      description: "Múltiples métodos de pago",
    },
    {
      icon: Heart,
      title: "Atención personalizada",
      description: "Asesoramiento experto",
    },
  ];
  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-500">El Sembrador</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Agroservicios y Veterinaria comprometidos con el campo
              centroamericano. Ofrecemos productos y servicios de alta calidad
              para el cuidado de tu ganado y cultivos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors ${social.color} hover:text-white`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a
                  href="tel:+573001234567"
                  className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                >
                  +57 300 123 4567
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a
                  href="mailto:info@elsembrador.com"
                  className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                >
                  info@elsembrador.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Lunes a Viernes: 8:00 AM - 6:00 PM
                  <br />
                  Sábados: 8:00 AM - 1:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-green-500 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="text-gray-400 text-sm text-center">
              © {currentYear} El Sembrador. Todos los derechos reservados.
            </div>

            <div className="flex space-x-3">
              <span className="text-gray-400 text-xs">Pagos seguros con:</span>
              <div className="flex space-x-2">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                  Visa
                </span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                  Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
