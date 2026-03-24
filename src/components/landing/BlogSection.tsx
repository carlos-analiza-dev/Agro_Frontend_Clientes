"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    title:
      "5 tecnologías que están transformando la ganadería en Centroamérica",
    excerpt:
      "Descubre cómo la tecnología está revolucionando la producción ganadera en la región.",
    date: "15 Mar 2026",
    author: "Dr. Juan Carlos Pérez",
    category: "Ganadería",
    image: "/images/blog-1.jpg",
  },
  {
    title: "Manejo integrado de plagas en cultivos tropicales",
    excerpt:
      "Estrategias efectivas para controlar plagas de manera sostenible.",
    date: "10 Mar 2026",
    author: "Ing. María Rodríguez",
    category: "Agricultura",
    image: "/images/blog-2.jpg",
  },
  {
    title: "Beneficios del análisis de datos en la producción agropecuaria",
    excerpt: "Cómo la inteligencia artificial puede optimizar tus resultados.",
    date: "5 Mar 2026",
    author: "Lic. Carlos Méndez",
    category: "Tecnología",
    image: "/images/blog-3.jpg",
  },
];

export default function BlogSection() {
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
            Recursos y conocimientos
          </h2>
          <p className="text-xl text-gray-600">
            Artículos, guías y consejos para mejorar tu producción
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-green-100 rounded-t-xl flex items-center justify-center">
                  <span className="text-6xl">🌾</span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl hover:text-green-600 transition-colors">
                    <Link href={`/blog/${index}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/productos-agroservicios"
            className="border-green-600 text-green-600 hover:bg-green-50 p-4 border rounded-md"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  );
}
