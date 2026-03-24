"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PawPrint,
  Sprout,
  Syringe,
  BarChart3,
  Truck,
  Users,
} from "lucide-react";

const services = [
  {
    icon: PawPrint,
    title: "Gestión de Ganado",
    description:
      "Control de peso, salud, reproducción y trazabilidad de tu ganado.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Sprout,
    title: "Gestión Agrícola",
    description: "Monitoreo de cultivos, riego, fertilización y rendimiento.",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Syringe,
    title: "Productos Veterinarios",
    description: "Catálogo completo de medicamentos, vacunas y suplementos.",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Análisis Predictivo",
    description: "IA para predecir rendimientos y optimizar recursos.",
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Truck,
    title: "Logística y Distribución",
    description: "Gestión de inventarios y cadena de suministro.",
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: Users,
    title: "Asesoría Especializada",
    description: "Soporte técnico y asesoramiento profesional continuo.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function ServicesSection() {
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
            Soluciones integrales para el agro centroamericano
          </h2>
          <p className="text-xl text-gray-600">
            Todo lo que necesitas para gestionar tu producción agrícola y
            ganadera en un solo lugar
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div
                    className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
