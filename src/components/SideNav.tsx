"use client";

import React from "react";

export default function SideNav() {
  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full z-[100] flex-col justify-between py-12 px-3 bg-surface/20 dark:bg-black/30 backdrop-blur-xl border-r border-white/5 w-16 hover:w-60 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group shadow-2xl overflow-hidden">
      <div className="flex flex-col items-center group-hover:items-start group-hover:px-4 transition-all">
        <div className="text-xl font-black font-epilogue text-primary mb-12 uppercase tracking-tighter mt-8 h-8 flex items-center">
          <span className="group-hover:hidden">FJ</span>
          <span className="hidden group-hover:inline opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
            Fabricants <span className="text-secondary italic">de Joie</span>
          </span>
        </div>

        <div className="flex flex-col gap-10">
          <a
            href="/#hero"
            className="flex items-center gap-4 text-on-surface hover:text-primary transition-all duration-300 group/link"
          >
            <span className="material-symbols-outlined text-2xl group-hover/link:scale-110 transition-transform" data-icon="blur_on">
              blur_on
            </span>
            <span className="hidden group-hover:block font-space-grotesk text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold">
              Accueil
            </span>
          </a>

          <a
            href="/#lookbook"
            className="flex items-center gap-4 text-on-surface/60 hover:text-primary transition-all duration-300 group/link"
          >
            <span className="material-symbols-outlined text-2xl group-hover/link:scale-110 transition-transform" data-icon="auto_awesome_motion">
              auto_awesome_motion
            </span>
            <span className="hidden group-hover:block font-space-grotesk text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Lookbook
            </span>
          </a>

          <a
            href="/#histoires"
            className="flex items-center gap-4 text-on-surface/60 hover:text-primary transition-all duration-300 group/link"
          >
            <span className="material-symbols-outlined text-2xl group-hover/link:scale-110 transition-transform" data-icon="auto_stories">
              auto_stories
            </span>
            <span className="hidden group-hover:block font-space-grotesk text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Histoires
            </span>
          </a>

          <a
            href="/contact"
            className="flex items-center gap-4 text-on-surface/60 hover:text-primary transition-all duration-300 group/link"
          >
            <span className="material-symbols-outlined text-2xl group-hover/link:scale-110 transition-transform" data-icon="alternate_email">
              alternate_email
            </span>
            <span className="hidden group-hover:block font-space-grotesk text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Contact
            </span>
          </a>

          <a
            href="/contact"
            className="flex items-center gap-4 text-on-surface/60 hover:text-secondary transition-all duration-300 group/link"
          >
            <span className="material-symbols-outlined text-2xl text-secondary group-hover/link:scale-110 transition-transform" data-icon="volunteer_activism">
              volunteer_activism
            </span>
            <span className="hidden group-hover:block font-space-grotesk text-[10px] uppercase tracking-widest text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold">
              Rejoindre
            </span>
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center group-hover:items-start group-hover:px-4 transition-all gap-6">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 hover:border-primary transition-all cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover"
            alt="User Profile"
            src="/images/unnamed.webp"
          />
        </div>
        <div className="bg-primary text-on-primary w-8 h-8 flex items-center justify-center font-black text-[10px] rounded-none hover:bg-secondary transition-all cursor-pointer">
          N
        </div>
      </div>
    </nav>
  );
}
