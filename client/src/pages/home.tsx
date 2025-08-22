import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesGrid from "@/components/services-grid";
import EMICalculator from "@/components/emi-calculator";
import LoginPortals from "@/components/login-portals";
import DocumentsSection from "@/components/documents-section";
import DSAPartnership from "@/components/dsa-partnership";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicesGrid />
      <EMICalculator />
      <LoginPortals />
      <DocumentsSection />
      <DSAPartnership />
      <ContactSection />
      <Footer />
    </div>
  );
}
