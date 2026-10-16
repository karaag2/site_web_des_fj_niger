import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import SideNav from "@/components/SideNav";
import TopNav from "@/components/TopNav";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import ContactHero from "@/components/ContactHero";
import ContactFormSection from "@/components/ContactFormSection";

export const metadata = {
  title: "Contactez Les Fabricants de Joie | Niger",
  description: "Entrez en contact avec Les Fabricants de Joie du Niger. Bâtissons ensemble un avenir rempli de joie pour la jeunesse nigérienne.",
};

export default function ContactPage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <SideNav />
      <TopNav />
      <FloatingCTA />

      <main className="md:pl-16 transition-[padding] duration-700 ease-out">
        <ContactHero />
        <ContactFormSection />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
