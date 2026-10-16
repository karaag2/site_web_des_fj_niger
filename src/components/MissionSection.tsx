"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * MissionSection — Deep Scrollytelling
 * 
 * This is the "immersive chapter" that slows the user down
 * and walks them through a single mission in detail.
 * Inspired by: NYT Snowfall, Apple product pages, Resn studio pages.
 * 
 * Scroll-scrubbed chapter reveals, pinned hero image that morphs,
 * and progressive text disclosure create the "story-driven" flow.
 */

const chapters = [
  {
    number: "01",
    title: "L'Appel",
    body: "Au Niger, 70% de la population a moins de 25 ans. Une jeunesse immense, vibrante, assoiffée de sens. Les Fabricants de Joie sont nés d'une conviction ancrée dans la foi : chaque enfant, chaque jeune mérite de connaître l'amour de Dieu et d'en devenir le témoin joyeux.",
    stat: "70%",
    statLabel: "de la population a moins de 25 ans",
    accent: "primary",
  },
  {
    number: "02",
    title: "La Méthode",
    body: "Comédies musicales, camps de jeunesse, formations de leaders, programmes familiaux — chaque initiative est un pont entre la foi et la créativité. Nous ne prêchons pas depuis une estrade. Nous chantons, nous jouons, nous créons ensemble. Et dans cette joie partagée, Dieu se révèle.",
    stat: "6",
    statLabel: "programmes créatifs et spirituels",
    accent: "secondary",
  },
  {
    number: "03",
    title: "Le Fruit",
    body: "Des enfants découvrent leurs talents et leur identité en Christ. Des familles se reconstruisent autour de la Parole. Des jeunes leaders se lèvent pour servir leurs communautés avec audace. Le fruit n'est pas seulement social — il est profondément spirituel.",
    stat: "1976",
    statLabel: "et toujours fidèles à l'appel",
    accent: "tertiary",
  },
];

export default function MissionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinnedImageRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgNumberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      mm.add("(min-width: 1024px)", () => {
        // 1. Pin the left image column while chapters scroll on the right ONLY on desktop
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinnedImageRef.current,
          pinSpacing: false,
        });

        // 2. Progress bar that fills as user scrolls through
        gsap.to(progressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      // 3. Each chapter fades/slides in on reveal
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;

        // Chapter entrance
        gsap.fromTo(el,
          { y: 120, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Stat counter animation
        const statEl = el.querySelector("[data-stat]");
        if (statEl) {
          gsap.fromTo(statEl,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1, opacity: 1, rotation: 0,
              duration: 0.8,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: el,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Update background number on each chapter
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          onEnter: () => {
            if (bgNumberRef.current) {
              gsap.to(bgNumberRef.current, {
                innerText: chapters[i].number,
                snap: { innerText: 1 },
                duration: 0,
              });
              gsap.fromTo(bgNumberRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.03, duration: 0.6, ease: "expo.out" });
            }
          },
          onEnterBack: () => {
            if (bgNumberRef.current) {
              gsap.to(bgNumberRef.current, { innerText: chapters[i].number, snap: { innerText: 1 }, duration: 0 });
              gsap.fromTo(bgNumberRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.03, duration: 0.6, ease: "expo.out" });
            }
          },
        });
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="mission" ref={containerRef} className="relative bg-[#0A192F] text-white min-h-auto lg:min-h-[300vh] py-20 lg:py-0 overflow-hidden">
      
      {/* === Background Decoration === */}
      {/* Giant chapter number */}
      <span
        ref={bgNumberRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-epilogue text-[50vw] font-black text-white/[0.03] pointer-events-none select-none z-0 leading-none will-change-transform"
      >
        01
      </span>

      {/* Topographic curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
        <svg width="100%" height="100%" viewBox="0 0 1400 2000" fill="none" preserveAspectRatio="none">
          <path d="M0,200 Q350,50 700,200 T1400,200" stroke="#FF7F3F" strokeWidth="1" />
          <path d="M0,400 Q350,250 700,400 T1400,400" stroke="#FF7F3F" strokeWidth="0.5" strokeDasharray="8 12" />
          <path d="M0,800 Q350,650 700,800 T1400,800" stroke="#4FC3F7" strokeWidth="1" />
          <path d="M0,1200 Q350,1050 700,1200 T1400,1200" stroke="#4FC3F7" strokeWidth="0.5" strokeDasharray="4 8" />
          <path d="M0,1600 Q350,1450 700,1600 T1400,1600" stroke="#FF7F3F" strokeWidth="1" />
          <circle cx="200" cy="600" r="3" fill="#FF7F3F" opacity="0.4" />
          <circle cx="1200" cy="300" r="2" fill="#4FC3F7" opacity="0.3" />
        </svg>
      </div>

      {/* === Background Textures & Physical Layers === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute inset-0 texture-paper opacity-50 z-0"></div>
        <div className="absolute inset-0 texture-dots opacity-20 z-0"></div>
      </div>
      
      {/* Dynamic gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF7F3F]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4FC3F7]/15 rounded-full blur-[200px] pointer-events-none mix-blend-screen"></div>

      {/* Noise grain - Original subtle overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>

      {/* Scattered filigrane dots */}
      <div className="absolute top-[5%] left-[8%] w-1.5 h-1.5 rounded-full bg-[#FF7F3F]/30 animate-float-slow"></div>
      <div className="absolute top-[15%] right-[12%] w-2 h-2 rounded-full bg-[#4FC3F7]/20 animate-float-slower"></div>
      <div className="absolute top-[45%] left-[3%] w-1 h-1 rounded-full bg-white/20 animate-pulse"></div>
      <div className="absolute top-[70%] right-[6%] w-2.5 h-2.5 rounded-full bg-[#FF7F3F]/15 animate-float-slow"></div>
      <div className="absolute top-[85%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#4FC3F7]/25 animate-float-slower"></div>

      {/* Abstract rotating orbital details */}
      <div className="absolute top-[30%] right-[15%] w-60 h-60 border-[1px] border-white/5 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center pointer-events-none">
        <div className="absolute top-0 w-2 h-2 bg-[#FF7F3F]/40 rounded-full"></div>
      </div>
      <div className="absolute bottom-[20%] left-[20%] w-96 h-96 border-[0.5px] border-[#4FC3F7]/10 rounded-full animate-[spin_60s_linear_infinite_reverse] flex items-end justify-start pointer-events-none">
        <div className="absolute bottom-10 left-10 w-3 h-3 border border-white/30 rounded-full"></div>
      </div>
      
      {/* Decorative text watermark grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02] flex flex-wrap gap-8 p-12">
        <span className="font-space-grotesk text-xs uppercase tracking-[0.5em] writing-vertical-lr rotate-180">Impact</span>
        <span className="font-space-grotesk text-xs uppercase tracking-[0.5em] writing-vertical-lr rotate-180 mt-96 ml-auto">Jeunesse</span>
        <span className="font-space-grotesk text-xs uppercase tracking-[0.5em] writing-vertical-lr rotate-180 mt-[800px] mb-auto">Autonomie</span>
      </div>

      {/* === Pinned Left Image === */}
      <div ref={pinnedImageRef} className="absolute top-0 left-0 w-1/2 h-screen hidden lg:flex items-center justify-center p-20 z-10">
        <div className="relative w-full h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/joy.webp"
            alt="Portrait of a young artisan in gold-hour light"
            className="w-full h-full object-cover"
          />
          {/* Decorative frame corners */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#FF7F3F]/40 z-20"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#FF7F3F]/40 z-20"></div>
          {/* Label tag */}
          <div className="absolute bottom-8 left-8 z-20 font-space-grotesk text-xs uppercase tracking-[0.2em] text-white/50">
            Mission Sahel — 2024
          </div>
        </div>

        {/* Vertical progress bar */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[2px] h-[200px] bg-white/10 rounded-full overflow-hidden">
          <div ref={progressRef} className="w-full h-full bg-[#FF7F3F] origin-top scale-y-0 will-change-transform"></div>
        </div>
      </div>

      {/* === Right Chapter Flow === */}
      <div className="relative z-10 w-full lg:w-1/2 lg:ml-auto min-h-auto lg:min-h-[300vh] flex flex-col justify-around py-12 lg:py-40 px-6 sm:px-8 lg:px-20">

        {/* Section Header */}
        <div className="mb-12 lg:mb-0">
          <span className="font-space-grotesk text-[#FF7F3F] font-bold text-sm uppercase tracking-[0.3em] block mb-6">
            Au Cœur de la Mission
          </span>
          <h2 className="font-epilogue text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" data-cursor-text="Explorer">
            Connaître Dieu<br />Le Faire Connaître
          </h2>
          <div className="mt-8 w-20 h-[2px] bg-[#FF7F3F]"></div>
        </div>

        {/* Mobile-only Mission Image */}
        <div className="block lg:hidden my-8 relative w-full h-72 sm:h-96 rounded-sm overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/joy.webp"
            alt="Portrait of a young artisan in gold-hour light"
            className="w-full h-full object-cover"
          />
          {/* Decorative frame corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#FF7F3F]/40 z-20"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#FF7F3F]/40 z-20"></div>
          {/* Label tag */}
          <div className="absolute bottom-4 left-4 z-20 font-space-grotesk text-[10px] uppercase tracking-[0.2em] text-white/60">
            Mission Sahel — 2024
          </div>
        </div>

        {/* Chapters */}
        {chapters.map((ch, i) => (
          <div
            key={ch.number}
            ref={(el) => { chapterRefs.current[i] = el; }}
            className="mb-20 lg:mb-0 will-change-transform"
          >
            {/* Chapter number as decorative element */}
            <div className="flex items-start gap-6 mb-6">
              <span className="font-epilogue text-6xl font-black text-white/10 leading-none select-none">{ch.number}</span>
              <div className="w-12 h-[1px] bg-white/20 mt-8"></div>
            </div>

            <h3 className="font-epilogue text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">{ch.title}</h3>
            <p className="font-inter text-white/60 text-lg leading-relaxed max-w-md mb-10">{ch.body}</p>

            {/* Impact stat */}
            <div data-stat className="flex items-end gap-4 will-change-transform">
              <span className={`font-epilogue text-6xl md:text-8xl font-black leading-none ${
                ch.accent === "primary" ? "text-[#FF7F3F]" : ch.accent === "secondary" ? "text-[#4FC3F7]" : "text-[#81C784]"
              }`}>
                {ch.stat}
              </span>
              <span className="font-space-grotesk text-xs uppercase tracking-widest text-white/40 pb-2 max-w-[120px] leading-tight">
                {ch.statLabel}
              </span>
            </div>

            {/* Separator filigrane */}
            {i < chapters.length - 1 && (
              <div className="mt-20 flex items-center gap-4 opacity-20">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="flex-1 h-[0.5px] bg-white"></div>
                <div className="w-1 h-1 rounded-full bg-[#FF7F3F]"></div>
              </div>
            )}
          </div>
        ))}

        {/* Final CTA */}
        <div className="mt-20 lg:mt-0">
          <Link
            href="/contact"
            className="inline-block relative overflow-hidden group border border-white/20 px-10 py-5 font-space-grotesk font-bold text-sm tracking-widest uppercase hover:text-[#0A192F] transition-colors duration-500"
            data-cursor-text="Agir"
          >
            <span className="relative z-10 text-white">Rejoindre la mission</span>
            <div className="absolute inset-0 bg-[#FF7F3F] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
