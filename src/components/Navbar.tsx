"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#mission", label: "Mission" },
  { href: "#programmes", label: "Programmes" },
  { href: "#histoires", label: "Histoires" },
  { href: "#actualites", label: "Actualités" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled
            ? "glass py-3 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
            : "py-5 bg-transparent"
        }`}
        style={{
          transitionTimingFunction: "var(--ease-kinetic)",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--orange-deep), var(--orange-joie))",
              }}
            >
              FJ
            </div>
            <span className="font-display font-semibold text-sm tracking-tight hidden sm:block text-[var(--bleu-ocean)]">
              Les Fabricants
              <br />
              <span className="text-[var(--orange-joie)] font-bold">
                de Joie
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--gris-typo)] hover:text-[var(--orange-joie)] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--orange-joie)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a href="#soutenir" className="btn-primary hidden md:inline-flex text-sm py-2.5 px-5">
              Nous Soutenir
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--surface-container-low)] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[999] md:hidden transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "var(--ease-kinetic)" }}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl p-8 pt-24 transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ transitionTimingFunction: "var(--ease-kinetic)" }}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-display font-semibold text-[var(--bleu-ocean)] hover:text-[var(--orange-joie)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--surface-container-high)" }}>
              <a
                href="#soutenir"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center"
              >
                Nous Soutenir
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
