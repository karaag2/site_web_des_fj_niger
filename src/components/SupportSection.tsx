"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function SupportSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const ctx = gsap.context(() => {
      // Scale up text on scroll
      gsap.set(text, { scale: 0.7, opacity: 0.3 });
      gsap.to(text, {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Content reveal
      const reveals = section.querySelectorAll(".support-reveal");
      gsap.set(reveals, { y: 30, opacity: 0 });
      gsap.to(reveals, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="soutenir"
      className="relative py-24 md:py-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--vert-menthe), #2a9a85, #1f8a75)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "var(--jaune-solaire)" }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-8"
        style={{ background: "white", opacity: 0.06 }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 text-center">
        <h2
          ref={textRef}
          className="text-display-lg text-white mb-8"
          style={{
            textShadow: "0 4px 30px rgba(0,0,0,0.15)",
          }}
        >
          REJOINDRE
        </h2>

        <p className="support-reveal text-white/80 text-xl max-w-2xl mx-auto mb-12 font-body leading-relaxed">
          Chaque talent, chaque prière, chaque engagement est une semence 
          de joie. Rejoignez les Fabricants de Joie et participez à 
          l'œuvre de Dieu au Niger — pour que chaque enfant, chaque 
          famille connaisse Son amour.
        </p>

        <div className="support-reveal flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[var(--vert-menthe)] font-display font-semibold text-lg rounded-[var(--radius-sm)] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
          >
            <Heart size={20} />
            S'engager maintenant
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-display font-semibold text-lg rounded-[var(--radius-sm)] transition-all duration-300 hover:bg-white/10 hover:border-white/60"
          >
            Devenir partenaire
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Trust badges */}
        <div className="support-reveal mt-16 flex flex-wrap justify-center gap-8 text-white/50 text-sm">
          <span>✓ Dons sécurisés</span>
          <span>✓ Reçu fiscal disponible</span>
          <span>✓ Transparence financière</span>
        </div>
      </div>
    </section>
  );
}
