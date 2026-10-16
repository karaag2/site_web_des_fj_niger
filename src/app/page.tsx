import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import SideNav from "@/components/SideNav";
import TopNav from "@/components/TopNav";
import FloatingCTA from "@/components/FloatingCTA";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import HistorySection from "@/components/HistorySection";
import MissionSection from "@/components/MissionSection";
import LookbookSection from "@/components/LookbookSection";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <SmoothScroll>
      {/* Custom Global App Elements */}
      <CustomCursor />

      {/* Navigation & Overlays */}
      <SideNav />
      <TopNav />
      <FloatingCTA />

      {/* Main SOTD Content Flow — Narrative Arc */}
      <main className="md:pl-16 transition-[padding] duration-700 ease-out">
        {/* Act 1: Le Choc — The Hook */}
        <HeroSection />

        {/* Act 2: Le Manifeste — The Emotional Pause */}
        <ManifestoSection />

        {/* Act 3: Les Origines — The Story */}
        <HistorySection />

        {/* Act 4: La Mission — Deep Scrollytelling */}
        <MissionSection />

        {/* Act 5: Les Preuves — The Lookbook */}
        <LookbookSection />
        {/* Act 6: Les Voix — The Testimonials */}
        <StoriesSection />
      </main>

      {/* Footer */}
      <Footer />
    </SmoothScroll>
  );
}
