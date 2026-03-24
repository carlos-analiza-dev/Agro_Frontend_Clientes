"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "Productora Ganadera",
    country: "Costa Rica",
    image: "/images/testimonial-1.jpg",
    content:
      "Desde que implementamos El Sembrador, la productividad de nuestra finca aumentó en un 40%. El control de peso del ganado y la gestión de vacunas nos ha permitido tomar mejores decisiones.",
    rating: 5,
  },
  {
    name: "Carlos Méndez",
    role: "Ingeniero Agrónomo",
    country: "Guatemala",
    image: "/images/testimonial-2.jpg",
    content:
      "La plataforma es increíblemente intuitiva. Mis clientes pueden monitorear sus cultivos en tiempo real y recibir alertas tempranas sobre plagas. Una herramienta indispensable.",
    rating: 5,
  },
  {
    name: "Ana Rodríguez",
    role: "Administradora de Finca",
    country: "Honduras",
    image: "/images/testimonial-3.jpg",
    content:
      "El soporte técnico es excepcional. Siempre están disponibles para ayudarnos y las actualizaciones constantes mejoran la experiencia. Recomiendo El Sembrador a todos los productores.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600">
            Más de 5000 productores en Centroamérica confían en nuestra
            plataforma
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-green-200 mb-4" />
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-green-600">
                        {testimonial.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
