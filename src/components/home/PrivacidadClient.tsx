"use client";

import { Lock, Eye, Database, Mail, ShieldCheck } from "lucide-react";

export default function PrivacidadClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 1 de enero de 2024
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <section>
                <p className="text-gray-700 leading-relaxed">
                  En El Sembrador, valoramos tu privacidad y nos comprometemos a
                  proteger tus datos personales. Esta política explica cómo
                  recopilamos, usamos y protegemos tu información.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Información que Recopilamos
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Podemos recopilar la siguiente información:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Nombre completo y datos de contacto</li>
                  <li>Dirección de envío y facturación</li>
                  <li>Información de pago (procesada de forma segura)</li>
                  <li>Historial de compras y preferencias</li>
                  <li>Ubicación geográfica (con tu consentimiento)</li>
                  <li>Datos de navegación y uso del sitio</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Uso de la Información
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Procesar tus pedidos y entregas</li>
                  <li>Mejorar nuestros productos y servicios</li>
                  <li>
                    Enviar actualizaciones y promociones (con tu consentimiento)
                  </li>
                  <li>Personalizar tu experiencia de compra</li>
                  <li>Prevenir fraudes y garantizar la seguridad</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Seguridad de los Datos
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas
                  para proteger tu información contra accesos no autorizados,
                  alteración, divulgación o destrucción. Utilizamos cifrado SSL
                  para proteger las transacciones en línea.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Comunicaciones
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Podemos enviarte correos electrónicos relacionados con tus
                  pedidos, actualizaciones de servicio y, con tu consentimiento,
                  promociones y novedades. Puedes darte de baja de las
                  comunicaciones de marketing en cualquier momento.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Compartir Información
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  No vendemos, alquilamos ni compartimos tu información personal
                  con terceros para sus propios fines de marketing. Podemos
                  compartir información con:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                  <li>Proveedores de servicios (envíos, pagos, etc.)</li>
                  <li>Autoridades cuando sea requerido por ley</li>
                  <li>Con tu consentimiento explícito</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Tus Derechos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Acceder a tus datos personales</li>
                  <li>Rectificar información incorrecta</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de datos</li>
                  <li>Retirar tu consentimiento en cualquier momento</li>
                </ul>
              </section>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ejercer tus derechos
                </h3>
                <p className="text-gray-600 mb-4">
                  Para ejercer cualquiera de tus derechos o para preguntas sobre
                  privacidad, contáctanos:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    📧 <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacidad@elsembrador.com"
                      className="text-green-600 hover:underline"
                    >
                      privacidad@elsembrador.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    📞 <strong>Teléfono:</strong> +57 300 123 4567
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
