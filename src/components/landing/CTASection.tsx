"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>

          <p className="text-xl text-green-100 mb-8">{t("description")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8"
              >
                {t("start")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/contacto">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8"
              >
                {t("contact")}
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 text-white">
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>{t("phone")}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span>{t("email")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
