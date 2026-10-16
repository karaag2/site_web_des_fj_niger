'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
  Cloud,
  HardDrive,
} from 'lucide-react';

export interface ImageUploadResult {
  url: string;
  key?: string;
  filename?: string;
  size?: number;
  contentType?: string;
  storage?: 'r2' | 'local';
  warning?: string;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  folder?: string;
  onUploadSuccess?: (result: ImageUploadResult) => void;
  className?: string;
}

export default function ImageUploader({
  value = '',
  onChange,
  label = 'Image de couverture',
  helperText = 'Glissez-déposez une image ici ou parcourez vos fichiers (JPG, PNG, WebP, SVG jusqu\'à 10 Mo)',
  folder = 'covers',
  onUploadSuccess,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [storageType, setStorageType] = useState<'r2' | 'local' | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation de progression fluide pendant l'upload
  const startProgressSimulation = () => {
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          clearInterval(interval);
          return 90;
        }
        return prev + 12;
      });
    }, 150);
    return interval;
  };

  const handleUploadFile = async (file: File) => {
    setError(null);
    setWarningMsg(null);
    setUploading(true);

    const progressInterval = startProgressSimulation();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      onChange(data.url);
      setStorageType(data.storage);

      if (data.warning) {
        setWarningMsg(data.warning);
      }

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err: any) {
      console.error('Erreur upload:', err);
      setError(err?.message || 'Échec du téléversement');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 300);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleUploadFile(file);
      } else {
        setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, etc.).');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  const handleCopyUrl = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    onChange('');
    setStorageType(null);
    setWarningMsg(null);
    setError(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Entête avec Label et bascule de saisie manuelle */}
      <div className="flex items-center justify-between">
        <label className="block text-white/50 text-xs font-mono uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] font-mono text-[#FF7F3F] hover:text-[#FF7F3F]/80 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showManualInput ? 'Mode glisser-déposer' : 'Saisir une URL'}
        </button>
      </div>

      {/* Alerte Erreur */}
      {error && (
        <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400/60 hover:text-red-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Avertissement Fallback (si R2 non configuré) */}
      {warningMsg && (
        <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#FFC82C]/10 border border-[#FFC82C]/20 text-[#FFC82C] text-xs">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 shrink-0" />
            <span>{warningMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarningMsg(null)}
            className="opacity-60 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Champ manuel d'URL */}
      {showManualInput && (
        <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... ou /images/..."
              className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#FF7F3F]/50 outline-none transition-colors"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 text-xs transition-colors"
                title="Effacer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Zone d'affichage : Image existante vs Zone de Drop */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-2">
          {/* Prévisualisation */}
          <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
            <Image
              src={value}
              alt="Prévisualisation"
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              className="object-cover transition-transform duration-500 group-hover:scale-102"
              unoptimized={value.startsWith('http')}
            />

            {/* Overlay d'actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-all duration-300 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF7F3F] text-white text-xs font-semibold shadow-lg hover:bg-[#FF7F3F]/90 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Remplacer
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-colors"
                title="Copier l'URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#38B29B]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié' : 'Copier'}
              </button>

              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors"
                title="Supprimer l'image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Barre d'informations sous l'image */}
          <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span className="truncate max-w-[280px] sm:max-w-md">{value}</span>
            <div className="flex items-center gap-2 shrink-0">
              {storageType === 'r2' || value.includes('r2.dev') || value.includes('r2.cloudflarestorage') ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#38B29B]/20 text-[#38B29B] font-semibold text-[10px]">
                  <Cloud className="w-3 h-3" />
                  Cloudflare R2
                </span>
              ) : storageType === 'local' || value.startsWith('/uploads') ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px]">
                  <HardDrive className="w-3 h-3" />
                  Local
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        /* Zone de Glisser-Déposer (Dropzone) */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? 'border-[#FF7F3F] bg-[#FF7F3F]/10 scale-[1.01] shadow-lg shadow-[#FF7F3F]/10'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
            }
            ${uploading ? 'pointer-events-none opacity-80' : ''}
          `}
        >
          {/* Indicateur de chargement / progression */}
          {uploading ? (
            <div className="w-full max-w-xs space-y-4 py-3">
              <div className="flex items-center justify-center gap-3 text-white/90">
                <Loader2 className="w-6 h-6 text-[#FF7F3F] animate-spin" />
                <span className="text-sm font-semibold">Téléversement en cours…</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7F3F] to-[#38B29B] transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-white/40 font-mono text-center">
                Envoi vers Cloudflare R2 ({progress}%)
              </p>
            </div>
          ) : (
            <>
              {/* Icône animée */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {isDragging ? (
                  <Upload className="w-7 h-7 text-[#FF7F3F] animate-bounce" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-white/40" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white/90">
                  {isDragging ? 'Déposez votre image ici' : 'Cliquez ou glissez une image'}
                </p>
                <p className="text-xs text-white/40 max-w-sm">
                  {helperText}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-white/40">
                  <Cloud className="w-3 h-3 text-[#38B29B]" /> Cloudflare R2
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-white/40">
                  Max 10 Mo
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Input de fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
