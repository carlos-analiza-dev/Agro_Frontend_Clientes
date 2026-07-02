"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Tractor, Building2, PawPrint, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    value: "5000+",
    label: "Productores activos",
    description: "en Centroamérica",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50/80",
    iconColor: "text-blue-600",
  },
  {
    icon: Tractor,
    value: "50K+",
    label: "Hectáreas gestionadas",
    description: "de tierra cultivable",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50/80",
    iconColor: "text-green-600",
  },
  {
    icon: PawPrint,
    value: "100K+",
    label: "Cabezas de ganado",
    description: "registradas",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50/80",
    iconColor: "text-amber-600",
  },
  {
    icon: Building2,
    value: "4",
    label: "Países",
    description: "en Centroamérica",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50/80",
    iconColor: "text-purple-600",
  },
];

const StatCard = ({
  icon: Icon,
  value,
  label,
  description,
  color,
  bgColor,
  iconColor,
  index,
  isInView,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
  index: number;
  isInView: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 p-6 text-center">
        <div
          className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(34,197,94,0.15)]",
            bgColor,
            "backdrop-blur-sm border border-white/40",
          )}
        >
          <Icon
            className={cn(
              "w-8 h-8 transition-all duration-300 group-hover:scale-110",
              iconColor,
            )}
          />
        </div>

        <h3
          className={cn(
            "text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent",
            color,
          )}
        >
          {value}
        </h3>

        <p className="font-semibold text-gray-700 text-sm md:text-base">
          {label}
        </p>

        <p className="text-xs text-gray-400 mt-1">{description}</p>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

const Particle = ({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) => (
  <motion.div
    className={cn(
      "absolute rounded-full bg-gradient-to-r from-green-300/20 to-green-500/10",
      className,
    )}
    animate={{
      y: [0, -30, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-green-50/10 to-white"
    >
      <div className="absolute inset-0 bg-grid-green-900/[0.02] bg-[size:50px_50px]" />

      <div className="absolute top-0 right-0 w-64 h-64 bg-green-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/5 rounded-full blur-3xl" />

      <Particle className="top-10 left-10 w-20 h-20" delay={0} />
      <Particle className="bottom-20 right-20 w-16 h-16" delay={1.5} />
      <Particle className="top-1/3 right-10 w-12 h-12" delay={3} />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-4">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
              Nuestro impacto
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
            Transformando el agro centroamericano
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Miles de productores confían en nuestra plataforma para gestionar
            sus operaciones
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              color={stat.color}
              bgColor={stat.bgColor}
              iconColor={stat.iconColor}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-200/50 blur-sm" />
        </div>
      </div>
    </section>
  );
}
