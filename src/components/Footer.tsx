"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Footer() {
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const rejoindreRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scroll Parallax for massive background text
      gsap.fromTo(
        bgTextRef.current,
        { y: -150, opacity: 0.05 },
        {
          y: 100,
          opacity: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 2. SplitText Animation for "REJOINDRE"
      const splitRejoindre = new SplitText(rejoindreRef.current, { type: "chars" });
      gsap.fromTo(
        splitRejoindre.chars,
        { yPercent: 100, opacity: 0, rotationX: -90, transformOrigin: "0% 50% -50" },
        {
          yPercent: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // 3. Mouse Tracking for the huge background text
      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 2;
        const yPos = (clientY / window.innerHeight - 0.5) * 2;

        gsap.to(bgTextRef.current, {
          x: -xPos * 60,
          y: -yPos * 30, // Offset lissé absolu (évite l'accumulation infinie)
          duration: 2,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", onMouseMove);

      return () => {
        splitRejoindre.revert();
        window.removeEventListener("mousemove", onMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full min-h-[850px] flex flex-col justify-end bg-inverse-surface text-inverse-on-surface px-6 md:px-10 pb-20 pt-40 lg:pl-32 overflow-hidden selection:bg-primary selection:text-on-primary">
      
      {/* Unified Texture Layer */}
      <div className="absolute inset-0 texture-paper opacity-50 mix-blend-overlay pointer-events-none"></div>

      {/* === Topographic SVG Decoration Layer === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg width="100%" height="100%" viewBox="0 0 1400 800" fill="none" preserveAspectRatio="none" className="absolute inset-0 opacity-10">
          <path d="M-50,200 C300,50 700,350 1000,200 C1300,50 1400,300 1500,200" stroke="var(--color-primary)" strokeWidth="0.6" strokeDasharray="8 16" />
          <path d="M-50,500 C200,350 600,650 900,500 C1200,350 1400,550 1500,500" stroke="var(--color-secondary)" strokeWidth="0.4" />
          <circle cx="1200" cy="300" r="150" stroke="var(--color-primary)" strokeWidth="0.3" strokeDasharray="3 8" />
          <circle cx="200" cy="600" r="100" stroke="var(--color-secondary)" strokeWidth="0.3" strokeDasharray="4 10" />
        </svg>
        {/* Scattered filigrane dots */}
        <div className="absolute top-[12%] right-[10%] w-2 h-2 rounded-full bg-primary/20"></div>
        <div className="absolute top-[40%] left-[8%] w-1.5 h-1.5 rounded-full bg-inverse-on-surface/10"></div>
        <div className="absolute bottom-[30%] right-[30%] w-1 h-1 rounded-full bg-secondary/30"></div>
        <div className="absolute bottom-[15%] left-[45%] w-2.5 h-2.5 rounded-full bg-primary/10"></div>
        {/* Crosses */}
        <div className="absolute top-[25%] left-[20%] text-inverse-on-surface/5 text-lg select-none">+</div>
        <div className="absolute bottom-[40%] right-[15%] text-inverse-on-surface/5 text-sm select-none">✦</div>
      </div>

      {/* Massive Kinetic Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden mix-blend-soft-light">
        <span ref={bgTextRef} className="font-epilogue text-[45vw] font-black uppercase leading-none select-none text-primary will-change-transform opacity-10">
          Niger
        </span>
      </div>
      
      <div className="relative z-10 w-full text-center max-w-7xl mx-auto">
        <Link href="/contact" className="block overflow-hidden mb-20 relative mix-blend-difference group">
          <h2 
            ref={rejoindreRef}
            className="font-epilogue text-[18vw] leading-[0.8] uppercase font-black tracking-tighter text-white transition-transform duration-700 group-hover:scale-105"
            data-cursor-text="Joindre"
          >
            REJOINDRE
          </h2>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-16 text-left">
          <div className="max-w-md">
            <div className="text-inverse-on-surface font-black uppercase text-3xl md:text-4xl mb-6 font-epilogue tracking-tight">Les Fabricants</div>
            <p className="font-inter text-inverse-on-surface/60 text-lg leading-relaxed">
              Un mouvement intergénérationnel et créatif, enraciné dans Jeunesse en Mission, pour connaître Dieu et le faire connaître — au service des enfants, des jeunes et des familles du Niger.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 text-left md:text-right w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <span className="font-space-grotesk text-sm uppercase tracking-[0.2em] text-primary font-bold mb-4">
                Navigation
              </span>
              <Link className="text-inverse-on-surface/60 hover:text-primary hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/#manifeste">
                Le Manifeste
              </Link>
              <Link className="text-inverse-on-surface/60 hover:text-primary hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/#mission">
                Missions
              </Link>
              <Link className="text-primary font-bold hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/contact">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-space-grotesk text-sm uppercase tracking-[0.2em] text-secondary font-bold mb-4">
                Bureau
              </span>
              <Link className="text-inverse-on-surface/60 hover:text-secondary hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/contact">
                Mentions Légales
              </Link>
              <Link className="text-inverse-on-surface/60 hover:text-secondary hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/contact">
                Dossier de Presse
              </Link>
              <Link className="text-inverse-on-surface/60 hover:text-secondary hover:translate-x-2 md:hover:-translate-x-2 transition-all duration-300 font-inter text-lg" href="/contact">
                S'engager
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-32 pt-10 border-t border-inverse-on-surface/10 w-full flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
          <p className="font-space-grotesk text-xs uppercase tracking-widest text-inverse-on-surface/40">
            © {new Date().getFullYear()} Les Fabricants de Joie. Conçu par le vent du Sahel.
          </p>
          <div className="flex gap-12">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group relative text-inverse-on-surface hover:text-primary transition-all font-inter text-sm font-bold tracking-widest uppercase">
              <span className="relative z-10" data-cursor-text="Suivre">Instagram</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full"></span>
            </a>
            <a href="mailto:contact@fabricantsdejoie.ne" className="group relative text-inverse-on-surface hover:text-secondary transition-all font-inter text-sm font-bold tracking-widest uppercase">
              <span className="relative z-10" data-cursor-text="Écrire">Email</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-secondary transition-all duration-500 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
