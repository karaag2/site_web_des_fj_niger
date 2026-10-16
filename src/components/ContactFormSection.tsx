"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactFormSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "", subject: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastSubmittedName, setLastSubmittedName] = useState<string>("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(
        [cardRef.current, infoRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Subtle tilt for the form card
      const tiltMove = (e: MouseEvent) => {
        if (!cardRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        gsap.to(cardRef.current, {
          rotateX: -y * 8,
          rotateY: x * 8,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      if (cardRef.current) {
        cardRef.current.addEventListener("mousemove", tiltMove);
        cardRef.current.addEventListener("mouseleave", () => {
          gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 1 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data && data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(
          (data && data.error) ||
            "Une erreur est survenue lors de l'envoi de votre message. Veuillez vérifier vos données et réessayer."
        );
      }

      setLastSubmittedName(formData.name);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "", subject: "" });
    } catch (err: unknown) {
      console.error("Erreur d'envoi du formulaire de contact:", err);
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Impossible de joindre le serveur. Veuillez vérifier votre connexion internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitStatus("idle");
    setErrorMessage(null);
    setFieldErrors({});
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 bg-surface text-on-surface overflow-hidden"
    >
      {/* Texture Background */}
      <div className="absolute inset-0 texture-grid opacity-5 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* --- Col 1: Contact Info --- */}
          <div ref={infoRef} className="lg:col-span-2 space-y-12">
            <div>
              <span className="font-space-grotesk text-xs uppercase tracking-[0.4em] text-primary font-bold mb-4 block">
                COORDONNÉES
              </span>
              <h2 className="font-epilogue text-4xl font-black uppercase tracking-tighter mb-8 max-w-xs">
                Où nous <span className="text-primary italic">Trouver</span>
              </h2>
              
              <div className="space-y-10">
                <div className="group cursor-pointer">
                  <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-on-surface/40 block mb-2">BUREAU CENTRAL</span>
                  <p className="font-inter text-xl group-hover:text-primary transition-colors duration-300">
                    Quartier Kouara Kano, <br /> Niamey, Niger
                  </p>
                </div>

                <div className="group cursor-pointer">
                  <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-on-surface/40 block mb-2">TELEPHONE</span>
                  <p className="font-inter text-xl group-hover:text-primary transition-colors duration-300">
                    +227 96 00 00 00
                  </p>
                </div>

                <div className="group cursor-pointer">
                  <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-on-surface/40 block mb-2">EMAIL</span>
                  <p className="font-inter text-xl group-hover:text-primary transition-colors duration-300">
                    contact@fabricantsdejoie.ne
                  </p>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div className="pt-8">
              <span className="font-space-grotesk text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-6 block">
                SUIVEZ-NOUS
              </span>
              <div className="flex gap-10">
                {["Instagram", "Facebook", "Twitter"].map((social) => (
                  <a key={social} href="#" className="group relative font-space-grotesk text-sm uppercase tracking-widest hover:text-primary transition-colors">
                    <span className="relative z-10">{social}</span>
                    <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Decorative Element */}
            <div className="pt-10">
              <div className="relative w-full aspect-[21/9] lg:aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-xl">
                <img 
                  src="/images/enfant.webp" 
                  alt="Joyful child" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          {/* --- Col 2: The Form --- */}
          <div ref={cardRef} className="lg:col-span-3 perspective-1000">
            <div className="glass-nav border border-on-surface/5 p-8 md:p-12 shadow-2xl rounded-sm relative overflow-hidden">
              {submitStatus === "success" ? (
                <div className="py-8 text-center space-y-6">
                  {/* Joyful Icon Badge */}
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-3xl shadow-lg">
                    ✦
                  </div>

                  <div className="space-y-3">
                    <span className="font-space-grotesk text-xs uppercase tracking-[0.3em] text-primary font-bold block">
                      CONFIRMATION D'ENVOI
                    </span>
                    <h3 className="font-epilogue text-3xl md:text-4xl font-black uppercase tracking-tight">
                      Message Reçu <span className="text-primary italic">Avec Joie</span> !
                    </h3>
                  </div>

                  <p className="font-inter text-on-surface/80 text-lg max-w-lg mx-auto leading-relaxed">
                    Merci <strong className="text-on-surface">{lastSubmittedName || "infiniment"}</strong>. Votre message a bien été transmis à l'équipe des Fabricants de Joie du Niger. Nous vous répondrons dans les plus brefs délais.
                  </p>

                  <div className="pt-6">
                    <button
                      onClick={handleResetForm}
                      className="group relative overflow-hidden bg-on-surface text-surface font-epilogue font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-sm transition-all hover:bg-primary shadow-lg inline-flex items-center gap-3"
                    >
                      <span>Envoyer un autre message</span>
                      <span className="transition-transform group-hover:rotate-45">↺</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitStatus === "error" && errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-sm flex items-start gap-3">
                      <span className="text-lg">⚠</span>
                      <div className="text-left">
                        <p className="font-space-grotesk font-bold text-xs uppercase tracking-wider">Erreur d&apos;envoi</p>
                        <p className="font-inter text-sm opacity-90">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group text-left">
                      <label htmlFor="contact-name" className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-on-surface/50 mb-2 block font-semibold">
                        Nom Complet *
                      </label>
                      <input 
                        id="contact-name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="Votre nom"
                        className={`w-full bg-transparent border-b py-3 focus:outline-none font-inter text-base md:text-lg transition-all ${
                          fieldErrors.name ? "border-red-500 focus:border-red-600" : "border-on-surface/15 focus:border-primary"
                        }`}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      {fieldErrors.name && (
                        <span className="font-inter text-xs text-red-500 mt-1 block">{fieldErrors.name}</span>
                      )}
                    </div>
                    
                    <div className="relative group text-left">
                      <label htmlFor="contact-email" className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-on-surface/50 mb-2 block font-semibold">
                        Email *
                      </label>
                      <input 
                        id="contact-email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="votre@email.com"
                        className={`w-full bg-transparent border-b py-3 focus:outline-none font-inter text-base md:text-lg transition-all ${
                          fieldErrors.email ? "border-red-500 focus:border-red-600" : "border-on-surface/15 focus:border-primary"
                        }`}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      {fieldErrors.email && (
                        <span className="font-inter text-xs text-red-500 mt-1 block">{fieldErrors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="relative group text-left">
                    <label htmlFor="contact-subject" className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-on-surface/50 mb-2 block font-semibold">
                      Sujet
                    </label>
                    <input 
                      id="contact-subject"
                      type="text"
                      disabled={isSubmitting}
                      placeholder="De quoi voulez-vous discuter ?"
                      className={`w-full bg-transparent border-b py-3 focus:outline-none font-inter text-base md:text-lg transition-all ${
                        fieldErrors.subject ? "border-red-500 focus:border-red-600" : "border-on-surface/15 focus:border-primary"
                      }`}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                    {fieldErrors.subject && (
                      <span className="font-inter text-xs text-red-500 mt-1 block">{fieldErrors.subject}</span>
                    )}
                  </div>

                  <div className="relative group text-left">
                    <label htmlFor="contact-message" className="font-space-grotesk text-[10px] uppercase tracking-[0.3em] text-on-surface/50 mb-2 block font-semibold">
                      Message *
                    </label>
                    <textarea 
                      id="contact-message"
                      rows={4}
                      required
                      disabled={isSubmitting}
                      placeholder="Partagez vos pensées..."
                      className={`w-full bg-transparent border-b py-3 focus:outline-none font-inter text-base md:text-lg transition-all resize-none ${
                        fieldErrors.message ? "border-red-500 focus:border-red-600" : "border-on-surface/15 focus:border-primary"
                      }`}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                    {fieldErrors.message && (
                      <span className="font-inter text-xs text-red-500 mt-1 block">{fieldErrors.message}</span>
                    )}
                  </div>

                  <div className="pt-4 relative group text-left">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden bg-primary text-white font-epilogue font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-sm w-full md:w-auto shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-4">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer Le Message
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 h-0 bg-secondary group-hover:h-full transition-all duration-300 z-0"></div>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
