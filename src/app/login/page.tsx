'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Identifiants incorrects');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Erreur de connexion. Réessayez.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C3B5E] via-[#0F2137] to-[#0a1628]"></div>
      <div className="absolute inset-0 texture-paper opacity-[0.04] mix-blend-overlay"></div>
      <div className="absolute inset-0 texture-dots opacity-[0.06]"></div>

      {/* Ambient shapes */}
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#FF7F3F] opacity-[0.05] blur-[120px]"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#38B29B] opacity-[0.04] blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span
              className="text-3xl text-white tracking-tight"
              style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 800 }}
            >
              FJ<span className="text-[#FF7F3F]">.</span>
            </span>
          </Link>
          <h1
            className="text-2xl text-white mb-2"
            style={{ fontFamily: 'var(--font-epilogue), sans-serif', fontWeight: 700 }}
          >
            Espace Administrateur
          </h1>
          <p className="text-white/40 text-sm">
            Connectez-vous pour gérer le blog
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-white placeholder:text-white/20 text-base md:text-sm
                           focus:border-[#FF7F3F]/50 focus:ring-2 focus:ring-[#FF7F3F]/20
                           outline-none transition-all duration-300"
                placeholder="admin@fabricantsdejoie.org"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-white placeholder:text-white/20 text-base md:text-sm
                           focus:border-[#FF7F3F]/50 focus:ring-2 focus:ring-[#FF7F3F]/20
                           outline-none transition-all duration-300"
                placeholder="••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider
                         bg-[#FF7F3F] text-white hover:bg-[#FF7F3F]/90
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-[#FF7F3F]/30 hover:shadow-xl hover:shadow-[#FF7F3F]/40
                         transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Connexion…
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/30 hover:text-[#FF7F3F] text-xs font-mono uppercase tracking-wider transition-colors duration-300"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
