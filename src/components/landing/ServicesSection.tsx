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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: PawPrint,
    title: "Gestión de Ganado",
    description:
      "Control de peso, salud, reproducción y trazabilidad de tu ganado.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    iconColor: "text-blue-600",
    hoverBg: "hover:border-blue-200/50",
  },
  {
    icon: Sprout,
    title: "Gestión Agrícola",
    description: "Monitoreo de cultivos, riego, fertilización y rendimiento.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80",
    iconColor: "text-green-600",
    hoverBg: "hover:border-green-200/50",
  },
  {
    icon: Syringe,
    title: "Productos Veterinarios",
    description: "Catálogo completo de medicamentos, vacunas y suplementos.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    iconColor: "text-purple-600",
    hoverBg: "hover:border-purple-200/50",
  },
  {
    icon: BarChart3,
    title: "Análisis Predictivo",
    description: "IA para predecir rendimientos y optimizar recursos.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50/80",
    iconColor: "text-orange-600",
    hoverBg: "hover:border-orange-200/50",
  },
  {
    icon: Truck,
    title: "Logística y Distribución",
    description: "Gestión de inventarios y cadena de suministro.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50/80",
    iconColor: "text-cyan-600",
    hoverBg: "hover:border-cyan-200/50",
  },
  {
    icon: Users,
    title: "Asesoría Especializada",
    description: "Soporte técnico y asesoramiento profesional continuo.",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50/80",
    iconColor: "text-amber-600",
    hoverBg: "hover:border-amber-200/50",
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Card
        className={cn(
          "h-full transition-all duration-400 relative overflow-hidden",
          "bg-white/80 backdrop-blur-sm border border-white/40",
          "shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
          "hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] hover:-translate-y-2",
          service.hoverBg,
        )}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>

        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            service.color,
          )}
        />

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(34,197,94,0.12)]",
                service.bgColor,
                "backdrop-blur-sm border border-white/40",
              )}
            >
              <service.icon
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  service.iconColor,
                )}
              />
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-[10px] font-medium text-gray-400">
                <Sparkles className="h-3 w-3 text-green-400" />
                Premium
              </span>
            </div>
          </div>

          <CardTitle className="text-xl font-bold mt-4 group-hover:text-green-600 transition-colors duration-300">
            {service.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-gray-400 leading-relaxed">{service.description}</p>

          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
            <Link
              href={"/login"}
              className="p-0 h-auto text-green-600 hover:text-green-700 hover:bg-transparent group/link flex items-center"
            >
              <span className="text-sm font-medium">Conocer más</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DecorativeParticle = ({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) => (
  <motion.div
    className={cn(
      "absolute rounded-full bg-gradient-to-r from-green-300/10 to-green-500/5",
      className,
    )}
    animate={{
      y: [0, -40, 0],
      opacity: [0, 0.5, 0],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function ServicesSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50/40 via-white to-green-50/20">
      <div className="absolute inset-0 bg-grid-green-900/[0.02] bg-[size:50px_50px]" />

      <div className="absolute top-0 right-0 w-80 h-80 bg-green-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-100/5 rounded-full blur-3xl" />

      <DecorativeParticle className="top-20 left-10 w-24 h-24" delay={0} />
      <DecorativeParticle
        className="bottom-32 right-20 w-20 h-20"
        delay={1.5}
      />
      <DecorativeParticle className="top-1/2 left-20 w-16 h-16" delay={3} />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-4">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
              Nuestros Servicios
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
            Soluciones integrales para el agro centroamericano
          </h2>
          <p className="text-gray-400 mt-3 text-lg">
            Todo lo que necesitas para gestionar tu producción agrícola y
            ganadera en un solo lugar
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <span className="text-sm text-gray-500">
              ¿Listo para transformar tu producción?
            </span>
            <Button
              asChild
              className="rounded-full px-6 py-1.5 h-auto text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.2)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.3)] transition-all duration-300"
            >
              <Link href="/register">
                Comenzar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
