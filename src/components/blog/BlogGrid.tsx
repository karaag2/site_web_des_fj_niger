'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';

interface PostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readTime: number;
  publishedAt: string | Date | null;
  featured: boolean;
  category: { name: string; slug: string; color: string } | null;
  author: { id: string; name: string; image: string | null };
  tags: { tag: { id: number; name: string; slug: string } }[];
}

interface BlogGridProps {
  posts: PostData[];
  page: number;
  totalPages: number;
  total: number;
  activeCategory?: string;
  activeTag?: string;
  searchQuery?: string;
}

export default function BlogGrid({
  posts,
  page,
  totalPages,
  total,
  activeCategory,
  activeTag,
  searchQuery,
}: BlogGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.blog-card');
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'expo.out',
    });
  }, [posts]);

  const formatDate = (d: string | Date | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    return `/blog?${params.toString()}`;
  };

  const hasFilters = activeCategory || activeTag || searchQuery;

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 border-on-surface pb-6">
        <div>
          <h2
            className="text-4xl md:text-5xl uppercase tracking-tighter text-on-surface"
            style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 800 }}
          >
            {activeCategory
              ? `Cat. ${activeCategory}`
              : activeTag
              ? `Tag #${activeTag}`
              : searchQuery
              ? `Mot: "${searchQuery}"`
              : 'Index'}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs text-on-surface-variant font-space-grotesk tracking-widest uppercase font-bold">
              [ {total} ARTICLE{total !== 1 ? 'S' : ''} ]
            </p>
            {hasFilters && (
              <Link
                href="/blog"
                className="text-[10px] font-space-grotesk font-bold uppercase tracking-widest bg-on-surface text-surface px-2 py-1 hover:bg-[#FF7F3F] transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`blog-card group flex flex-col bg-surface border-2 border-on-surface hover:shadow-[8px_8px_0px_0px_#1C3B5E] hover:-translate-y-2 hover:-translate-x-2 transition-all duration-300 relative
                          ${i === 0 && page === 1 && !hasFilters ? 'md:col-span-2' : ''}`}
            >
              {/* Featured / Category Badge over image border */}
              <div className="absolute -top-3 -right-3 z-10 flex gap-2">
                {post.featured && (
                  <div className="bg-[#FFC82C] border-2 border-on-surface w-10 h-10 flex items-center justify-center p-1 rounded-full shadow-[2px_2px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-on-surface">star</span>
                  </div>
                )}
              </div>

              {/* Image Container */}
              <div className={`w-full overflow-hidden border-b-2 border-on-surface bg-surface-container ${
                i === 0 && page === 1 && !hasFilters ? 'aspect-[21/9]' : 'aspect-[4/3]'
              }`}>
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover filter contrast-125 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full texture-dots text-on-surface/5 flex items-center justify-center">
                    <span className="font-space-grotesk text-4xl opacity-10">IMG</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 bg-surface">
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-4">
                  {post.category && (
                    <span className="font-space-grotesk text-[10px] uppercase tracking-widest font-bold px-2 py-1 border border-current text-on-surface" style={{ borderColor: post.category.color, color: post.category.color }}>
                      {post.category.name}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-2">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>/</span>
                    <span>{post.readTime} MIN.</span>
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-epilogue font-bold leading-tight text-on-surface group-hover:text-[#FF7F3F] transition-colors mb-4 line-clamp-3"
                >
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 flex-1 font-inter">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between border-t-2 border-on-surface/10 pt-4">
                  {/* Tags */}
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map(({ tag }) => (
                      <span key={tag.id} className="font-space-grotesk text-[9px] uppercase tracking-wider text-on-surface-variant">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                  <span className="w-8 h-8 rounded-full border border-on-surface flex items-center justify-center group-hover:bg-[#FF7F3F] group-hover:border-[#FF7F3F] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-on-surface-variant/30">
          <span className="font-space-grotesk text-6xl text-on-surface-variant/20 mb-4">404</span>
          <h3 className="text-2xl md:text-4xl font-epilogue font-black uppercase text-on-surface mb-2 tracking-tighter">
            Rien à signaler
          </h3>
          <p className="text-sm font-inter text-on-surface-variant max-w-sm text-center">
            Aucun article ne correspond à votre sélection actuelle. Essayez d'autres mots-clés ou réinitialisez les filtres.
          </p>
        </div>
      )}

      {/* Pagination (Brutalist style) */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1 mt-16 font-space-grotesk font-bold">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-4 py-2 border-2 border-on-surface text-on-surface hover:bg-on-surface hover:text-surface transition-colors text-xs uppercase tracking-widest mr-4"
            >
              &lt; Préc.
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`w-10 h-10 flex items-center justify-center border-2 text-sm transition-colors
                ${p === page
                  ? 'bg-on-surface text-surface border-on-surface scale-110 shadow-[2px_2px_0px_0px_#FF7F3F] z-10'
                  : 'border-transparent text-on-surface-variant hover:border-on-surface-variant'
                }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 border-2 border-on-surface text-on-surface hover:bg-on-surface hover:text-surface transition-colors text-xs uppercase tracking-widest ml-4"
            >
              Suiv. &gt;
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
