// import { Link } from "react-router-dom";
// import { ArrowRight, Heart, Brain, Shield, Clock, Search, Star, Users, Video, Sparkles, CheckCircle2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import heroImg from "@/assets/hero-meditation.jpg";
import aboutYoga from "@/assets/about-yoga.jpg";
import aboutSunset from "@/assets/about-sunset.jpg";
import servicesImg from "@/assets/services-therapy.jpg";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Index() {
  return (
    <div className="min-h-screen">
      <HeroSection heroImg={heroImg} />
      <AboutSection aboutYoga={aboutYoga} aboutSunset={aboutSunset} />
      <ServicesSection servicesImg={servicesImg} />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/* <CTASection /> */}
    </div>
  );
}
