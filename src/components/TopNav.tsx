"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/#manifeste", label: "Manifeste" },
    { href: "/#histoire", label: "Histoire" },
    { href: "/#mission", label: "Missions" },
    { href: "/#lookbook", label: "Lookbook" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ── Mobile/Tablet Fullscreen Overlay ── */}
      <div
        className={`fixed inset-0 z-[1100] bg-surface/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] xl:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none translate-y-8"
        }`}
        style={{ top: 0, left: 0, width: "100vw", height: "100dvh" }}
      >
        {/* Decorative Background Elements for Menu */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Close Button UI */}
        <button
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full border border-primary/20 bg-surface/50 backdrop-blur-md shadow-lg text-primary transition-transform active:scale-90"
          onClick={() => setIsOpen(false)}
          aria-label="Fermer le menu"
        >
          <span className="material-symbols-outlined text-2xl" data-icon="close">close</span>
        </button>

        {/* Brand in Overlay */}
        <div className="mb-12 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative w-20 h-20">
            <Image 
              src="/images/logo_FJ_rvb.png" 
              alt="Logo FJ" 
              fill 
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] font-epilogue font-bold text-primary/60 block mb-1">Niger</span>
            <h2 className="text-xl md:text-2xl font-black font-epilogue tracking-tighter text-primary uppercase leading-tight">
              Les Fabricants<br/><span className="text-secondary italic">de Joie</span>
            </h2>
          </div>
        </div>

        <nav className="flex flex-col gap-6 text-center items-center py-4">
          {navLinks.map((link, idx) => (
            <Link
              key={link.href}
              className="text-on-surface font-epilogue font-black text-3xl md:text-4xl uppercase tracking-widest hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="mt-8 flex flex-col items-center gap-6 w-full px-12">
            <div className="w-full h-px bg-on-surface/10 mb-2"></div>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="group relative bg-primary text-on-primary px-10 py-5 rounded-none font-epilogue font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.3)] w-full max-w-xs"
            >
              <span className="relative z-10">Rejoindre la Mission</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Header Bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 w-full px-4 sm:px-8 xl:pl-32 py-4 md:py-6 flex justify-between items-center ${
          scrolled && !isOpen
            ? "bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3 md:py-4"
            : "bg-transparent"
        }`}
      >
        <Link href="/#hero" className="flex items-center gap-3 md:gap-4 group">
          {/* Logo Container */}
          <div className={`relative transition-all duration-500 ease-out flex-shrink-0 ${
            scrolled ? "w-10 h-10 md:w-11 lg:w-12" : "w-11 h-11 md:w-14 lg:w-16"
          }`}>
            <Image 
              src="/images/logo_FJ_rvb.png" 
              alt="Logo FJ" 
              fill 
              sizes="(max-width: 768px) 44px, (max-width: 1024px) 56px, 64px"
              className="object-contain group-hover:scale-110 transition-transform duration-500"
              priority
            />
          </div>
          
          {/* Branding Text */}
          <div className={`flex flex-col leading-none transition-all duration-500 ${
            isOpen ? "opacity-0 xl:opacity-100" : "opacity-100"
          }`}>
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] font-epilogue font-bold text-primary/60 mb-0.5">Niger</span>
            <div className="flex items-baseline gap-1 md:gap-1.5 flex-wrap max-w-[150px] md:max-w-none">
              <h1 className={`font-black font-epilogue tracking-tighter text-primary uppercase transition-all duration-500 ${
                scrolled ? "text-base md:text-lg lg:text-xl" : "text-lg md:text-xl lg:text-2xl"
              }`}>
                Les Fabricants
              </h1>
              <span className={`font-epilogue font-light italic text-secondary transition-all duration-500 ${
                scrolled ? "text-sm md:text-base lg:text-lg" : "text-base md:text-lg lg:text-xl"
              } inline`}>
                de Joie
              </span>
            </div>
          </div>
        </Link>

        {/* Burger Button - Visible up to 'xl' breakpoint (1280px) to prevent tablet crowding */}
        <div className={`xl:hidden flex items-center transition-all duration-500 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <button
            className="flex flex-col gap-1.5 p-3 focus:outline-none group bg-surface/40 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform"
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <span className="w-7 h-0.5 bg-primary rounded-full transition-all group-hover:w-9"></span>
            <span className="w-5 h-0.5 bg-secondary rounded-full transition-all group-hover:w-9 self-end"></span>
            <span className="w-7 h-0.5 bg-primary rounded-full transition-all group-hover:w-9"></span>
          </button>
        </div>

        {/* Desktop Navigation - Only visible from XL (1280px) to fit all elements comfortably */}
        <div className="hidden xl:flex gap-10 lg:gap-14 items-center">
          <nav className="flex gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="text-on-surface hover:text-primary font-epilogue font-bold text-[10px] lg:text-[11px] uppercase tracking-[0.2em] transition-all duration-500 relative group py-2"
                href={link.href}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-6 lg:gap-8 border-l border-white/10 pl-10">
            <button className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary text-xl transition-transform group-hover:rotate-180 duration-700" data-icon="language">
                language
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 group-hover:text-primary transition-colors">FR</span>
            </button>
            <Link 
              href="/contact" 
              className="bg-primary text-on-primary px-6 lg:px-8 py-3 rounded-none font-epilogue font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Rejoindre
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
