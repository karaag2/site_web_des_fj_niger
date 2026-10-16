'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor, { RichTextEditorRef } from '@/components/admin/RichTextEditor';

interface AdminProps {
  user: { name: string; email: string; role: string };
  stats: { totalPosts: number; publishedPosts: number; draftPosts: number; totalViews: number };
  categories: { id: number; name: string; slug: string; color: string; _count: { posts: number } }[];
  recentPosts: {
    id: number;
    title: string;
    slug: string;
    status: string;
    featured: boolean;
    views: number;
    createdAt: string | Date;
    category: { name: string; color: string } | null;
    author: { name: string };
  }[];
}

export default function AdminDashboard({ user, stats, categories, recentPosts }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'new'>('overview');
  const router = useRouter();

  // New post form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    categoryId: '',
    status: 'draft',
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [contentImageMsg, setContentImageMsg] = useState('');

  const editorRef = useRef<RichTextEditorRef>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const slugify = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
      .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  };

  const handleInsertContentImage = async (file: File) => {
    setUploadingContentImage(true);
    setContentImageMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'articles');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Erreur lors du téléversement de l\'image');
        return;
      }

      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      if (editorRef.current) {
        editorRef.current.insertImage(data.url, altText);
      } else {
        const imageHtml = `<p><img src="${data.url}" alt="${altText}" /></p>`;
        setForm((f) => ({ ...f, content: f.content + imageHtml }));
      }

      setContentImageMsg('✅ Image insérée dans l\'article');
      setTimeout(() => setContentImageMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Erreur réseau lors de l\'upload');
    } finally {
      setUploadingContentImage(false);
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    if (!form.content || !form.content.trim() || form.content === '<p></p>') {
      setSaveMsg('❌ Le contenu de l\'article est obligatoire');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSaveMsg(`❌ ${data.error || 'Erreur'}`);
        setSaving(false);
        return;
      }

      setSaveMsg('✅ Article créé !');
      setForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', categoryId: '', status: 'draft', featured: false });
      setTimeout(() => router.refresh(), 1000);
    } catch {
      setSaveMsg('❌ Erreur réseau');
    }
    setSaving(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
    router.refresh();
  };

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  const statCards = [
    { label: 'Articles', value: stats.totalPosts, icon: 'article', color: '#FF7F3F' },
    { label: 'Publiés', value: stats.publishedPosts, icon: 'check_circle', color: '#38B29B' },
    { label: 'Brouillons', value: stats.draftPosts, icon: 'edit_note', color: '#FFC82C' },
    { label: 'Total vues', value: stats.totalViews, icon: 'visibility', color: '#1C3B5E' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0a0f1a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl tracking-tight"
              style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 800 }}
            >
              FJ<span className="text-[#FF7F3F]">.</span>
              <span className="text-xs text-white/30 ml-2 font-mono uppercase tracking-wider">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-xs text-white/40 hover:text-white/60 font-mono uppercase tracking-wider transition-colors"
            >
              Voir le blog
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[#38B29B]"></span>
              <span className="text-xs text-white/50">{user.name}</span>
              <span className="text-[10px] text-white/20 font-mono">({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-white/30 hover:text-red-400 transition-colors font-mono"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
          {[
            { id: 'overview' as const, label: 'Vue d\'ensemble', icon: 'dashboard' },
            { id: 'posts' as const, label: 'Articles', icon: 'article' },
            { id: 'new' as const, label: 'Nouveau', icon: 'add' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-[#FF7F3F] text-white shadow-lg shadow-[#FF7F3F]/30'
                  : 'text-white/40 hover:text-white/60'
                }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl p-5 bg-white/5 border border-white/5"
                >
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[40px] opacity-20"
                    style={{ backgroundColor: s.color }}
                  ></div>
                  <span className="material-symbols-outlined text-2xl mb-3 block" style={{ color: s.color }}>
                    {s.icon}
                  </span>
                  <p className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-epilogue)' }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-white/30 font-mono uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="rounded-2xl bg-white/5 border border-white/5 p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
                Catégories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-sm text-white/60">{cat.name}</span>
                    <span className="text-[10px] text-white/20 font-mono ml-auto">{cat._count.posts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Titre</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden lg:table-cell">Statut</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden lg:table-cell">Vues</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden md:table-cell">Date</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <span className="material-symbols-outlined text-[#FFC82C] text-sm">star</span>
                        )}
                        <span className="text-sm text-white/80 line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {post.category && (
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                          style={{ backgroundColor: post.category.color + 'AA' }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                          ${post.status === 'published'
                            ? 'bg-[#38B29B]/20 text-[#38B29B]'
                            : post.status === 'draft'
                            ? 'bg-[#FFC82C]/20 text-[#FFC82C]'
                            : 'bg-white/10 text-white/40'
                          }`}
                      >
                        {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-white/30 font-mono">{post.views}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-white/30 font-mono">{formatDate(post.createdAt)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* New Post Tab */}
        {activeTab === 'new' && (
          <div className="max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {saveMsg && (
                <div
                  className={`px-4 py-3 rounded-xl text-sm ${
                    saveMsg.startsWith('✅')
                      ? 'bg-[#38B29B]/10 border border-[#38B29B]/20 text-[#38B29B]'
                      : 'bg-red-500/10 border border-red-500/20 text-red-300'
                  }`}
                >
                  {saveMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Titre</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                               focus:border-[#FF7F3F]/50 focus:ring-2 focus:ring-[#FF7F3F]/20 outline-none transition-all"
                    placeholder="Le titre de votre article"
                  />
                </div>

                <div>
                  <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm
                               focus:border-[#FF7F3F]/50 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Catégorie</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                               focus:border-[#FF7F3F]/50 outline-none transition-all"
                  >
                    <option value="">Aucune</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageUploader
                value={form.coverImage}
                onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
                label="Image de couverture"
                helperText="Glissez une image pour la couverture (Cloudflare R2) ou cliquez pour sélectionner"
                folder="covers"
              />

              <div>
                <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Extrait</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                             focus:border-[#FF7F3F]/50 outline-none transition-all resize-none"
                  placeholder="Un résumé accrocheur de l'article…"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="block text-white/40 text-xs font-mono uppercase tracking-wider">
                      Contenu de l'article (Éditeur WYSIWYG)
                    </label>
                    <span className="text-[10px] font-mono text-[#38B29B]/80 bg-[#38B29B]/10 border border-[#38B29B]/20 px-2 py-0.5 rounded-full">
                      Google Docs & Notion Style
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {contentImageMsg && (
                      <span className="text-[11px] font-mono text-[#38B29B] animate-in fade-in">
                        {contentImageMsg}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => contentImageInputRef.current?.click()}
                      disabled={uploadingContentImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-all border border-white/5 disabled:opacity-50"
                      title="Uploader une image vers Cloudflare R2 et l'insérer à la position du curseur"
                    >
                      <span className="material-symbols-outlined text-sm text-[#FF7F3F]">
                        {uploadingContentImage ? 'sync' : 'add_photo_alternate'}
                      </span>
                      <span>
                        {uploadingContentImage ? 'Téléversement…' : 'Insérer une image R2'}
                      </span>
                    </button>
                    <input
                      ref={contentImageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleInsertContentImage(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <RichTextEditor
                  ref={editorRef}
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  placeholder="Commencez à rédiger votre article ici… Utilisez la barre d'outils supérieure pour formater vos textes, insérer des titres, listes, citations et images."
                />
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-white/40 text-xs font-mono uppercase tracking-wider">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/10 accent-[#FF7F3F]"
                  />
                  <span className="text-white/40 text-xs font-mono uppercase tracking-wider">À la une</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider
                           bg-[#FF7F3F] text-white hover:bg-[#FF7F3F]/90
                           disabled:opacity-50 shadow-lg shadow-[#FF7F3F]/30
                           transition-all duration-300"
              >
                {saving ? 'Publication…' : 'Publier l\'article'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
