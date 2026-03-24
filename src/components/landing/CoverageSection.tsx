"use client";

import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

const countries = [
  {
    name: "Guatemala",
    capital: "Ciudad de Guatemala",
    farms: 850,
    active: true,
  },
  { name: "El Salvador", capital: "San Salvador", farms: 620, active: true },
  { name: "Honduras", capital: "Tegucigalpa", farms: 780, active: true },
  { name: "Costa Rica", capital: "San José", farms: 720, active: true },
];

export default function CoverageSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Cobertura Regional
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Presentes en toda Centroamérica
          </h2>
          <p className="text-xl text-gray-600">
            Llevamos tecnología agropecuaria a productores de los 7 países
            centroamericanos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-500">{country.capital}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fincas activas:</span>
                  <span className="font-semibold text-green-600">
                    {country.farms}+
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(country.farms / 850) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <p className="text-lg text-gray-700 mb-4">
              🌎 Expandiendo nuestra presencia para servir mejor al productor
              centroamericano
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {countries.map((country) => (
                <span
                  key={country.name}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                >
                  {country.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
