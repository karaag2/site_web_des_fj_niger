"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const text = textRef.current;

    // Set initial GSAP parameters
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      // Direct center alignment for exact pointer
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Smooth follow for the larger outer circle
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const onMouseEnterLink = (e: MouseEvent) => {
      setIsHovering(true);
      const target = e.target as HTMLElement;
      
      // Look for specific data attributes for custom cursor text
      const customText = target.getAttribute("data-cursor-text");
      if (customText && text) {
        text.innerText = customText;
        gsap.to(text, { opacity: 1, scale: 1, duration: 0.3 });
      }

      gsap.to(cursor, { scale: 0, duration: 0.2 });
      gsap.to(follower, {
        scale: 2.5,
        backgroundColor: "rgba(255, 255, 255, 1)",
        mixBlendMode: "difference", /* Awwwards trick: difference blend mode on hover */
        border: "none",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMouseLeaveLink = () => {
      setIsHovering(false);
      if (text) {
        gsap.to(text, { opacity: 0, scale: 0, duration: 0.2 });
      }
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, {
        scale: 1,
        backgroundColor: "transparent",
        mixBlendMode: "normal",
        border: "1px solid rgba(162, 63, 0, 0.4)", // Primary color tinted
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Attach listeners to all interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, [role='button'], img"
    );

    interactiveElements.forEach((el) => {
      // Cast DOM Element to HTMLElement for type safety
      const htmlEl = el as HTMLElement;
      htmlEl.addEventListener("mouseenter", onMouseEnterLink);
      htmlEl.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeEventListener("mouseenter", onMouseEnterLink);
        htmlEl.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          border: "1px solid rgba(162, 63, 0, 0.4)", // Tailored border to brand
          willChange: "transform, background-color, border, width, height",
        }}
      >
        <span 
          ref={textRef} 
          className="text-black font-space-grotesk text-[8px] uppercase tracking-widest opacity-0 scale-0 font-bold"
        ></span>
      </div>
    </>
  );
}
