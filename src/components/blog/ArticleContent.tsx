'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readTime: number;
  views: number;
  publishedAt: string | Date | null;
  category: { name: string; slug: string; color: string } | null;
  author: { id: string; name: string; image: string | null };
  tags: { tag: { id: number; name: string; slug: string } }[];
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  readTime: number;
  publishedAt: string | Date | null;
  category: { name: string; slug: string; color: string } | null;
  author: { name: string; image: string | null };
}

function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="article-h3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="article-h2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="article-h1">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="article-quote">$1</blockquote>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="article-li">$1</li>')
    // Paragraphs (lines not starting with < and not empty)
    .replace(/^(?!<|$)(.*$)/gm, '<p class="article-p">$1</p>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li class="article-li">.*<\/li>\n?)+/g, (match) => `<ul class="article-ul">${match}</ul>`)
    // Clean up extra newlines
    .replace(/\n{2,}/g, '\n');
}

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function renderContent(content: string): string {
  if (!content) return '';
  if (isHtmlContent(content)) {
    return content;
  }
  return renderMarkdown(content);
}

export default function ArticleContent({
  post,
  relatedPosts,
}: {
  post: PostData;
  relatedPosts: RelatedPost[];
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLSelectElement | null>(null);

  const formatDate = (d: string | Date | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Image subtle parallax
      if (heroRef.current) {
        const img = heroRef.current.querySelector('.hero-img');
        if (img) {
          gsap.to(img, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }

      // Content fade-in on scroll
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll(
          '.article-h1, .article-h2, .article-h3, .article-p, .article-quote, .article-ul, h1, h2, h3, p, blockquote, ul, ol, img, pre'
        );
        gsap.from(elements, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const htmlContent = renderContent(post.content);

  return (
    <article className="bg-surface relative selection:bg-[#FF7F3F] selection:text-surface">
      <div className="absolute inset-0 texture-paper pointer-events-none mix-blend-multiply opacity-50 z-0"></div>

      {/* Hero Brutalist Style */}
      <div ref={heroRef} className="relative z-10 border-b-4 border-on-surface w-full overflow-hidden">
        <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-32 pb-16 lg:pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Title / Meta */}
            <div className="flex-1 lg:w-1/2 lg:sticky top-32">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 border-2 border-on-surface shadow-[4px_4px_0px_0px_var(--color-on-surface)] bg-on-surface text-surface px-5 py-2.5 hover:bg-[#FF7F3F] hover:shadow-[2px_2px_0px_0px_var(--color-on-surface)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-space-grotesk font-bold uppercase tracking-widest text-xs mb-8"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Retour
              </Link>
              
              {post.category && (
                <div className="mb-8 flex">
                  <span
                    className="inline-block border-2 border-on-surface px-4 py-2 font-space-grotesk font-bold uppercase tracking-[0.2em] text-xs shadow-[4px_4px_0px_0px_var(--color-on-surface)]"
                    style={{ backgroundColor: post.category.color, color: '#fff' }}
                  >
                    {post.category.name}
                  </span>
                </div>
              )}

              <h1
                className="text-4xl md:text-5xl xl:text-6xl text-on-surface leading-[0.95] tracking-tight mb-10 uppercase"
                style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 900 }}
              >
                {post.title}
              </h1>

              {/* Meta bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 font-space-grotesk font-bold text-xs uppercase tracking-widest border-t-4 border-b-4 border-on-surface py-6">
                <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                  <span className="text-on-surface/50 text-[10px]">Auteur</span>
                  <div className="flex items-center gap-3">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="border-2 border-on-surface outline outline-2 outline-offset-2 outline-[#FF7F3F]"
                      />
                    ) : (
                       <div className="w-8 h-8 border-2 border-on-surface bg-[#1C3B5E] text-surface flex items-center justify-center">
                         <span className="material-symbols-outlined text-sm">person</span>
                       </div>
                    )}
                    <span className="font-epilogue tracking-tight leading-none text-sm">{post.author.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-on-surface/50 text-[10px]">Date</span>
                  <span className="leading-none text-sm">{formatDate(post.publishedAt)}</span>
                </div>
                
                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-on-surface/50 text-[10px]">Lecture</span>
                  <span className="leading-none text-sm">{post.readTime} MIN</span>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-on-surface/50 text-[10px]">Vues</span>
                  <span className="leading-none text-sm flex items-center gap-1">
                     <span className="material-symbols-outlined text-sm text-[#FF7F3F]">visibility</span>
                     {post.views}
                  </span>
                </div>
              </div>
            </div>

            {/* Cover Image in Hero */}
            <div className="w-full lg:w-1/2 relative aspect-square md:aspect-[4/5] border-4 border-on-surface shadow-[12px_12px_0px_0px_var(--color-on-surface)] overflow-hidden group bg-[#1C3B5E]">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="hero-img object-cover filter contrast-125 transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full texture-dots flex items-center justify-center bg-[#FF7F3F]">
                  <span className="font-space-grotesk text-6xl opacity-20 font-black text-on-surface mix-blend-overlay">IMAGE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="relative z-10 w-full bg-surface">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          
          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-16">
              <span className="block font-space-grotesk text-xs uppercase tracking-widest text-[#FF7F3F] font-black mb-4">
                [ Abstract ]
              </span>
              <p
                className="text-2xl md:text-3xl lg:text-4xl text-on-surface leading-[1.2] font-black tracking-tight"
                style={{ fontFamily: 'var(--font-epilogue), sans-serif' }}
              >
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div
            ref={contentRef}
            className="article-body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags Brutalist */}
          {post.tags.length > 0 && (
            <div className="mt-20 pt-10 border-t-4 border-on-surface">
              <h4 className="font-space-grotesk font-black uppercase text-sm tracking-widest mb-6">Tags associés</h4>
              <div className="flex flex-wrap gap-3">
                {post.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-4 py-2 border-2 border-on-surface bg-on-surface/5 text-on-surface font-space-grotesk font-bold uppercase tracking-widest text-xs hover:bg-[#38B29B] hover:text-surface hover:shadow-[4px_4px_0px_0px_var(--color-on-surface)] hover:-translate-y-1 transition-all"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share / Back */}
          <div className="mt-16 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-on-surface bg-[#1C3B5E] text-surface font-space-grotesk font-bold uppercase tracking-widest text-xs
                         hover:bg-[#FF7F3F] hover:-translate-y-1 shadow-[4px_4px_0px_0px_var(--color-on-surface)] transition-all duration-300"
            >
              <span className="material-symbols-outlined text-sm">view_cozy</span>
              Tous les articles
            </Link>
          </div>
        </div>
      </div>

      {/* Related Posts - Brutalist Style */}
      {relatedPosts.length > 0 && (
        <section className="relative py-24 bg-surface border-t-4 border-on-surface">
          <div className="absolute inset-0 texture-grid opacity-20 pointer-events-none"></div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-on-surface font-epilogue mb-2">
                  LIRE <span className="text-outline">PLUS</span>
                </h2>
                <p className="font-space-grotesk font-bold uppercase tracking-widest text-on-surface/60 text-xs">
                  Dans la même catégorie
                </p>
              </div>
              <Link
                href={`/blog?category=${post.category?.slug}`}
                className="hidden md:inline-flex items-center gap-2 group font-space-grotesk font-bold uppercase tracking-widest text-xs border-b-2 border-on-surface pb-1 hover:text-[#FF7F3F] hover:border-[#FF7F3F] transition-colors"
               >
                VOIR TOUT <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group relative flex flex-col bg-surface border-2 border-on-surface hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_var(--color-on-surface)] transition-all duration-300"
                >
                  <div className="aspect-[4/3] w-full relative border-b-2 border-on-surface overflow-hidden bg-[#1C3B5E]">
                    {rp.coverImage ? (
                      <Image
                        src={rp.coverImage}
                        alt={rp.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                        className="object-cover filter contrast-125 transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full texture-dots flex items-center justify-center opacity-30 mix-blend-overlay"></div>
                    )}
                    {rp.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className="inline-block px-3 py-1 border-2 border-on-surface text-[10px] font-space-grotesk font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-on-surface)] text-white"
                          style={{ backgroundColor: rp.category.color }}
                        >
                          {rp.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-4 text-[10px] font-space-grotesk font-bold tracking-widest uppercase text-on-surface/60">
                      <span>{formatDate(rp.publishedAt)}</span>
                      <span className="w-1 h-1 bg-on-surface"></span>
                      <span>{rp.readTime} MIN</span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl text-on-surface uppercase leading-tight mb-4 group-hover:text-[#FF7F3F] transition-colors"
                      style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 800 }}
                    >
                      {rp.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex justify-between items-center border-t-2 border-on-surface">
                       <span className="font-space-grotesk font-bold text-xs uppercase underline decoration-2 underline-offset-4 decoration-transparent group-hover:decoration-on-surface transition-all">
                         LIRE L'ARTICLE
                       </span>
                       <span className="material-symbols-outlined bg-on-surface text-surface group-hover:bg-[#FF7F3F] w-8 h-8 flex flex-col items-center justify-center transition-all">
                         arrow_outward
                       </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link
                href={`/blog?category=${post.category?.slug}`}
                className="inline-flex items-center gap-2 group font-space-grotesk font-bold uppercase tracking-widest border-2 border-on-surface px-6 py-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-on-surface)] transition-all bg-[#FF7F3F] text-surface"
               >
                VOIR TOUT <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

