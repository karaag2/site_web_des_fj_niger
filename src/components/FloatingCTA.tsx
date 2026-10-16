"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function FloatingCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pulsing ring animation
    const ringAnim = gsap.fromTo(ringRef.current,
      { scale: 1, opacity: 0.4 },
      {
        scale: 1.6,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        repeat: -1,
      }
    );

    // Magnetic hover effect (desktop)
    const container = containerRef.current;
    const btn = btnRef.current;
    if (!container || !btn) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      ringAnim.kill();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="hidden md:flex fixed bottom-12 right-12 z-[110] w-32 h-32 items-center justify-center origin-bottom-right">
      {/* Pulsing ring */}
      <div 
        ref={ringRef}
        className="absolute w-24 h-24 rounded-full border-2 border-primary-container pointer-events-none"
      ></div>
      
      <Link 
        ref={btnRef}
        href="/contact"
        className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex flex-col items-center justify-center font-epilogue font-black text-[10px] uppercase tracking-tighter leading-tight text-center shadow-[0_20px_60px_rgba(162,63,0,0.3)] hover:scale-110 hover:shadow-[0_30px_80px_rgba(162,63,0,0.4)] transition-all duration-500 cursor-pointer"
        aria-label="Rejoindre la mission - Contact"
      >
        Rejoindre
        <br />
        la mission
      </Link>
    </div>
  );
}
