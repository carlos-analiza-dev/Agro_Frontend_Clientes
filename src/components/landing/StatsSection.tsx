"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Tractor, Building2, PawPrint } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "5000+",
    label: "Productores activos",
    description: "en Centroamérica",
  },
  {
    icon: Tractor,
    value: "50K+",
    label: "Hectáreas gestionadas",
    description: "de tierra cultivable",
  },
  {
    icon: PawPrint,
    value: "100K+",
    label: "Cabezas de ganado",
    description: "registradas",
  },
  {
    icon: Building2,
    value: "7",
    label: "Países",
    description: "en Centroamérica",
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className="font-semibold text-gray-700">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
