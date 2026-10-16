"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  const frag1Ref = useRef<HTMLDivElement>(null);
  const frag2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgShapesRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Initial hide
      gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { y: 150, opacity: 0, rotation: 10 });
      gsap.set([frag1Ref.current, frag2Ref.current], { scale: 0.8, opacity: 0 });
      gsap.set(badgeRef.current, { scale: 0, rotation: -45 });
      gsap.set(bgShapesRef.current, { opacity: 0 });
      gsap.set(scrollCueRef.current, { opacity: 0, y: 20 });

      // --- 1. Entrance "Kinetic Collage" Reveal ---
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to([text1Ref.current, text2Ref.current, text3Ref.current], {
        y: 0, opacity: 1,
        rotation: (i: number) => [-2, 1, -1][i],
        duration: 1.8, stagger: 0.15, delay: 0.2,
      })
        .to(badgeRef.current, { scale: 1, rotation: 12, duration: 1.2, ease: "elastic.out(1, 0.5)" }, "-=1.4")
        .to([frag1Ref.current, frag2Ref.current], { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2 }, "-=1.2")
        .to(bgShapesRef.current, { opacity: 1, duration: 2 }, "-=1.5")
        .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.5");

      // --- 2. Scroll Parallax (Scrubbed) ---
      gsap.to(wrapperRef.current, { y: 200, opacity: 0, scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(frag1Ref.current, { y: -300, rotation: 25, scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: 1.2 } });
      gsap.to(frag2Ref.current, { y: -100, scale: 0.8, scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: 1.5 } });
      gsap.to(bgShapesRef.current, { y: 150, rotation: 5, scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: 3 } });

      // Scroll cue bounce
      gsap.to(scrollCueRef.current, { y: 10, repeat: -1, yoyo: true, duration: 1.5, ease: "power1.inOut" });

    }, containerRef);

    // --- 3. Mouse Magnetic 3D Depth ---
    const onMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to([text1Ref.current, text2Ref.current, text3Ref.current], { x: -xPos * 30, y: -yPos * 30, duration: 1.5, ease: "power2.out", stagger: 0.05 });
      gsap.to(frag1Ref.current, { x: xPos * 60, y: yPos * 60, rotation: 6 + xPos * 5, duration: 2, ease: "power3.out" });
      gsap.to(frag2Ref.current, { x: xPos * -40, y: yPos * -40, rotation: -12 + yPos * -10, duration: 2.5, ease: "power3.out" });
      gsap.to(bgShapesRef.current, { rotation: xPos * 8, duration: 3, ease: "power1.out" });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-40 bg-surface">

      {/* === Background Decoration Layer === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Physical Paper Texture overlaying everything in BG */}
        <div className="absolute inset-0 texture-paper opacity-30 z-10"></div>
        {/* Subtle dot pattern grid */}
        <div className="absolute inset-0 texture-dots z-0"></div>

        {/* Blurred orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tertiary-container/30 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] mix-blend-multiply"></div>

        {/* Intricate Topological Lines & Orbital Curves */}
        <div ref={bgShapesRef} className="absolute inset-0 select-none will-change-transform z-10">
          <svg width="100%" height="100%" viewBox="0 0 1400 800" fill="none" className="absolute inset-0 opacity-[0.1]">
            {/* Smooth bezier flows */}
            <path d="M-100,400 C300,100 500,700 800,400 C1100,100 1300,700 1500,400" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <path d="M-100,500 C300,200 500,800 800,500 C1100,200 1300,800 1500,500" stroke="currentColor" strokeWidth="0.5" />
            <path d="M-100,300 C300,0 500,600 800,300 C1100,0 1300,600 1500,300" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100,-100 C300,300 700,500 1200,900" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 10" />
            <path d="M400,-100 C600,400 900,400 1500,700" stroke="currentColor" strokeWidth="0.25" />

            {/* Orbital concentric circles */}
            <circle cx="700" cy="400" r="250" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 6" />
            <circle cx="700" cy="400" r="350" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 6" />
            <circle cx="700" cy="400" r="450" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 12" />
            <circle cx="150" cy="150" r="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="1250" cy="650" r="150" stroke="currentColor" strokeWidth="0.2" />
          </svg>

          {/* Precision Crosshairs / Registration marks */}
          <div className="absolute top-[18%] left-[12%] w-4 h-4 text-on-surface/[0.2] text-xs">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
          </div>
          <div className="absolute top-[65%] right-[18%] w-6 h-6 text-on-surface/[0.2] text-xs">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current"></div><div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current"></div>
          </div>
          <div className="absolute bottom-[20%] left-[25%] w-3 h-3 text-on-surface/[0.2] text-xs">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div><div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
          </div>

          {/* Ghost watermarks & Typographic annotations */}
          <span className="font-space-grotesk text-[22vw] font-bold text-on-surface/[0.03] tracking-widest absolute -left-[5%] top-[15%] leading-none">
            NIAMEY
          </span>
          <span className="font-space-grotesk text-[8px] uppercase tracking-[0.4em] text-on-surface/40 absolute right-[10%] top-[30%] rotate-90 origin-right">
            FJ-NG-01 / SECTION
          </span>
          <span className="font-space-grotesk text-[8px] uppercase tracking-[0.4em] text-on-surface/40 absolute left-[5%] bottom-[35%] -rotate-90 origin-left">
            ELEVATION 235M
          </span>
        </div>

        {/* Filigrane floating dots */}
        <div className="absolute top-[10%] right-[15%] w-2 h-2 rounded-full bg-primary/40 animate-float-slow z-10"></div>
        <div className="absolute top-[25%] right-[8%] w-1 h-1 rounded-full bg-tertiary/30 animate-pulse z-10"></div>
        <div className="absolute bottom-[30%] left-[12%] w-3 h-3 rounded-full bg-secondary/30 animate-float-slower z-10"></div>
        <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse z-10"></div>
        <div className="absolute bottom-[15%] left-[30%] w-2 rounded-full bg-tertiary-container/50 animate-float-slow z-10"></div>
        <div className="absolute top-[40%] left-[20%] w-0.5 h-0.5 rounded-full bg-on-surface/30 z-10"></div>

        {/* Diagonal Light flares / Ribbons */}
        <div className="absolute top-1/2 left-0 w-full h-24 bg-primary-container -rotate-6 mix-blend-overlay z-0 opacity-40 blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-32 h-screen bg-tertiary-container/30 rotate-[35deg] z-0 filter blur-xl"></div>
      </div>

      {/* === Main Content === */}
      <div className="container relative z-10 mx-auto px-4 md:pl-24 lg:pl-4" ref={wrapperRef}>
        <div className="relative">
          {/* Title Blocks */}
          <div className="flex flex-col gap-0 items-center justify-center">
            <h2 ref={text1Ref} className="font-epilogue text-[clamp(4rem,20vw,16rem)] leading-[0.8] font-black uppercase tracking-tighter text-primary -rotate-2 mix-blend-multiply opacity-90 kinetic-text will-change-transform">
              Réveillez
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-8 -mt-2 md:-mt-4">
              <h2 ref={text2Ref} className="font-epilogue text-[clamp(4rem,20vw,16rem)] leading-[0.8] font-black uppercase tracking-tighter text-on-surface rotate-1 kinetic-text will-change-transform">
                La
              </h2>
              {/* Floating Badge */}
              <div ref={badgeRef} className="my-2 md:mb-12 w-20 h-20 md:w-32 md:h-32 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-epilogue font-bold text-center leading-tight text-xs md:text-base rotate-12 shadow-xl p-2 md:p-4 will-change-transform cursor-pointer hover:bg-primary hover:text-white transition-colors duration-500">
                Niger <br /> 2024
              </div>
            </div>
            <h2 ref={text3Ref} className="font-epilogue text-[clamp(5rem,25vw,20rem)] leading-[0.8] font-black uppercase tracking-tighter text-secondary -rotate-1 mix-blend-darken kinetic-text will-change-transform">
              Joie
            </h2>
          </div>

          {/* Fragment 1: Child Photo */}
          <div ref={frag1Ref} className="absolute -top-10 right-0 md:right-[10%] w-32 h-40 md:w-64 md:h-80 bg-surface-container-lowest shadow-2xl p-2 md:p-4 rotate-6 z-20 will-change-transform" data-cursor-text="Regarder">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover filter brightness-110 contrast-125"
              alt="Close-up of a joyful Nigerien child laughing"
              src="/images/maradi.webp"
            />
            <div className="absolute -bottom-4 -left-4 bg-tertiary p-2 text-white font-space-grotesk text-[8px] uppercase tracking-widest shadow-lg">
              Fragment #01
            </div>
          </div>

          {/* Fragment 2: Market Scene */}
          <div ref={frag2Ref} className="absolute top-[35%] md:top-[40%] -left-4 md:-left-[5%] w-28 h-28 md:w-72 md:h-72 rounded-full overflow-hidden border-4 md:border-8 border-surface-container-low shadow-2xl -rotate-12 z-20 will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover filter sepia-[0.3]"
              alt="Vibrant market scene in Niamey"
              src="/images/jeu.webp"
            />
          </div>
        </div>
      </div>

      {/* === Scroll Cue === */}
      <div ref={scrollCueRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 will-change-transform">
        <span className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">Descendre</span>
        <div className="w-5 h-8 border-2 border-on-surface-variant/40 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-primary rounded-full mt-1.5"></div>
        </div>
      </div>
    </section>
  );
}
