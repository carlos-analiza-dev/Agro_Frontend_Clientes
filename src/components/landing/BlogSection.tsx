"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BlogSection() {
  const t = useTranslations("blog");

  const posts = t.raw("items") as {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
  }[];

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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
            {t("title")}
          </h2>

          <p className="text-xl text-gray-600">{t("description")}</p>
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
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
