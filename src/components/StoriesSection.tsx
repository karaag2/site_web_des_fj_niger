"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoriesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax marquee
      gsap.to(".marquee-text", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Header reveal
      gsap.fromTo(textRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: textRef.current, start: "top 85%" } }
      );

      // Cards floating up at different speeds with subtle rotations
      gsap.fromTo(card1Ref.current,
        { y: 150, rotation: -6 },
        { y: -50, rotation: -2, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 } }
      );
      gsap.fromTo(card2Ref.current,
        { y: 250, rotation: 4 },
        { y: -80, rotation: 1, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 } }
      );
      gsap.fromTo(card3Ref.current,
        { y: 350, rotation: -12 },
        { y: -20, rotation: -4, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 } }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="histoires" ref={containerRef} className="py-40 lg:py-60 relative bg-surface overflow-hidden">

      {/* Background Textures */}
      <div className="absolute inset-0 texture-paper opacity-60 mix-blend-multiply pointer-events-none z-0"></div>
      <div className="absolute inset-0 texture-dots opacity-40 pointer-events-none z-0"></div>

      {/* Giant Marquee Background */}
      <div className="absolute top-[15%] left-0 w-[200vw] text-[20vw] font-epilogue font-black uppercase leading-none text-on-surface/[0.02] select-none pointer-events-none z-0 marquee-text whitespace-nowrap mix-blend-overlay">
        TÉMOIGNAGES · FOI VIVANTE · GRÂCE ·
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        {/* Section Header */}
        <div ref={textRef} className="mb-20 lg:mb-32 max-w-2xl relative">
          {/* Charm Element */}
          <div className="absolute -top-10 -left-10 text-primary/30 text-4xl animate-spin-slow select-none hidden lg:block">✺</div>

          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-primary"></span>
            <span className="font-space-grotesk text-sm uppercase tracking-[0.3em] font-bold text-primary">
              Témoignages de Foi
            </span>
          </div>
          <h2 className="font-epilogue text-[clamp(4rem,12vw,8rem)] font-black leading-[0.9] uppercase tracking-tighter text-on-surface">
            Vies <br /> Transformées
          </h2>
        </div>

        {/* Scattered Collage Layout */}
        <div className="relative w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-20 lg:gap-10 mt-10">

          {/* Story Card 1 - Vintage Portrait */}
          <div
            ref={card1Ref}
            className="w-full sm:w-[80%] lg:w-4/12 z-20 group lg:mt-32 lg:-mr-16 relative"
            data-cursor-text="LIRE"
          >
            {/* Charm Line connecting to card 2 */}
            <svg className="absolute top-[20%] -right-[60%] w-[80%] h-[100px] pointer-events-none opacity-[0.1] hidden lg:block z-0" viewBox="0 0 200 100">
              <path d="M0,50 C100,50 100,0 200,0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            </svg>

            <div className="bg-surface-container p-3 shadow-2xl relative border border-on-surface/5">
              <div className="aspect-[4/5] overflow-hidden relative">
                {/* Vintage overlay */}
                <div className="absolute inset-0 bg-primary/20 mix-blend-color-burn z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-700"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/story-unsplash-1.webp"
                  alt="Portrait of Amina"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
              </div>
              {/* Overlapping minimalist text box */}
              <div className="absolute -bottom-8 -right-4 lg:-right-12 bg-surface-container-lowest p-6 shadow-xl border border-on-surface/10 max-w-[280px] z-20">
                <span className="font-space-grotesk text-[10px] text-primary uppercase tracking-[0.2em] mb-3 block">01 / La Grâce</span>
                <h5 className="font-epilogue text-2xl font-bold leading-tight mb-2 text-on-surface">Le fil de la grâce</h5>
                <p className="font-inter text-sm text-on-surface-variant">Comment la foi d'Amina a transformé son quartier tout entier.</p>
              </div>
            </div>
          </div>

          {/* Story Card 2 - Cinematic Banner */}
          <div
            ref={card2Ref}
            className="w-full sm:w-[90%] lg:w-6/12 z-10 group lg:-mt-10"
            data-cursor-text="ÉCOUTER"
          >
            <div className="bg-surface-container-lowest p-4 lg:p-8 shadow-2xl relative border border-on-surface/[0.03]">
              <div className="aspect-[16/10] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/enfant.webp"
                  alt="Traditional Drums"
                  className="w-full h-full object-cover group-hover:scale-105 saturate-50 group-hover:saturate-125 transition-all duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center auto-pointer-events-none">
                  <div className="w-20 h-20 rounded-full border-[0.5px] border-white/40 backdrop-blur-md flex items-center justify-center text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black">
                    <span className="material-symbols-outlined ml-1 text-4xl">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div className="max-w-[80%]">
                  <span className="font-space-grotesk text-[10px] text-secondary uppercase tracking-[0.2em] mb-2 block">02 / Louange</span>
                  <h5 className="font-epilogue text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-on-surface">L'Écho de la Louange</h5>
                </div>
                <div className="w-12 h-12 rounded-full border border-on-surface/10 flex items-center justify-center text-on-surface/40 group-hover:bg-secondary group-hover:text-surface-container-lowest group-hover:border-secondary transition-colors duration-300">
                  <span className="material-symbols-outlined font-light">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story Card 3 - Polaroid Style Scattered */}
          <div
            ref={card3Ref}
            className="w-[80%] sm:w-[60%] lg:w-3/12 z-30 group lg:absolute lg:bottom-[-15%] lg:left-[35%]"
            data-cursor-text="VOIR"
          >
            <div className="bg-[#f8f9fa] dark:bg-[#e9ecef] p-4 pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative transform transition-transform duration-700 group-hover:rotate-0">
              <div className="aspect-square overflow-hidden border border-black/5">
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/cours.webp"
                  alt="Children smiling"
                  className="w-full h-full object-cover group-hover:scale-110 contrast-125 sepia-[0.3] group-hover:sepia-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute bottom-5 w-full text-center left-0 px-4">
                {/* Handwritten style font replacement simulation using Caveat or just italic serif */}
                <p className="font-space-grotesk italic text-black/70 text-sm tracking-wide">La joie de Dieu - Niamey '24</p>
              </div>
              {/* Tape piece simulation */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 backdrop-blur-sm border border-white/50 rotate-[-2deg] shadow-sm z-20"></div>
            </div>
            {/* Charm sparkle */}
            <div className="absolute -top-10 -right-10 text-secondary animate-pulse text-2xl opacity-60">✦</div>
          </div>

        </div>

        {/* Blog Button added below the collage */}
        <div className="mt-32 flex justify-center z-40 relative">
          <a
            href="/blog"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-space-grotesk text-sm font-bold uppercase tracking-[0.2em] text-on-surface transition-all hover:text-surface-container-lowest overflow-hidden border border-on-surface/20 hover:border-transparent"
          >
            <span className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] -z-10"></span>
            Découvrir tous les posts sur le blog
            <span className="material-symbols-outlined ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              arrow_right_alt
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
