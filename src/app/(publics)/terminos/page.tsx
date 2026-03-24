"use client";

import { Calendar, FileText, Scale, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 1 de enero de 2024
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Aceptación de los Términos
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Al acceder y utilizar el sitio web de El Sembrador, usted
                  acepta cumplir con estos términos y condiciones. Si no está de
                  acuerdo con alguna parte de estos términos, no debe utilizar
                  nuestros servicios.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Uso del Sitio
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El Sembrador proporciona información sobre productos
                  agropecuarios, servicios veterinarios y herramientas
                  agrícolas. Usted se compromete a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>No utilizar el sitio para fines ilegales</li>
                  <li>No interferir con la seguridad del sitio</li>
                  <li>
                    No intentar acceder a áreas restringidas sin autorización
                  </li>
                  <li>
                    Proporcionar información veraz y actualizada cuando sea
                    requerida
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Productos y Servicios
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nuestros productos y servicios están sujetos a disponibilidad.
                  Nos reservamos el derecho de:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Modificar precios sin previo aviso</li>
                  <li>Limitar cantidades de productos</li>
                  <li>Descontinuar productos en cualquier momento</li>
                  <li>Rechazar pedidos a nuestra discreción</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Envíos y Entregas
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Los tiempos de entrega son estimados y pueden variar según la
                  ubicación. El Sembrador no se hace responsable por retrasos
                  causados por terceros o casos de fuerza mayor. Los costos de
                  envío se calculan automáticamente al momento de realizar el
                  pedido.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Propiedad Intelectual
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Todo el contenido del sitio, incluyendo textos, imágenes,
                  logotipos y gráficos, es propiedad de El Sembrador y está
                  protegido por las leyes de propiedad intelectual. No está
                  permitida la reproducción, distribución o modificación sin
                  autorización expresa.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Limitación de Responsabilidad
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  El Sembrador no será responsable por daños indirectos,
                  incidentales o consecuentes derivados del uso o la incapacidad
                  de usar nuestros productos o servicios. Nuestra
                  responsabilidad máxima se limita al monto pagado por los
                  productos adquiridos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Modificaciones
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos en
                  cualquier momento. Los cambios entrarán en vigor
                  inmediatamente después de su publicación en el sitio. Se
                  recomienda revisar periódicamente los términos actualizados.
                </p>
              </section>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Tienes preguntas?
                </h3>
                <p className="text-gray-600 mb-4">
                  Si tienes alguna pregunta sobre estos términos, contáctanos:
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Contactar a soporte
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
