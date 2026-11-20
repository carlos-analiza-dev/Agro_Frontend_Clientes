"use client";

import { useTranslations } from "next-intl";
import { Lock, Eye, Database, Mail, ShieldCheck } from "lucide-react";

export default function PrivacidadClient() {
  const t = useTranslations("privacy");

  const collectedItems = t.raw("sections.collected.items") as string[];

  const usageItems = t.raw("sections.usage.items") as string[];

  const sharingItems = t.raw("sections.sharing.items") as string[];

  const rightsItems = t.raw("sections.rights.items") as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h1>

            <p className="text-lg text-gray-600">{t("lastUpdated")}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <section>
                <p className="text-gray-700 leading-relaxed">
                  {t("introduction")}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.collected.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.collected.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {collectedItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.usage.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.usage.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {usageItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.security.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.security.description")}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("sections.communications.title")}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.communications.description")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.sharing.title")}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {t("sections.sharing.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                  {sharingItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.rights.title")}
                </h2>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.rights.description")}
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {rightsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("exerciseRights.title")}
                </h3>

                <p className="text-gray-600 mb-4">
                  {t("exerciseRights.description")}
                </p>

                <div className="space-y-2">
                  <p className="text-gray-700">
                    📧 <strong>{t("exerciseRights.emailLabel")}</strong>{" "}
                    <a
                      href={`mailto:${t("contact.email")}`}
                      className="text-green-600 hover:underline"
                    >
                      {t("contact.email")}
                    </a>
                  </p>

                  <p className="text-gray-700">
                    📞 <strong>{t("exerciseRights.phoneLabel")}</strong>{" "}
                    {t("contact.phone")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
