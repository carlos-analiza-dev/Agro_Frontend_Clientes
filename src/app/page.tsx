"use client";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import BlogSection from "@/components/landing/BlogSection";
import CoverageSection from "@/components/landing/CoverageSection";
import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";

export default function LoginPage() {
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
