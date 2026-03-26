"use client";

import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";
import { FullScreenLoader } from "../generics/FullScreenLoader";
import HeroSection from "../landing/HeroSection";
import StatsSection from "../landing/StatsSection";
import ServicesSection from "../landing/ServicesSection";
import FeaturesSection from "../landing/FeaturesSection";
import CoverageSection from "../landing/CoverageSection";
import TestimonialsSection from "../landing/TestimonialsSection";
import BlogSection from "../landing/BlogSection";
import CTASection from "../landing/CTASection";

export default function HomeClient() {
  const { isChecking } = useAuthRedirect();

  if (isChecking) {
    return <FullScreenLoader />;
  }

  return (
    <main className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <CoverageSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </main>
  );
}
