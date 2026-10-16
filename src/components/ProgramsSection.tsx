"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GraduationCap,
  Music,
  Users,
  Gamepad2,
  BookOpen,
  Palette,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    icon: <Music size={24} />,
    title: "Comédies Musicales",
    description:
      "Des spectacles créatifs mêlant théâtre, musique et danse, portés par la jeunesse nigérienne pour transmettre des messages de foi et d'espoir.",
    color: "var(--orange-joie)",
    bgColor: "rgba(255, 127, 63, 0.08)",
  },
  {
    icon: <Users size={24} />,
    title: "Familles de Foi",
    description:
      "Un programme dédié au renforcement des liens familiaux à travers des activités intergénérationnelles et l'accompagnement spirituel.",
    color: "var(--bleu-ocean)",
    bgColor: "rgba(28, 59, 94, 0.06)",
  },
  {
    icon: <GraduationCap size={24} />,
    title: "Formation FTJ",
    description:
      "Formation qualifiante pour les leaders de jeunesse et éducateurs, alliant compétences pratiques et fondements spirituels.",
    color: "var(--vert-menthe)",
    bgColor: "rgba(56, 178, 155, 0.08)",
  },
  {
    icon: <Gamepad2 size={24} />,
    title: "Quartier Libre",
    description:
      "Un espace où les jeunes expriment leur foi et explorent leurs talents à travers les jeux, la culture urbaine et les nouvelles technologies.",
    color: "var(--jaune-solaire)",
    bgColor: "rgba(255, 200, 44, 0.1)",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Programme Niko",
    description:
      "Un parcours éducatif et spirituel conçu pour les enfants, mettant l'accent sur l'éveil, la découverte et la joie d'apprendre.",
    color: "var(--orange-joie)",
    bgColor: "rgba(255, 127, 63, 0.08)",
  },
  {
    icon: <Palette size={24} />,
    title: "Tournées Créatives",
    description:
      "Des tournées artistiques à travers les régions du Niger, portant l'Évangile avec joie et créativité dans les communautés les plus reculées.",
    color: "var(--vert-menthe)",
    bgColor: "rgba(56, 178, 155, 0.08)",
  },
];

export default function ProgramsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      const header = section.querySelectorAll(".programs-header");
      gsap.set(header, { y: 40, opacity: 0 });
      gsap.to(header, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });

      // Cards batch reveal
      ScrollTrigger.batch(".program-card", {
        onEnter: (elements) => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          });
        },
        start: "top 85%",
      });

      // Set initial state for cards
      gsap.set(".program-card", { y: 60, opacity: 0 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="programmes"
      className="relative py-24 md:py-32"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="programs-header text-label text-[var(--vert-menthe)] block mb-3">
              Connaître & Faire Connaître
            </span>
            <h2 className="programs-header text-display-md text-[var(--bleu-ocean)]">
              Nos Programmes
            </h2>
          </div>
          <p className="programs-header text-body-lg text-[var(--gris-typo)] max-w-md">
            Des initiatives créatives et spirituelles pour conduire chaque 
            génération dans une rencontre vivante avec Dieu.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.title}
              className="program-card group card p-7 flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: program.bgColor,
                  color: program.color,
                }}
              >
                {program.icon}
              </div>

              {/* Content */}
              <h3
                className="font-display font-semibold text-xl mb-3 text-[var(--bleu-ocean)] group-hover:text-[var(--orange-joie)] transition-colors duration-300"
              >
                {program.title}
              </h3>
              <p className="text-[var(--gris-typo)] text-[0.95rem] leading-relaxed flex-1">
                {program.description}
              </p>

              {/* Link */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--orange-joie)] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                En savoir plus
                <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
