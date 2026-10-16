"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function LookbookSection() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {

      // 1. Text Animation for Title (SplitText)
      const splitTitle = new SplitText(titleRef.current, { type: "words,chars" });
      gsap.fromTo(splitTitle.chars,
        { yPercent: 100, opacity: 0, rotationZ: 5 },
        {
          yPercent: 0,
          opacity: 1,
          rotationZ: 0,
          duration: 1,
          stagger: 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );

      mm.add("(min-width: 1024px)", () => {
        // 2. Horizontal Scroll Pin (Desktop only)
        const scrollWidth = scrollContainerRef.current?.scrollWidth || 0;
        const windowWidth = window.innerWidth;
        const amountToScroll = scrollWidth - windowWidth + 200; // Extra padding

        gsap.to(scrollContainerRef.current, {
          x: -amountToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1.2, // Smoother drag
            start: "center center",
            end: () => `+=${amountToScroll}`,
          },
        });

        // 3. Velocity-based Skew with clamp (Desktop only)
        let proxy = { skew: 0 };
        let skewSetter = gsap.quickSetter(cardsRef.current, "skewX", "deg");
        let clamp = gsap.utils.clamp(-10, 10); // Subtle slant is more premium

        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            let skew = clamp(velocity / -250);

            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 1,
                ease: "power3.out",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      });

      return () => splitTitle.revert();
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="lookbook" ref={containerRef} className="py-20 lg:py-32 bg-surface overflow-hidden lg:cursor-ew-resize relative">

      {/* === Background Decoration Layer === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Unified Textures */}
        <div className="absolute inset-0 texture-paper opacity-40 mix-blend-multiply"></div>
        <div className="absolute inset-0 texture-grid opacity-20 mask-radial"></div>

        {/* Diagonal sweeping cuts */}
        <svg width="100%" height="100%" viewBox="0 0 1400 600" fill="none" preserveAspectRatio="none" className="absolute inset-0 opacity-[0.05]">
          <path d="M0,100 Q700,0 1400,100" stroke="currentColor" strokeWidth="1" strokeDasharray="6 10" />
          <path d="M0,300 Q700,500 1400,300" stroke="var(--color-primary)" strokeWidth="0.5" />
          <path d="M0,500 Q700,400 1400,500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
        </svg>

        {/* Ghost watermark */}
        <span className="font-epilogue text-[18vw] font-black uppercase text-on-surface/[0.015] absolute -right-[5%] top-[10%] leading-none whitespace-nowrap">
          LOOKBOOK
        </span>

        {/* Floating Orbs */}
        <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full mix-blend-screen animate-float-slow"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full mix-blend-screen animate-float-slower"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mb-10 md:mb-20 lg:pl-32 pointer-events-none relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-primary"></div>
          <span className="font-space-grotesk text-primary font-bold uppercase tracking-widest text-sm">
            Notre Appel en Images
          </span>
        </div>
        <h3 ref={titleRef} className="font-epilogue text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-tighter max-w-3xl overflow-hidden leading-[1.1]">
          La foi en{" "}
          <span className="font-epilogue text-secondary italic font-black">action.</span>
        </h3>
      </div>

      <div ref={scrollContainerRef} className="flex overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-6 md:gap-16 px-6 md:px-12 pb-12 lg:pb-24 no-scrollbar w-full lg:w-max lg:pl-32 will-change-transform z-10 relative touch-pan-x">

        {/* Card 1: Enfants */}
        <div ref={addToCardsRef} className="flex-shrink-0 snap-center lg:snap-align-none w-[82vw] sm:w-[65vw] md:w-[450px] lg:w-[550px] relative group will-change-transform origin-bottom">
          <div className="aspect-[4/5] overflow-hidden bg-surface-variant cursor-pointer border border-on-surface/5" data-cursor-text="Explorer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              alt="Art workshop for children in Niger, messy paint, bright colors, focused joyful faces"
              src="/images/joy.webp"
            />
          </div>

          {/* Rotating SVG Stamp */}
          <div className="absolute -top-12 -right-12 w-32 h-32 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out z-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite] drop-shadow-lg text-primary fill-current">
              <path id="circlePath1" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="14" fontWeight="black" letterSpacing="4" className="uppercase font-epilogue">
                <textPath href="#circlePath1" startOffset="0%">• ENFANTS • ENFANTS • ENFANTS </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-black text-2xl">✺</div>
          </div>

          <div className="mt-8 flex gap-6">
            <span className="font-space-grotesk text-xs tracking-widest text-on-surface/30">01</span>
            <div>
              <h4 className="font-epilogue text-4xl font-bold uppercase group-hover:text-primary transition-colors duration-500">
                Foi & Éveil
              </h4>
              <p className="font-inter text-on-surface-variant max-w-sm mt-4 leading-relaxed group-hover:text-on-surface transition-colors duration-500">
                Éveiller les enfants à la foi et à leurs dons à travers des camps, des ateliers créatifs et la découverte de l'amour de Dieu.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Familles */}
        <div ref={addToCardsRef} className="flex-shrink-0 snap-center lg:snap-align-none w-[82vw] sm:w-[65vw] md:w-[450px] lg:w-[550px] relative group lg:translate-y-24 will-change-transform origin-bottom">
          <div className="aspect-[4/5] overflow-hidden bg-surface-variant cursor-pointer border border-on-surface/5" data-cursor-text="Explorer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              alt="Community gathering under a large acacia tree, warm communal atmosphere"
              src="/images/learn.webp"
            />
          </div>

          {/* Rotating SVG Stamp */}
          <div className="absolute -top-12 -right-12 w-32 h-32 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out z-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite] drop-shadow-lg text-secondary fill-current">
              <path id="circlePath2" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="14" fontWeight="black" letterSpacing="4" className="uppercase font-epilogue">
                <textPath href="#circlePath2" startOffset="0%">• FAMILLES • FAMILLES • FAMILLES </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-secondary font-black text-2xl">✦</div>
          </div>

          <div className="mt-8 flex gap-6">
            <span className="font-space-grotesk text-xs tracking-widest text-on-surface/30">02</span>
            <div>
              <h4 className="font-epilogue text-4xl font-bold uppercase group-hover:text-secondary transition-colors duration-500">
                Familles de Foi
              </h4>
              <p className="font-inter text-on-surface-variant max-w-sm mt-4 leading-relaxed group-hover:text-on-surface transition-colors duration-500">
                Accompagner les familles dans une vie de foi partagée, où chaque génération grandit ensemble dans la connaissance de Dieu.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Formations */}
        <div ref={addToCardsRef} className="flex-shrink-0 snap-center lg:snap-align-none w-[82vw] sm:w-[65vw] md:w-[450px] lg:w-[550px] relative group will-change-transform origin-bottom">
          <div className="aspect-[4/5] overflow-hidden bg-surface-variant cursor-pointer border border-on-surface/5" data-cursor-text="Explorer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              alt="Young artisan working with copper and wood, traditional tools, modern design"
              src="/images/story-1.webp"
            />
          </div>

          {/* Rotating SVG Stamp */}
          <div className="absolute -top-12 -right-12 w-32 h-32 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out z-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite] drop-shadow-lg text-tertiary fill-current">
              <path id="circlePath3" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="14" fontWeight="black" letterSpacing="4" className="uppercase font-epilogue">
                <textPath href="#circlePath3" startOffset="0%">• FORMATIONS • FORMATIONS • </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-tertiary font-black text-2xl">✷</div>
          </div>

          <div className="mt-8 flex gap-6">
            <span className="font-space-grotesk text-xs tracking-widest text-on-surface/30">03</span>
            <div>
              <h4 className="font-epilogue text-4xl font-bold uppercase group-hover:text-tertiary transition-colors duration-500">
                Formation & Envoi
              </h4>
              <p className="font-inter text-on-surface-variant max-w-sm mt-4 leading-relaxed group-hover:text-on-surface transition-colors duration-500">
                Former de jeunes leaders chrétiens, équipés pour servir leurs communautés et témoigner de l'Évangile avec créativité et audace.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
