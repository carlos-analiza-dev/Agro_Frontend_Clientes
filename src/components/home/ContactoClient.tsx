"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  User,
  HelpCircle,
} from "lucide-react";
import { CrearContactoNotificacion } from "@/api/notificaciones/accions/crear-contacto";
import { NotificationType } from "@/interfaces/enums/notificaciones.enum";

export default function ContactoClient() {
  const t = useTranslations("contact");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = t("validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = t("validation.messageRequired");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const buildTitle = () => {
      const partes = [
        `${formData.nombre} ${t("notification.contactPrefix")}`,
        `${t("notification.email")}: ${formData.email}`,
      ];

      if (formData.telefono.trim()) {
        partes.push(`${t("notification.phone")}: ${formData.telefono}`);
      }

      return partes.join(" | ");
    };

    const buildMessage = () => {
      const partes: string[] = [];

      if (formData.asunto.trim()) {
        partes.push(`${t("notification.subject")}: ${formData.asunto}`);
      }

      partes.push(`${t("notification.message")}: ${formData.mensaje}`);

      return partes.join("\n");
    };

    try {
      await CrearContactoNotificacion({
        type: NotificationType.NEW_CONTAC,
        title: buildTitle(),
        message: buildMessage(),
      });

      setIsSubmitted(true);

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });

      setErrors({});

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error al enviar el mensaje de contacto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("info.address"),
      details: t("info.addressDetails"),
      link: "https://www.google.com/maps/place/Colonia+1+de+Mayo,+Comayagua/@14.4453749,-87.6338726,17z/data=!3m1!4b1!4m6!3m5!1s0x8f6585ec2f0544b9:0x2d679854cc31e7e1!8m2!3d14.4452373!4d-87.6340619!16s%2Fg%2F1tg87qc3?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Phone,
      title: t("info.phone"),
      details: "+57 300 123 4567",
      link: "tel:+573001234567",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Mail,
      title: t("info.email"),
      details: "elsembrador@interactivecore.app",
      link: "mailto:elsembrador@interactivecore.app",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Clock,
      title: t("info.schedule"),
      details: t("info.scheduleDetails"),
      link: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/elsembrador",
      color: "hover:bg-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/elsembrador",
      color: "hover:bg-pink-600",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/elsembrador",
      color: "hover:bg-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/573001234567",
      color: "hover:bg-green-600",
      bgColor: "bg-green-500/10",
    },
  ];

  const asuntos = [
    { value: "", label: t("form.subjectPlaceholder") },
    { value: "products", label: t("form.subjects.products") },
    { value: "technical", label: t("form.subjects.technical") },
    { value: "orders", label: t("form.subjects.orders") },
    { value: "suggestions", label: t("form.subjects.suggestions") },
    { value: "other", label: t("form.subjects.other") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>

          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith("http") ? "_blank" : undefined}
                rel={
                  info.link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`${info.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <info.icon className={`h-6 w-6 ${info.color}`} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>

                    <p className="text-sm text-gray-600">{info.details}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("form.title")}
                </h2>

                <p className="text-gray-600">{t("form.description")}</p>
              </div>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />

                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {t("form.successTitle")}
                  </h3>

                  <p className="text-green-700">
                    {t("form.successDescription")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("form.name")} *
                      </label>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.nombre
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder={t("form.namePlaceholder")}
                        />
                      </div>

                      {errors.nombre && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("form.phone")}
                      </label>

                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={t("form.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form.email")} *
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={t("form.emailPlaceholder")}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form.subject")}
                    </label>

                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                      <select
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                      >
                        {asuntos.map((opcion) => (
                          <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("form.message")} *
                    </label>

                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.mensaje
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={t("form.messagePlaceholder")}
                    />

                    {errors.mensaje && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mensaje}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {t("form.submit")}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.731547620745!2d-87.63625438463906!3d14.445237287147095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6585ec2f0544b9%3A0x2d679854cc31e7e1!2sColonia%201%20de%20Mayo%2C%20Comayagua!5e0!3m2!1ses!2shn!4v1742745600000!5m2!1ses!2shn"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t("mapTitle")}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("social.title")}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {t("social.description")}
                </p>

                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.bgColor} p-3 rounded-lg transition-all hover:scale-110 ${social.color} hover:text-white`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
