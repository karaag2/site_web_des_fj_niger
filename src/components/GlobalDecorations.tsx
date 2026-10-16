"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GlobalDecorations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle mouse aura that follows the cursor with a big delay
    const aura = cursorAuraRef.current;
    if (!aura) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(aura, {
        x: e.clientX - 200,
        y: e.clientY - 200,
        duration: 2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {/* 1. Global SOTD Cinematic Frame */}
      <div className="fixed inset-3 md:inset-6 border-[1px] border-on-surface/[0.06] pointer-events-none z-[90] mix-blend-difference hidden md:block rounded-xl">
        {/* Frame details */}
        <div className="absolute -top-3 left-10 font-space-grotesk text-[9px] uppercase tracking-[0.4em] text-on-surface/50 bg-surface px-4 py-1">
          Niamey, Niger / 13°31′N 2°06′E
        </div>
        <div className="absolute -bottom-3 right-10 font-space-grotesk text-[9px] uppercase tracking-[0.4em] text-on-surface/50 bg-surface px-4 py-1">
          Les Fabricants de Joie — EST. 1976
        </div>
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 font-space-grotesk text-[8px] uppercase tracking-[0.4em] text-on-surface/40 bg-surface px-1 py-4 -rotate-90">
          Choc · Manifeste · Origines · Mission
        </div>
        
        {/* Corner crosses and brackets */}
        <div className="absolute -top-1.5 -left-1.5 text-on-surface/30 text-xs">+</div>
        <div className="absolute -top-1.5 -right-1.5 text-on-surface/30 text-xs">+</div>
        <div className="absolute -bottom-1.5 -left-1.5 text-on-surface/30 text-xs">+</div>
        <div className="absolute -bottom-1.5 -right-1.5 text-on-surface/30 text-xs">+</div>
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-on-surface/[0.04]"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-on-surface/[0.04]"></div>
      </div>

      {/* 2. Global Noise Texture (Overlay everything subtle) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[120] opacity-[0.035] mix-blend-multiply" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }}
      ></div>

      {/* 3. Mouse Interactive Aura */}
      <div 
        ref={cursorAuraRef} 
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 pointer-events-none z-[80] blur-[100px] mix-blend-overlay will-change-transform"
      ></div>

      {/* 4. Floating 'Dust' Particles & Geometric details (for depth) */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" ref={containerRef}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${(i % 3 === 0) ? 'bg-primary/20' : (i % 3 === 1) ? 'bg-secondary/15' : 'bg-tertiary-container/30'} ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'}`}
            style={{
              width: Math.random() * 5 + 1 + 'px',
              height: Math.random() * 5 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          ></div>
        ))}
        {/* Subtle geometric floaters */}
        <div className="absolute top-[15%] left-[5%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-secondary/20 animate-float-slow border-solid opacity-60"></div>
        <div className="absolute bottom-[25%] right-[10%] w-4 h-4 border-[1.5px] border-tertiary/20 rotate-45 animate-float-slower opacity-60"></div>
        <div className="absolute top-[40%] right-[5%] w-6 h-6 border focus:border-red-500 rounded-full border-primary/10 animate-pulse-ring"></div>
        <div className="absolute bottom-[40%] left-[8%] w-12 h-12 border border-on-surface/[0.03] rotate-12 flex justify-center items-center object-center animate-float-slower">
            <div className="w-1 h-1 bg-primary/20 rounded-full"></div>
        </div>
      </div>
    </>
  );
}
