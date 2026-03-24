"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Shield,
  Cloud,
  Smartphone,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rendimiento óptimo",
    description: "Procesamiento rápido de datos y análisis en tiempo real.",
  },
  {
    icon: Shield,
    title: "Seguridad garantizada",
    description: "Tus datos están protegidos con los más altos estándares.",
  },
  {
    icon: Cloud,
    title: "Acceso en la nube",
    description: "Disponible desde cualquier lugar, en cualquier momento.",
  },
  {
    icon: Smartphone,
    title: "App móvil",
    description: "Gestiona tu finca desde tu teléfono móvil.",
  },
  {
    icon: TrendingUp,
    title: "Reportes avanzados",
    description: "Análisis predictivos para optimizar tu producción.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              ¿Por qué elegir{" "}
              <span className="text-green-600">El Sembrador</span>?
            </h2>
            <p className="text-lg text-gray-600">
              Somos la plataforma líder en gestión agropecuaria para
              Centroamérica, diseñada específicamente para las necesidades de la
              región.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold">+40% productividad</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <Zap className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold">
                    -30% costos operativos
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold">24/7 disponible</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <Cloud className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold">100% en la nube</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
