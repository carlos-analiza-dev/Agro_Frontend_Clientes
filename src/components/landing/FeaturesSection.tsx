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
import { useTranslations } from "next-intl";

const features = [
  { icon: Zap },
  { icon: Shield },
  { icon: Cloud },
  { icon: Smartphone },
  { icon: TrendingUp },
];

export default function FeaturesSection() {
  const t = useTranslations("features");

  const stats = [
    { icon: TrendingUp, label: t("stats.productivity") },
    { icon: Zap, label: t("stats.costs") },
    { icon: Smartphone, label: t("stats.availability") },
    { icon: Cloud, label: t("stats.cloud") },
  ];

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
              {t("title")} <span className="text-green-600">{t("brand")}</span>?
            </h2>

            <p className="text-lg text-gray-600">{t("description")}</p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t(`items.${index}.title`)}
                    </h3>

                    <p className="text-gray-600">
                      {t(`items.${index}.description`)}
                    </p>
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
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-md"
                    >
                      <Icon className="w-8 h-8 text-green-600 mb-2" />
                      <p className="text-sm font-semibold">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
