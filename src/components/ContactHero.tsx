"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ContactHero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const fragRef = useRef<HTMLDivElement>(null);
  const frag2Ref = useRef<HTMLDivElement>(null);
  const bgShapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0, rotate: -5 },
        { y: 0, opacity: 1, rotate: -2, duration: 1.5, delay: 0.5 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=1"
        )
        .fromTo(
          fragRef.current,
          { scale: 0.8, opacity: 0, rotate: 15 },
          { scale: 1, opacity: 1, rotate: 6, duration: 1.5, ease: "back.out(1.7)" },
          "-=1.2"
        )
        .fromTo(
          frag2Ref.current,
          { scale: 0.8, opacity: 0, rotate: -15 },
          { scale: 1, opacity: 1, rotate: -8, duration: 1.5, ease: "back.out(1.7)" },
          "-=1.3"
        )
        .fromTo(
          bgShapesRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 2 },
          "-=1.5"
        );

      // Mouse parallax
      const onMouseMove = (e: MouseEvent) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(titleRef.current, {
          x: -xPos * 20,
          y: -yPos * 20,
          duration: 2,
          ease: "power2.out",
        });
        gsap.to(fragRef.current, {
          x: xPos * 40,
          y: yPos * 40,
          rotate: 6 + xPos * 4,
          duration: 2.5,
          ease: "power3.out",
        });
        gsap.to(frag2Ref.current, {
          x: xPos * -30,
          y: yPos * -30,
          rotate: -8 + xPos * -3,
          duration: 2.5,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-40 pb-20 bg-surface"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 texture-paper opacity-30 z-10"></div>
        <div className="absolute inset-0 texture-dots z-0"></div>
        
        <div ref={bgShapesRef} className="absolute inset-0 opacity-[0.15]">
          <svg width="100%" height="100%" viewBox="0 0 1400 800" fill="none" className="absolute inset-0">
            <circle cx="700" cy="400" r="300" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="4 8" />
            <path d="M-100,600 C200,400 500,800 800,600 C1100,400 1300,800 1500,600" stroke="var(--color-secondary)" strokeWidth="0.5" />
            <path d="M200,-100 C400,300 1000,500 1400,900" stroke="var(--color-tertiary)" strokeWidth="0.5" strokeDasharray="2 10" />
          </svg>
        </div>

        {/* Floating Annotations */}
        <span className="font-space-grotesk text-[15vw] font-bold text-on-surface/[0.02] absolute -left-[5%] top-[10%] leading-none pointer-events-none selection:none">
          CONTACT
        </span>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-12">
            <h1
              ref={titleRef}
              className="font-epilogue text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] font-black uppercase tracking-tighter text-primary kinetic-text will-change-transform"
            >
              Écrivons <br /> 
              <span className="text-on-surface">L'Avenir</span>
            </h1>
            
            {/* Image Fragment 1 */}
            <div 
              ref={fragRef}
              className="absolute -top-16 -right-4 md:-right-24 w-[clamp(80px,25vw,190px)] aspect-[3/4] bg-white shadow-2xl p-1.5 md:p-3 rotate-6 z-20 transition-transform duration-500 will-change-transform"
            >
              <img
                className="w-full h-full object-cover filter brightness-105"
                alt="Community work in Niger"
                src="/images/joy.webp"
              />
              <div className="absolute -bottom-2 -right-2 bg-secondary px-2 py-0.5 text-white font-space-grotesk text-[clamp(6px,1.5vw,8px)] uppercase tracking-widest shadow-lg">
                FJ-NG-JOY
              </div>
            </div>

            {/* Fragment 2 */}
            <div 
              ref={frag2Ref}
              className="absolute -bottom-12 -left-4 md:-left-24 w-[clamp(70px,20vw,220px)] aspect-square rounded-full overflow-hidden border-2 md:border-8 border-white shadow-2xl -rotate-12 z-20 transition-transform duration-500 will-change-transform hidden sm:block"
            >
              <img
                className="w-full h-full object-cover filter sepia-[0.2]"
                alt="Collective gathering"
                src="/images/story-1.webp"
              />
            </div>
          </div>

          <div ref={subtitleRef} className="max-w-2xl">
            <p className="font-inter text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8">
              Vous partagez notre vision ou souhaitez simplement nous saluer ? <br className="hidden md:block" />
              Nous sommes à votre écoute pour bâtir ensemble de nouveaux ponts de joie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
