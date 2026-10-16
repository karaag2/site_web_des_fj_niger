"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HistorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const watermarkBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Draw SVG Path based on scroll (The "Thread of History" / Curved Line)
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      }

      // 2. Parallax Watermark Text (Huge Background Typography)
      gsap.to(watermarkBgRef.current, {
        y: -300,
        x: -200,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // 3. Progressive revelation of content blocks
      contentRefs.current.forEach((el, index) => {
        if (!el) return;

        // Directional drift based on index
        const isLeft = index % 2 === 0;

        gsap.fromTo(el,
          {
            y: 150,
            x: isLeft ? -50 : 50,
            opacity: 0,
            rotation: isLeft ? -5 : 5,
          },
          {
            y: 0,
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="histoire" ref={containerRef} className="relative w-full bg-surface-container-lowest text-on-surface py-40 overflow-hidden">

      {/* === Background Decoration Layer === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Physical Paper Texture */}
        <div className="absolute inset-0 texture-paper opacity-30 z-0"></div>
        {/* Blueprint Grid Texture fading out via mask */}
        <div className="absolute inset-0 texture-grid opacity-50 z-0"></div>

        {/* Topographic SVG curves - Enhanced detail */}
        <svg width="100%" height="100%" viewBox="0 0 1400 2000" fill="none" preserveAspectRatio="none" className="absolute inset-0 opacity-[0.08] z-10">
          {/* Main flow lines */}
          <path d="M-50,300 C300,100 600,500 900,300 C1200,100 1400,400 1500,300" stroke="currentColor" strokeWidth="1" strokeDasharray="6 12" />
          <path d="M-50,800 C200,600 500,1000 800,800 C1100,600 1300,900 1500,800" stroke="currentColor" strokeWidth="0.5" />
          <path d="M-50,1300 C300,1100 600,1500 900,1300 C1200,1100 1400,1400 1500,1300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 10" />

          {/* Complex contour lines */}
          <path d="M100,0 C200,400 800,800 1400,600" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" />
          <path d="M300,0 C600,500 1000,900 1500,1100" stroke="currentColor" strokeWidth="0.2" />

          {/* Orbital circles & Time markers */}
          <circle cx="250" cy="500" r="180" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 8" />
          <circle cx="250" cy="500" r="240" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 10" />
          <circle cx="1150" cy="1000" r="220" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 8" />
          <circle cx="1150" cy="1000" r="300" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 12" />

          <line x1="200" y1="450" x2="300" y2="550" stroke="currentColor" strokeWidth="0.5" />
          <line x1="1100" y1="950" x2="1200" y2="1050" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {/* Scattered filigrane dots with precise micro-animations */}
        <div className="absolute top-[8%] right-[15%] w-2 h-2 rounded-full bg-primary/40 animate-pulse z-10"></div>
        <div className="absolute top-[30%] left-[5%] w-1.5 h-1.5 rounded-full bg-secondary/35 animate-float-slow z-10"></div>
        <div className="absolute top-[55%] right-[8%] w-1 h-1 rounded-full bg-tertiary/45 animate-float-slower z-10"></div>
        <div className="absolute top-[75%] left-[20%] w-3 h-3 rounded-full bg-primary-container/35 animate-pulse z-10"></div>
        <div className="absolute bottom-[10%] right-[25%] w-2 h-2 rounded-full bg-secondary/30 animate-float-slow z-10"></div>
        <div className="absolute top-[40%] right-[30%] w-[1px] h-[1px] rounded-full bg-on-surface/40 z-10"></div>

        {/* Precision Crosshairs / Registration marks */}
        <div className="absolute top-[12%] left-[25%] w-4 h-4 text-on-surface/[0.2] text-xs z-10">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
        </div>
        <div className="absolute top-[45%] right-[12%] w-6 h-6 text-on-surface/[0.2] text-xs z-10">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
          <div className="absolute top-0 left-0 w-1 h-1 bg-current"></div>
        </div>
        <div className="absolute bottom-[25%] left-[10%] w-5 h-5 text-on-surface/[0.2] text-xs z-10">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current border-t border-dashed"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current border-l border-dashed"></div>
        </div>
        <div className="absolute bottom-[15%] right-[50%] text-on-surface/[0.15] text-xl select-none animate-spin-slow z-10">✦</div>

        {/* Micro typographic watermarks */}
        <div className="absolute top-[20%] right-[5%] font-space-grotesk text-[9px] uppercase tracking-[0.4em] text-on-surface/30 rotate-90 origin-right z-10">
          CHRONOLOGIE — 1976
        </div>
        <div className="absolute bottom-[30%] left-[5%] font-space-grotesk text-[9px] uppercase tracking-[0.4em] text-on-surface/30 -rotate-90 origin-left z-10">
          EVOLUTION
        </div>
      </div>

      {/* Background Watermark Element (Awwwards Style Layering) */}
      <div
        ref={watermarkBgRef}
        className="absolute top-0 left-0 w-full pointer-events-none opacity-[0.03] flex whitespace-nowrap"
      >
        <span className="font-epilogue text-[40vw] font-black uppercase leading-none text-primary">
          ORIGINES
        </span>
      </div>

      <div className="container mx-auto px-4 md:px-10 lg:px-32 relative z-10 w-full">

        <div className="text-center mb-40">
          <span className="font-space-grotesk text-sm uppercase tracking-[0.3em] font-bold text-primary mb-6 block">
            Notre Héritage de Foi
          </span>
          <h2 className="font-epilogue text-5xl md:text-8xl font-black uppercase tracking-tighter" data-cursor-text="Générations">
            Une Histoire<br />de Fidélité
          </h2>
        </div>

        {/* The Graphic Thread - SOTD Flow Element */}
        <div className="absolute left-[50%] top-[5%] bottom-[5%] w-[80%] lg:w-[50%] -translate-x-[50%] pointer-events-none hidden lg:block z-0">
          <svg viewBox="0 0 100 100" fill="none" preserveAspectRatio="none" className="w-full h-full opacity-80">
            <defs>
              <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
                <stop offset="10%" stopColor="var(--color-primary)" stopOpacity="1" />
                <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="1" />
                <stop offset="90%" stopColor="var(--color-primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Guide track (background line) */}
            <path
              d="M 50 0 C 90 10, 90 25, 50 33 C 10 45, 10 55, 50 66 C 90 80, 90 90, 50 100"
              stroke="var(--color-on-surface)"
              strokeWidth="2"
              strokeOpacity="0.05"
              strokeDasharray="4 8"
              vectorEffect="non-scaling-stroke"
            />

            {/* Animated drawing line */}
            <path
              ref={pathRef}
              d="M 50 0 C 90 10, 90 25, 50 33 C 10 45, 10 55, 50 66 C 90 80, 90 90, 50 100"
              stroke="url(#historyGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0px 0px 10px rgba(255, 127, 63, 0.4))' }}
            />
          </svg>
        </div>

        {/* --- Story Milestones --- */}
        <div className="relative z-10 w-full flex flex-col gap-40 lg:gap-60 mt-20">

          {/* Charm Element: Floating organic sun/star */}
          <div className="absolute top-10 left-[15%] text-primary/30 text-3xl animate-spin-slow select-none">✺</div>

          {/* Charm Element: Connecting bezier curve */}
          <svg className="absolute top-[20%] right-[10%] w-[300px] h-[300px] pointer-events-none opacity-[0.1]" viewBox="0 0 300 300">
            <path d="M0,150 C100,50 200,250 300,150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="300" cy="150" r="4" fill="none" stroke="currentColor" />
          </svg>

          {/* 1976: Hawaii */}
          <div
            ref={(el) => { contentRefs.current[0] = el; }}
            className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 justify-start relative"
          >
            {/* Charm Element: Elegant side text */}
            <div className="absolute -top-6 left-[10%] text-on-surface/[0.15] font-space-grotesk text-sm tracking-widest uppercase">
              Chapitre Un
            </div>

            <div className="lg:w-5/12 text-right lg:pr-10 order-2 lg:order-1 relative">
              <h3 className="font-epilogue text-7xl font-black text-on-surface/10 absolute -z-10 -translate-y-8 translate-x-12 select-none">1976</h3>
              <h4 className="font-epilogue text-3xl font-bold uppercase mb-4 text-on-surface">Les Enfants du Roi</h4>
              <p className="font-inter text-on-surface-variant text-lg leading-relaxed">
                Au sein de Jeunesse en Mission (YWAM), Dale et Carol Kauffman lancent « King's Kids » — les Enfants du Roi. Leur conviction est révolutionnaire : les enfants ne sont pas seulement destinataires de l'Évangile, ils en sont les porteurs. Une première comédie musicale rassemble des jeunes du monde entier pour témoigner de leur foi par l'art.
              </p>
            </div>
            <div className="lg:w-4/12 order-1 lg:order-2 relative">
              <div className="aspect-[4/5] bg-surface-container overflow-hidden rotate-2 shadow-xl hover:rotate-0 transition-transform duration-700 ease-out z-10 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/history-1.webp" alt="Vintage kids playing" className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-105" />
              </div>
              {/* Soft decorative frame */}
              <div className="absolute -inset-6 border border-on-surface/[0.05] rounded-tl-[100px] z-0 pointer-events-none"></div>
            </div>
          </div>

          {/* Charm Element: Floating sparkles */}
          <div className="absolute top-[45%] left-[25%] flex items-center justify-center opacity-40 select-none z-0">
            <span className="text-secondary animate-pulse text-xl">✨</span>
          </div>

          {/* 1984: Europe */}
          <div
            ref={(el) => { contentRefs.current[1] = el; }}
            className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 justify-end relative"
          >
            {/* Charm Element: Elegant typography */}
            <div className="absolute -top-6 right-[15%] text-on-surface/[0.15] font-space-grotesk text-sm tracking-widest uppercase">
              L'Évolution
            </div>

            <div className="lg:w-4/12 relative">
              <div className="aspect-[4/5] bg-surface-container overflow-hidden -rotate-3 shadow-xl hover:-rotate-1 transition-transform duration-700 ease-out z-10 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/history-2.webp" alt="Music production" className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-105" />
              </div>
              {/* Soft decorative frame */}
              <div className="absolute -inset-6 border border-on-surface/[0.05] rounded-br-[100px] z-0 pointer-events-none"></div>
            </div>
            <div className="lg:w-5/12 text-left lg:pl-10 relative">
              <h3 className="font-epilogue text-7xl font-black text-on-surface/10 absolute -z-10 -translate-y-8 -translate-x-6 select-none">1984</h3>
              <h4 className="font-epilogue text-3xl font-bold uppercase mb-4 text-on-surface">La Joie Francophone</h4>
              <p className="font-inter text-on-surface-variant text-lg leading-relaxed">
                Le mouvement traverse l'Atlantique et s'enracine en Suisse, où il devient « Les Fabricants de Joie ». Des productions musicales portées par la foi marquent toute une génération de jeunes chrétiens francophones. L'art devient le langage de la louange et du témoignage.
              </p>
            </div>
          </div>

          {/* Charm Element: Soft organic rings flowing to Niger */}
          <div className="absolute top-[70%] right-[30%] w-40 h-40 border border-primary/[0.15] rounded-full opacity-60"></div>
          <div className="absolute top-[72%] right-[32%] w-40 h-40 border border-secondary/[0.1] rounded-full opacity-60 pointer-events-none"></div>

          {/* Present: Niger */}
          <div
            ref={(el) => { contentRefs.current[2] = el; }}
            className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 justify-start relative"
          >
            {/* Charm Element: Minimal crosshair in space */}
            <div className="absolute top-0 left-[45%] text-primary/40 font-light select-none">＋</div>

            <div className="absolute -top-6 left-[10%] text-on-surface/[0.15] font-space-grotesk text-sm tracking-widest uppercase">
              Aujourd'hui
            </div>

            <div className="lg:w-5/12 text-right lg:pr-10 order-2 lg:order-1 relative">
              <h3 className="font-epilogue text-8xl font-black text-primary/10 absolute -z-10 -translate-y-8 translate-x-8 select-none">NIGER</h3>
              <h4 className="font-epilogue text-4xl font-bold uppercase mb-4 text-primary">La Mission au Sahel</h4>
              <p className="font-inter text-on-surface-variant text-lg leading-relaxed">
                Aujourd'hui, le cœur bat au Niger. Des centaines d'équipes ont porté l'Évangile à travers l'Afrique avec joie et créativité. Ici, la mission prend racine : les Fabricants de Joie accompagnent enfants, jeunes et familles dans une rencontre vivante avec Dieu, au cœur du Sahel.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-8 relative overflow-hidden group border border-on-surface/20 px-8 py-4 font-space-grotesk font-bold text-sm tracking-widest uppercase hover:text-white transition-colors duration-500 rounded-[20px] rounded-br-[0px]"
              >
                <span className="relative z-10">Rejoindre la mission</span>
                <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
              </Link>
            </div>
            <div className="lg:w-4/12 order-1 lg:order-2 relative">
              <div className="aspect-[4/5] bg-surface-container overflow-hidden rotate-1 shadow-xl hover:rotate-2 transition-transform duration-700 ease-out z-10 relative">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/famille.webp" alt="Children in Niger" className="w-full h-full object-cover contrast-125 transition-transform duration-[2s] hover:scale-105" />
              </div>
              {/* Soft decorative frame */}
              <div className="absolute -inset-6 border border-on-surface/[0.05] rounded-[40px] z-0 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
