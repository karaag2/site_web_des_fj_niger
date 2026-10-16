'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  color: string;
  _count: { posts: number };
}

interface TagData {
  id: number;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface BlogSidebarProps {
  categories: CategoryData[];
  tags: TagData[];
  activeCategory?: string;
  activeTag?: string;
}

export default function BlogSidebar({ categories, tags, activeCategory, activeTag }: BlogSidebarProps) {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const blocks = sidebarRef.current.querySelectorAll('.sidebar-block');
    gsap.from(blocks, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.3,
      ease: 'expo.out',
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <aside ref={sidebarRef} className="sticky top-28 space-y-10 font-inter">
      {/* Search */}
      <div className="sidebar-block">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="RECHERCHER..."
            className="w-full px-5 py-4 pr-12 text-sm bg-surface
                       border-2 border-on-surface text-on-surface placeholder:text-on-surface-variant/50
                       outline-none transition-all duration-300
                       focus:shadow-[4px_4px_0px_0px_#1C3B5E] font-space-grotesk tracking-widest uppercase font-bold"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full aspect-square border-l-2 border-on-surface flex items-center justify-center
                       bg-surface text-on-surface hover:bg-[#FF7F3F] hover:text-surface transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="sidebar-block">
        <h3
          className="text-xs font-black uppercase tracking-[0.2em] text-on-surface mb-5 pl-2 border-l-4 border-[#FF7F3F]"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
        >
          Catégories
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={activeCategory === cat.slug ? '/blog' : `/blog?category=${cat.slug}`}
              className={`flex items-center justify-between px-4 py-3 border-2 transition-all duration-300 group
                ${activeCategory === cat.slug
                  ? 'bg-on-surface text-surface border-on-surface shadow-[4px_4px_0px_0px_#FF7F3F]'
                  : 'bg-surface text-on-surface border-on-surface hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_#1C3B5E]'
                }`}
            >
              <span className="flex items-center gap-3 font-epilogue font-bold text-sm tracking-tight">
                <span
                  className="w-3 h-3 border border-current"
                  style={{ backgroundColor: activeCategory === cat.slug ? 'currentColor' : cat.color }}
                ></span>
                {cat.name}
              </span>
              <span className="text-xs font-space-grotesk font-bold">
                [ {cat._count.posts} ]
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="sidebar-block">
        <h3
          className="text-xs font-black uppercase tracking-[0.2em] text-on-surface mb-5 pl-2 border-l-4 border-[#38B29B]"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
        >
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags
            .filter((t) => t._count.posts > 0)
            .map((tag) => (
              <Link
                key={tag.id}
                href={activeTag === tag.slug ? '/blog' : `/blog?tag=${tag.slug}`}
                className={`px-3 py-2 border-2 text-[10px] font-space-grotesk font-bold tracking-widest uppercase transition-all duration-300
                  ${activeTag === tag.slug
                    ? 'bg-[#38B29B] text-surface border-[#38B29B]'
                    : 'bg-surface text-on-surface border-on-surface hover:bg-on-surface hover:text-surface'
                  }`}
              >
                #{tag.name}
              </Link>
            ))}
        </div>
      </div>

      {/* Newsletter CTA Brutalist */}
      <div className="sidebar-block border-2 border-on-surface bg-[#FF7F3F] p-6 relative overflow-hidden group">
        <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-on-surface flex items-center justify-center text-[#FF7F3F] border-2 border-surface">
            <span className="material-symbols-outlined">mail</span>
          </div>
          <h3
            className="text-2xl md:text-3xl text-surface uppercase font-black tracking-tighter leading-none"
            style={{ fontFamily: 'var(--font-epilogue), sans-serif' }}
          >
            Restez<br/>Connecté
          </h3>
          <p className="text-surface border-l-2 border-surface pl-3 text-sm font-medium">
            Recevez les dernières histoires et actualités des Fabricants de Joie.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-surface bg-on-surface text-surface font-space-grotesk font-bold uppercase tracking-widest text-xs mt-2 hover:bg-surface hover:text-on-surface transition-colors"
          >
            S'inscrire
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
