"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisParams, setLenisParams] = useState<Lenis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const preloaderRef = useRef<HTMLDivElement>(null);
  const frogRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        
        // Final joyful leap!
        const tl = gsap.timeline();
        tl.to(frogRef.current, {
          yPercent: -150,
          scale: 1.15,
          duration: 0.8,
          ease: "back.in(1.2)"
        })
        .to(preloaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: () => {
            setIsLoading(false);
            initLenis();
          }
        }, "-=0.2");
      } else {
        setProgress(p);
      }
    }, 120);

    // Enter animation
    gsap.fromTo(frogRef.current,
      { yPercent: 40, opacity: 0, scale: 0.8 },
      { yPercent: 0, opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.6)" }
    );

    const initLenis = () => {
      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        infinite: false,
      });

      setLenisParams(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    return () => {
      clearInterval(interval);
      if (lenisParams) lenisParams.destroy();
    };
  }, []);

  return (
    <>
      <div 
        ref={preloaderRef}
        className="fixed inset-0 z-[10000] bg-surface flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle Ambient Light for Premium Vibe */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] bg-[#38B29B]/5 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute w-[50vw] h-[50vw] md:w-[25vw] md:h-[25vw] bg-[#FFC82C]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="z-10 flex flex-col items-center">
          
          {/* THE BEAUTIFUL DANCING FROG MASCOT */}
          <svg 
            ref={frogRef}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 240 240" 
            className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] drop-shadow-2xl overflow-visible relative z-10 will-change-transform"
            role="img"
            aria-label="Grenouille mascotte dansant pour le chargement"
          >
            <title>Chargement en cours</title>
            <style>
              {`
                .frog-bounce {
                  transform-box: fill-box;
                  transform-origin: center bottom;
                  animation: jump-anim 0.35s cubic-bezier(0.28, 0.84, 0.42, 1) infinite alternate;
                  will-change: transform;
                }
                .arm-left {
                  transform-box: fill-box;
                  transform-origin: right top;
                  animation: arm-wave-l 0.4s ease-in-out infinite alternate;
                  animation-delay: 0.05s;
                  will-change: transform;
                }
                .arm-right {
                  transform-box: fill-box;
                  transform-origin: left top;
                  animation: arm-wave-r 0.4s ease-in-out infinite alternate-reverse;
                  animation-delay: 0.1s;
                  will-change: transform;
                }
                .shadow-pulse {
                  transform-origin: center;
                  animation: shadow-anim 0.35s cubic-bezier(0.28, 0.84, 0.42, 1) infinite alternate;
                  will-change: transform, opacity;
                }
                .eyes-blink {
                  transform-origin: center;
                  animation: blink-anim 3.5s infinite;
                  will-change: transform;
                }
                
                @keyframes jump-anim {
                  0% { transform: translateY(0px) scaleY(0.9) scaleX(1.1); }
                  100% { transform: translateY(-25px) scaleY(1.05) scaleX(0.95); }
                }
                @keyframes arm-wave-l {
                  0% { transform: rotate(-10deg) translateY(5px); }
                  100% { transform: rotate(40deg) translateY(-5px); }
                }
                @keyframes arm-wave-r {
                  0% { transform: rotate(10deg) translateY(5px); }
                  100% { transform: rotate(-40deg) translateY(-5px); }
                }
                @keyframes shadow-anim {
                  0% { transform: scaleX(1.2); opacity: 0.15; }
                  100% { transform: scaleX(0.7); opacity: 0.05; }
                }
                @keyframes blink-anim {
                  0%, 93%, 100% { transform: scaleY(1); }
                  96% { transform: scaleY(0.1); }
                }

                /* Music Notes Animation */
                .note { opacity: 0; will-change: transform, opacity; }
                .note-1 { animation: float-up 1.5s linear infinite 0s; }
                .note-2 { animation: float-up 1.5s linear infinite 0.75s; }
                @keyframes float-up {
                  0% { transform: translateY(0px) scale(0.5) rotate(-15deg); opacity: 0; }
                  20% { opacity: 1; transform: translateY(-10px) scale(0.8) rotate(-5deg); }
                  80% { opacity: 1; transform: translateY(-50px) scale(1) rotate(15deg); }
                  100% { transform: translateY(-70px) scale(1.1) rotate(25deg); opacity: 0; }
                }

                /* Accessibility: Reduced Motion */
                @media (prefers-reduced-motion: reduce) {
                  .frog-bounce, .arm-left, .arm-right, .shadow-pulse, .eyes-blink, .note-1, .note-2 {
                    animation: none !important;
                    transition: none !important;
                  }
                  .note-1, .note-2 {
                    opacity: 1 !important;
                  }
                }
              `}
            </style>

            <defs>
              <path id="note-path" d="M12.5,3.5 L12.5,13.5 C11.5,12.5 9.5,12 8,12 C4.5,12 2,14.5 2,17.5 C2,20.5 4.5,23 8,23 C11.5,23 15,20.5 15,17.5 L15,8 L22,6 L22,3.5 L12.5,3.5 Z" />
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="120" cy="210" rx="50" ry="12" fill="#1C3B5E" className="shadow-pulse" />

            {/* Dancing music notes - CRITICAL: Static wrapper group for positioning to avoid CSS transform overriding! */}
            <g transform="translate(45, 90)">
              <g fill="#FF7F3F" className="note note-1">
                <use href="#note-path" transform="scale(0.8)" />
              </g>
            </g>
            <g transform="translate(180, 80)">
              <g fill="#FFC82C" className="note note-2">
                <use href="#note-path" transform="scale(0.8)" />
              </g>
            </g>

            {/* FROG CHARACTER BOUNCING GROUP */}
            <g className="frog-bounce">
              
              {/* BACK LEGS */}
              <g fill="#288F7A">
                <path d="M 50 170 C 30 150, 30 200, 40 210 C 60 215, 80 190, 80 170 Z" />
                <path d="M 190 170 C 210 150, 210 200, 200 210 C 180 215, 160 190, 160 170 Z" />
                {/* Toes Left */}
                <circle cx="35" cy="205" r="7" />
                <circle cx="45" cy="212" r="7" />
                <circle cx="58" cy="209" r="7" />
                {/* Toes Right */}
                <circle cx="205" cy="205" r="7" />
                <circle cx="195" cy="212" r="7" />
                <circle cx="182" cy="209" r="7" />
              </g>

              {/* MAIN BODY (Pear-shaped, perfectly plump) */}
              <path 
                d="M 120 80 C 165 80, 185 130, 185 175 C 185 205, 155 215, 120 215 C 85 215, 55 205, 55 175 C 55 130, 75 80, 120 80 Z" 
                fill="#38B29B" 
              />
              
              {/* SOFT WARM BELLY */}
              <path 
                d="M 120 125 C 150 125, 165 155, 165 180 C 165 200, 140 208, 120 208 C 100 208, 75 200, 75 180 C 75 155, 90 125, 120 125 Z" 
                fill="#FFC82C" 
              />

              {/* BULBOUS EYES OUTER */}
              <circle cx="80" cy="85" r="25" fill="#38B29B" />
              <circle cx="160" cy="85" r="25" fill="#38B29B" />

              {/* WHITES OF THE EYES */}
              <g className="eyes-blink">
                <circle cx="80" cy="85" r="18" fill="#FFFFFF" />
                <circle cx="160" cy="85" r="18" fill="#FFFFFF" />

                {/* PUPILS AND SHINING CATCHLIGHTS */}
                <circle cx="84" cy="85" r="10" fill="#1C3B5E" />
                <circle cx="156" cy="85" r="10" fill="#1C3B5E" />
                
                <circle cx="87" cy="81" r="3.5" fill="#FFFFFF" />
                <circle cx="159" cy="81" r="3.5" fill="#FFFFFF" />
                
                <circle cx="81" cy="89" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="153" cy="89" r="1.5" fill="#FFFFFF" opacity="0.9" />
              </g>

              {/* CUTE CHEEKS (BLUSH) */}
              <ellipse cx="65" cy="118" rx="12" ry="7" fill="#FF7F3F" opacity="0.8" />
              <ellipse cx="175" cy="118" rx="12" ry="7" fill="#FF7F3F" opacity="0.8" />

              {/* HAPPY CAT-LIKE SMILE :3 */}
              <path 
                d="M 100 115 Q 110 128 120 115 Q 130 128 140 115" 
                fill="none" stroke="#1C3B5E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" 
              />

              {/* DANCING WAVY ARMS - CRITICAL: Static wrapper group for positioning to avoid CSS transform overriding! */}
              <g transform="translate(60, 150)">
                <g className="arm-left">
                  <path d="M 0 0 C -25 15, -45 -10, -30 -35" fill="none" stroke="#38B29B" strokeWidth="14" strokeLinecap="round" />
                  <circle cx="-30" cy="-38" r="7" fill="#38B29B" />
                  <circle cx="-20" cy="-42" r="7" fill="#38B29B" />
                  <circle cx="-39" cy="-28" r="7" fill="#38B29B" />
                </g>
              </g>

              <g transform="translate(180, 150)">
                <g className="arm-right">
                  <path d="M 0 0 C 25 15, 45 -10, 30 -35" fill="none" stroke="#38B29B" strokeWidth="14" strokeLinecap="round" />
                  <circle cx="30" cy="-38" r="7" fill="#38B29B" />
                  <circle cx="20" cy="-42" r="7" fill="#38B29B" />
                  <circle cx="39" cy="-28" r="7" fill="#38B29B" />
                </g>
              </g>

            </g>
          </svg>

          {/* Loader Text Area - Polished to match the Awwwards UI direction */}
          <div className="mt-8 flex flex-col items-center">
            
            {/* Elegant Subtitle with Line Decorators */}
            <div className="flex items-center gap-4 text-[#1C3B5E] opacity-50 mb-3">
              <span className="w-8 h-[1px] bg-current"></span>
              <h2 className="font-epilogue text-[10px] md:text-sm font-bold tracking-[0.35em] uppercase">
                Décollage
              </h2>
              <span className="w-8 h-[1px] bg-current"></span>
            </div>

            {/* Immersive Bold Typography for Percentage - Optically Centered */}
            <div className="flex items-baseline justify-center relative translate-x-2">
              <span className="font-space-grotesk font-black text-6xl md:text-7xl text-[#38B29B] tabular-nums tracking-tighter mix-blend-multiply">
                {progress}
              </span>
              <span className="font-space-grotesk font-bold text-3xl md:text-4xl text-[#FF7F3F] ml-1">
                %
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>
        {children}
      </div>
    </>
  );
}
