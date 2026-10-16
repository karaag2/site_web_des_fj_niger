"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ManifestoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {

      // Ambient background bloom (independent of scroll)
      gsap.to(bloomRef.current, {
        scale: 1.2,
        opacity: 0.5,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      // Desktop: Pinned scrollytelling (>= 1024px)
      mm.add("(min-width: 1024px)", () => {
        const split = new SplitText(textRef.current, { 
          type: "words,chars",
          wordsClass: "overflow-hidden inline-block mr-[0.25em] align-top pb-1"
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
          }
        });

        tl.fromTo(split.chars,
          { 
            yPercent: 120, 
            opacity: 0, 
            rotationZ: () => gsap.utils.random(-15, 15), 
            scale: 0.8,
            transformOrigin: 'top left' 
          },
          {
            yPercent: 0,
            opacity: 1,
            rotationZ: 0,
            scale: 1,
            ease: "power2.out",
            duration: 1,
            stagger: 0.1,
          }
        );

        tl.fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: "none",
            duration: 2,
          },
          "-=1"
        );

        return () => split.revert();
      });

      // Mobile: Smooth unpinned entrance without URL bar resize jank (< 1024px)
      mm.add("(max-width: 1023px)", () => {
        const split = new SplitText(textRef.current, { 
          type: "words",
          wordsClass: "overflow-hidden inline-block mr-[0.25em] align-top pb-1"
        });

        gsap.fromTo(split.words,
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.8,
            stagger: 0.02,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );

        gsap.fromTo(lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 95%",
            }
          }
        );

        return () => split.revert();
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="manifeste" ref={containerRef} className="relative min-h-screen py-24 lg:py-0 bg-surface overflow-hidden flex items-center justify-center">
      
      {/* Background decoration layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Deep ambient bloom */}
        <div ref={bloomRef} className="absolute w-[60vw] h-[60vw] bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>

        {/* Paper & Dots Overlay */}
        <div className="absolute inset-0 texture-paper opacity-40 mix-blend-multiply"></div>
        <div className="absolute inset-0 texture-dots opacity-20 mask-radial"></div>

        {/* Charm Elements: Constellation / Organic lines */}
        <svg width="100%" height="100%" viewBox="0 0 1400 800" fill="none" className="absolute inset-0 opacity-[0.15]">
          <path d="M-100,500 C400,700 800,100 1500,300" stroke="url(#manifestoLineGrad)" strokeWidth="1" strokeDasharray="4 8" />
          <path d="M-100,500 C400,700 800,100 1500,300" stroke="var(--color-primary)" strokeWidth="0.5" />
          
          <circle cx="200" cy="540" r="3" fill="var(--color-secondary)" />
          <circle cx="800" cy="190" r="2" fill="var(--color-primary)" />
          <circle cx="1200" cy="245" r="4" fill="none" stroke="var(--color-secondary)" strokeWidth="1" />
          
          <defs>
            <linearGradient id="manifestoLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Charm Element: Rotating Sun */}
        <div className="absolute top-[15%] right-[15%] text-primary/20 text-6xl animate-spin-slow select-none">✺</div>
        <div className="absolute bottom-[10%] left-[10%] text-secondary/30 text-3xl animate-float-slow select-none">✦</div>

        {/* Huge transparent typography background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-epilogue font-black text-on-surface/[0.02] select-none whitespace-nowrap hidden md:block mix-blend-overlay">
          VISION
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-20 lg:px-40 relative z-10 max-w-6xl text-center">
        
        {/* Micro-header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-20">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-primary"></div>
          <span className="font-space-grotesk text-xs uppercase tracking-[0.5em] text-primary font-bold">
            Le Manifeste
          </span>
        </div>

        {/* Kinetic Quote Native Render (ready for SplitText) */}
        <p ref={textRef} className="text-4xl md:text-5xl lg:text-7xl font-epilogue font-bold leading-[1.25] tracking-tight text-on-surface">
          Nous croyons en un Dieu qui fait de chaque vie un chef-d'œuvre. Chaque enfant porte en lui une <span className="font-epilogue text-primary italic font-black tracking-normal">joie sacrée</span>. Chaque famille est appelée à la découvrir. Notre mission : <span className="font-space-grotesk text-secondary uppercase tracking-widest text-[0.8em] pb-2 border-b-2 border-secondary/50">connaître Dieu et le faire connaître</span>.
        </p>

        {/* Animated closing element */}
        <div className="mt-20 flex flex-col items-center">
          <div ref={lineRef} className="w-64 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent origin-center will-change-transform"></div>
          <p className="font-space-grotesk text-on-surface-variant text-sm mt-8 tracking-[0.2em] uppercase">
            EST. 1976 / <span className="text-primary font-bold">Jeunesse en Mission</span>
          </p>
        </div>

      </div>
    </section>
  );
}
