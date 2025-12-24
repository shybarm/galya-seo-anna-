import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GlaucomaContentSection } from "@/components/sections/GlaucomaContentSection";
import { UpdatesSection } from "@/components/sections/UpdatesSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";
import { AllergyAssistantWidget } from "@/components/chat/AllergyAssistantWidget";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-heebo" dir="rtl">
      <SchemaMarkup pageType="home" />
      <Header />
      <main>
        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
        <AboutSection />
        <ServicesSection />
        <UpdatesSection />
        <FAQSection />
        <AppointmentSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
      <AllergyAssistantWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}
