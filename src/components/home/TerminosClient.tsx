"use client";

import { Calendar, FileText, Scale, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function TerminosClient() {
  const t = useTranslations("terms");

  const siteUsageItems = t.raw("sections.siteUsage.items") as string[];
  const productsItems = t.raw("sections.products.items") as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h1>

            <p className="text-lg text-gray-600">{t("lastUpdated")}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.acceptance.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.acceptance.description")}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.siteUsage.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.siteUsage.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {siteUsageItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.products.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.products.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {productsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.shipping.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.shipping.description")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.intellectualProperty.title")}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.intellectualProperty.description")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.liability.title")}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.liability.description")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.modifications.title")}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.modifications.description")}
                </p>
              </section>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("support.title")}
                </h3>

                <p className="text-gray-600 mb-4">{t("support.description")}</p>

                <Link
                  href="/contacto"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  {t("support.contact")}

                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
