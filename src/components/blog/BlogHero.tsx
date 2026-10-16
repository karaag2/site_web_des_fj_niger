'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readTime: number;
  publishedAt: string | Date | null;
  category: { name: string; slug: string; color: string } | null;
  author: { name: string; image: string | null };
}

export default function BlogHero({ featuredPosts }: { featuredPosts: FeaturedPost[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);
  const fragMainRef = useRef<HTMLAnchorElement>(null);
  const fragSide1Ref = useRef<HTMLAnchorElement>(null);
  const fragSide2Ref = useRef<HTMLAnchorElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgShapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEls = [text1Ref.current, text2Ref.current, text3Ref.current].filter(Boolean);
      const fragEls = [fragMainRef.current, fragSide1Ref.current, fragSide2Ref.current].filter(Boolean);

      // Initial hide
      if (textEls.length) gsap.set(textEls, { y: 150, opacity: 0, rotation: 5 });
      if (fragEls.length) gsap.set(fragEls, { scale: 0.8, opacity: 0 });
      if (badgeRef.current) gsap.set(badgeRef.current, { scale: 0, rotation: -45 });
      if (bgShapesRef.current) gsap.set(bgShapesRef.current, { opacity: 0 });

      // Entrance Sequence
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (textEls.length) {
        tl.to(textEls, {
          y: 0,
          opacity: 1,
          rotation: (i: number) => [-1, 2, -2][i],
          duration: 1.8,
          stagger: 0.15,
          delay: 0.2,
        });
      }
      if (badgeRef.current) {
        tl.to(badgeRef.current, { scale: 1, rotation: 12, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, textEls.length ? '-=1.4' : 0);
      }
      if (fragEls.length) {
        tl.to(fragEls, { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2 }, '-=1.2');
      }
      if (bgShapesRef.current) {
        tl.to(bgShapesRef.current, { opacity: 1, duration: 2 }, '-=1.5');
      }

      // Scroll Parallax
      if (wrapperRef.current) {
        gsap.to(wrapperRef.current, {
          y: 150,
          opacity: 0,
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (fragMainRef.current) {
        gsap.to(fragMainRef.current, {
          y: -150,
          rotation: -4,
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
      }
      if (fragSide1Ref.current) {
        gsap.to(fragSide1Ref.current, {
          y: -250,
          rotation: 15,
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        });
      }
      if (fragSide2Ref.current) {
        gsap.to(fragSide2Ref.current, {
          y: -100,
          scale: 0.9,
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 2 },
        });
      }

    }, containerRef);

    // Mouse Magnetic Depth
    const onMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

      const textEls = [text1Ref.current, text2Ref.current, text3Ref.current].filter(Boolean);
      if (textEls.length) {
        gsap.to(textEls, {
          x: -xPos * 30,
          y: -yPos * 30,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.05,
        });
      }
      if (fragMainRef.current) {
        gsap.to(fragMainRef.current, {
          x: xPos * 40,
          y: yPos * 40,
          rotation: -2 + xPos * 4,
          duration: 2,
          ease: 'power3.out',
        });
      }
      if (fragSide1Ref.current) {
        gsap.to(fragSide1Ref.current, {
          x: xPos * -60,
          y: yPos * -60,
          rotation: 12 + yPos * -10,
          duration: 2.5,
          ease: 'power3.out',
        });
      }
      if (bgShapesRef.current) {
        gsap.to(bgShapesRef.current, { rotation: xPos * 5, duration: 3, ease: 'power1.out' });
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      ctx.revert();
    };
  }, []);

  const mainPost = featuredPosts[0];
  const sidePost1 = featuredPosts[1];
  const sidePost2 = featuredPosts[2];

  const formatDate = (d: string | Date | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <section
      id="blog-hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-40 mb-20 bg-surface"
    >
      {/* Background Decoration Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 texture-paper opacity-30 z-10"></div>
        <div className="absolute inset-0 texture-dots z-0"></div>

        {/* Blurred orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#FF7F3F]/10 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#38B29B]/10 rounded-full blur-[120px] mix-blend-multiply"></div>

        {/* Topological Lines */}
        <div ref={bgShapesRef} className="absolute inset-0 select-none will-change-transform z-10 text-on-surface/[0.05]">
          <svg width="100%" height="100%" viewBox="0 0 1400 800" fill="none" className="absolute inset-0">
            <path d="M-100,200 C300,500 500,100 800,400 C1100,700 1300,300 1500,500" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="900" cy="300" r="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 10" />
            <circle cx="200" cy="600" r="150" stroke="currentColor" strokeWidth="0.3" />
          </svg>

          {/* Registration marks */}
          <div className="absolute top-[20%] left-[10%] w-4 h-4 text-on-surface/[0.2] text-xs">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
          </div>
          <div className="absolute bottom-[25%] right-[15%] w-6 h-6 text-on-surface/[0.2] text-xs">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current"></div>
          </div>

          <span className="font-space-grotesk text-[15vw] font-bold text-on-surface/[0.02] tracking-widest absolute -right-[5%] top-[10%] leading-none">
            EXTRA
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4" ref={wrapperRef}>
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          
          {/* Section Info */}
          <div className="absolute top-0 left-4 md:left-12 flex flex-col gap-2 z-30">
            <span className="w-8 h-[2px] bg-[#FF7F3F]"></span>
            <span className="font-space-grotesk text-[10px] md:text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">
              Le Journal <br /> des Fabricants
            </span>
          </div>

          {/* Typography Collage */}
          <div className="flex flex-col gap-0 items-center justify-center mt-10 w-full relative z-20 pointer-events-none">
            <h2 ref={text1Ref} className="font-epilogue text-[clamp(4rem,16vw,12rem)] leading-[0.8] font-black uppercase tracking-tighter text-[#1C3B5E] -rotate-1 mix-blend-multiply opacity-90 will-change-transform z-10">
              Histoires
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 -mt-4 md:-mt-8 z-10 w-full relative">
              <h2 ref={text2Ref} className="font-epilogue text-[clamp(3rem,12vw,9rem)] leading-[0.8] font-black uppercase tracking-tighter text-on-surface rotate-2 will-change-transform">
                De
              </h2>
              {/* Floating Badge */}
              <div ref={badgeRef} className="my-2 md:mb-12 w-24 h-24 md:w-36 md:h-36 rounded-full bg-[#38B29B] flex flex-col items-center justify-center text-white font-epilogue rotate-12 shadow-2xl p-2 md:p-4 will-change-transform z-40 pointer-events-auto cursor-pointer hover:bg-[#FF7F3F] transition-colors duration-500">
                <span className="font-bold text-sm md:text-lg leading-none">FJ</span>
                <span className="text-[10px] md:text-xs opacity-80 mt-1">Niger Blog</span>
              </div>
              <h2 ref={text3Ref} className="font-epilogue text-[clamp(4.5rem,18vw,14rem)] leading-[0.8] font-black uppercase tracking-tighter text-[#FF7F3F] -rotate-2 mix-blend-multiply will-change-transform">
                Joie
              </h2>
            </div>
          </div>

          {/* Fragments / Links to Posts */}
          
          {/* Main Featured Fragment */}
          {mainPost && (
            <Link
              href={`/blog/${mainPost.slug}`}
              ref={fragMainRef}
              className="absolute group z-30 top-[40%] md:top-[30%] -right-4 md:right-[5%] lg:right-[15%] w-64 md:w-[450px] aspect-[4/5] md:aspect-video bg-surface-container-lowest shadow-2xl p-3 md:p-5 -rotate-2 will-change-transform cursor-pointer hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="relative w-full h-full overflow-hidden">
                {mainPost.coverImage ? (
                  <Image
                    src={mainPost.coverImage}
                    alt={mainPost.title}
                    fill
                    sizes="(max-width: 768px) 256px, 450px"
                    className="object-cover filter contrast-125 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#FF7F3F]/20"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  {mainPost.category && (
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md text-[8px] md:text-[10px] uppercase tracking-widest mb-2 font-space-grotesk" style={{ borderLeft: `3px solid ${mainPost.category.color}` }}>
                      {mainPost.category.name}
                    </span>
                  )}
                  <h3 className="font-epilogue font-bold text-lg md:text-2xl leading-tight line-clamp-2 md:line-clamp-3 mb-2 group-hover:text-[#FF7F3F] transition-colors">
                    {mainPost.title}
                  </h3>
                  <div className="font-mono text-[10px] text-white/50">{formatDate(mainPost.publishedAt)}</div>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3 bg-[#1C3B5E] text-white font-space-grotesk text-[8px] md:text-[10px] px-3 py-1 uppercase tracking-widest shadow-lg">
                À La Une / 01
              </div>
            </Link>
          )}

          {/* Side Fragment 1 */}
          {sidePost1 && (
            <Link
              href={`/blog/${sidePost1.slug}`}
              ref={fragSide1Ref}
              className="absolute hidden md:block z-40 top-10 left-[10%] w-48 h-56 bg-surface-container-lowest shadow-xl p-2 rotate-12 will-change-transform cursor-pointer group hover:rotate-6 transition-all duration-500"
            >
              <div className="relative w-full h-full overflow-hidden">
                {sidePost1.coverImage && (
                  <Image
                    src={sidePost1.coverImage}
                    alt={sidePost1.title}
                    fill
                    sizes="192px"
                    className="object-cover sepia-[0.3] group-hover:sepia-0 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-epilogue font-bold text-xs text-white leading-snug line-clamp-2 group-hover:text-[#FF7F3F]">
                    {sidePost1.title}
                  </h3>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-white border border-on-surface/10 text-on-surface font-mono text-[8px] px-2 py-1 shadow-sm">
                #02
              </div>
            </Link>
          )}

          {/* Side Fragment 2 (Circular/Badge) */}
          {sidePost2 && (
            <Link
              href={`/blog/${sidePost2.slug}`}
              ref={fragSide2Ref}
              className="absolute hidden lg:block z-20 bottom-[-5%] left-[20%] w-40 h-40 rounded-full overflow-hidden border-8 border-surface-container shadow-2xl -rotate-6 will-change-transform cursor-pointer group hover:scale-105 transition-transform duration-500"
            >
              {sidePost2.coverImage && (
                <Image
                  src={sidePost2.coverImage}
                  alt={sidePost2.title}
                  fill
                  sizes="160px"
                  className="object-cover filter contrast-125 group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center p-4">
                <h3 className="font-epilogue font-bold text-white text-[10px] text-center leading-tight line-clamp-3">
                  {sidePost2.title}
                </h3>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
