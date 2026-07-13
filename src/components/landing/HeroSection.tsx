"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Leaf, Shield, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-white/70 backdrop-blur-sm rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/40 p-4",
      className,
    )}
  >
    {children}
  </div>
);

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50/80 text-2xl">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50/40 via-white to-green-50/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid-green-900/[0.02] bg-[size:50px_50px]" />

      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-300/20 to-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-200/10 rounded-full blur-3xl" />

      <div className="absolute top-20 left-10 w-16 h-16 bg-green-200/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-20 w-20 h-20 bg-emerald-200/20 rounded-full blur-xl animate-float-delayed" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge variant={"outline"}>Disponible en toda Centroamérica</Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">
                Transforma tu producción agropecuaria con
              </span>
              <span className="block mt-2 bg-gradient-to-r from-green-600 via-green-700 to-green-600 bg-clip-text text-transparent">
                El Sembrador
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
              Sistema integral de gestión para ganado, cultivos y productos
              veterinarios. Optimiza tu producción agrícola y ganadera con
              tecnología de punta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-3 h-auto text-base font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.25)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.35)] transition-all duration-300"
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-xl"
                  >
                    👨‍🌾
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-bold text-green-600 text-base">
                  +5000
                </span>{" "}
                productores confían en nosotros
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Card className="text-center">
                <div className="flex flex-col items-center">
                  <Leaf className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-gray-900">200+</span>
                  <span className="text-xs text-gray-400">Fincas activas</span>
                </div>
              </Card>
              <Card className="text-center">
                <div className="flex flex-col items-center">
                  <Shield className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-gray-900">98%</span>
                  <span className="text-xs text-gray-400">Satisfacción</span>
                </div>
              </Card>
              <Card className="text-center">
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-lg font-bold text-gray-900">5K+</span>
                  <span className="text-xs text-gray-400">Usuarios</span>
                </div>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40">
              <Image
                src="/images/agricultura.jpg"
                alt="Agricultura moderna en Centroamérica"
                width={600}
                height={500}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/40">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌾</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Tecnología agrícola
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Gestión inteligente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 animate-float">
              <Card className="shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <StatItem
                  icon="🌱"
                  label="hectáreas gestionadas"
                  value="+10,000"
                />
              </Card>
            </div>

            <div className="absolute -top-4 -right-4 animate-float-delayed">
              <Card className="shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50/80">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Premium
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Plan AgroGestión
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
