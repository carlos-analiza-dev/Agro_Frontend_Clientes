"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Headphones, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const categories = [
  "all",
  "orders",
  "shipping",
  "payments",
  "products",
  "account",
] as const;

const categoryMap: Record<string, string> = {
  Pedidos: "orders",
  Orders: "orders",
  Envíos: "shipping",
  Shipping: "shipping",
  Pagos: "payments",
  Payments: "payments",
  Productos: "products",
  Products: "products",
  Cuenta: "account",
  Account: "account",
};

export default function FAQClient() {
  const t = useTranslations("faq");

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs = t.raw("items") as FAQItem[];

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => categoryMap[faq.category] === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h1>

            <p className="text-lg text-gray-600">{t("description")}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={`${faq.category}-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform shrink-0 ml-4 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
              <Headphones className="h-8 w-8 text-green-600" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("support.title")}
            </h3>

            <p className="text-gray-600 mb-6">{t("support.description")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {t("support.contact")}
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t("support.home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
