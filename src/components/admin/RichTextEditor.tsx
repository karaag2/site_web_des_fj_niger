'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Minus,
  CodeXml,
  Eye,
  Check,
  X,
  Trash2,
  UploadCloud,
  Loader2,
} from 'lucide-react';

export interface RichTextEditorRef {
  insertImage: (src: string, alt?: string) => void;
  insertContent: (html: string) => void;
  focus: () => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  function RichTextEditor(
    {
      value,
      onChange,
      placeholder = 'Rédigez votre article ici… Utilisez la barre d’outils pour mettre en forme vos contenus.',
      onUploadImage,
    },
    ref
  ) {
    const [showSource, setShowSource] = useState(false);
    const [rawHtml, setRawHtml] = useState(value || '');
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUpdatingFromProp = useRef(false);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          bulletList: { keepMarks: true },
          orderedList: { keepMarks: true },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class:
              'text-[#FF7F3F] underline underline-offset-4 decoration-[#FF7F3F]/60 hover:text-[#FF7F3F]/80',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class:
              'max-w-full rounded-xl my-4 border-2 border-white/10 shadow-lg block',
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
      content: value || '',
      editorProps: {
        attributes: {
          class:
            'tiptap prose prose-invert max-w-none focus:outline-none min-h-[380px] p-6 text-white/90 text-base leading-relaxed',
        },
      },
      onUpdate: ({ editor }) => {
        if (isUpdatingFromProp.current) return;
        const html = editor.isEmpty ? '' : editor.getHTML();
        setRawHtml(html);
        onChange(html);
      },
    });

    // Exposer l'API impérative au parent
    useImperativeHandle(
      ref,
      () => ({
        insertImage: (src: string, alt: string = '') => {
          if (!editor) return;
          editor.chain().focus().setImage({ src, alt }).run();
        },
        insertContent: (content: string) => {
          if (!editor) return;
          editor.chain().focus().insertContent(content).run();
        },
        focus: () => {
          editor?.commands.focus();
        },
      }),
      [editor]
    );

    // Synchronisation avec la valeur externe
    useEffect(() => {
      if (!editor) return;

      const currentHtml = editor.isEmpty ? '' : editor.getHTML();
      const normalizedProp = value || '';

      if (normalizedProp !== currentHtml) {
        isUpdatingFromProp.current = true;
        editor.commands.setContent(normalizedProp, { emitUpdate: false });
        setRawHtml(normalizedProp);
        isUpdatingFromProp.current = false;
      }
    }, [value, editor]);

    // Mode Code Source HTML
    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newHtml = e.target.value;
      setRawHtml(newHtml);
      onChange(newHtml);
      if (editor) {
        editor.commands.setContent(newHtml, { emitUpdate: false });
      }
    };

    // Gestion des liens
    const handleOpenLinkModal = () => {
      if (!editor) return;
      const currentLink = editor.getAttributes('link').href || '';
      setLinkUrl(currentLink);
      setImageModalOpen(false);
      setLinkModalOpen(true);
    };

    const handleApplyLink = () => {
      if (!editor) return;
      if (!linkUrl.trim()) {
        editor.chain().focus().unsetLink().run();
      } else {
        let finalUrl = linkUrl.trim();
        if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) {
          finalUrl = `https://${finalUrl}`;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: finalUrl })
          .run();
      }
      setLinkModalOpen(false);
      setLinkUrl('');
    };

    const handleRemoveLink = () => {
      if (!editor) return;
      editor.chain().focus().unsetLink().run();
      setLinkModalOpen(false);
      setLinkUrl('');
    };

    // Gestion des images
    const handleOpenImageModal = () => {
      setImageUrl('');
      setImageAlt('');
      setUploadError('');
      setLinkModalOpen(false);
      setImageModalOpen(true);
    };

    const handleApplyImage = () => {
      if (!editor || !imageUrl.trim()) return;
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl.trim(), alt: imageAlt.trim() })
        .run();
      setImageModalOpen(false);
      setImageUrl('');
      setImageAlt('');
    };

    const handleFileUpload = async (file: File) => {
      setIsUploadingImage(true);
      setUploadError('');
      try {
        let uploadedUrl = '';
        if (onUploadImage) {
          uploadedUrl = await onUploadImage(file);
        } else {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'articles');

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Erreur lors du téléversement');
          }
          uploadedUrl = data.url;
        }

        const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        if (editor) {
          editor.chain().focus().setImage({ src: uploadedUrl, alt }).run();
        }
        setImageModalOpen(false);
        setImageUrl('');
        setImageAlt('');
      } catch (err: any) {
        setUploadError(err.message || 'Échec du téléversement');
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    // Statistiques
    const textContent = editor ? editor.getText() : '';
    const wordCount = textContent.trim()
      ? textContent.trim().split(/\s+/).length
      : 0;
    const charCount = textContent.length;
    const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    if (!editor) {
      return (
        <div className="w-full min-h-[380px] rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center text-white/40 text-sm gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF7F3F]" />
          <span>Chargement de l’éditeur…</span>
        </div>
      );
    }

    return (
      <div className="w-full rounded-2xl bg-[#0b101b] border border-white/10 shadow-2xl overflow-hidden focus-within:border-[#FF7F3F]/60 focus-within:ring-2 focus-within:ring-[#FF7F3F]/20 transition-all">
        {/* ── BARRE D'OUTILS PRINCIPALE STYLE GOOGLE DOCS / NOTION ── */}
        <div className="sticky top-0 z-20 bg-[#0e1626]/95 backdrop-blur-xl border-b border-white/10 px-3 py-2 flex flex-wrap items-center gap-1">
          {/* Historique */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
              title="Annuler (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
              title="Rétablir (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Titres & Niveaux */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                editor.isActive('paragraph') && !editor.isActive('heading')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Texte normal (Paragraphe)"
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Grand Titre (H1)"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Titre de section (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Sous-titre (H3)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Formatage typographique */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('bold')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Gras (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('italic')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Italique (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('underline')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Souligné (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('strike')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Barré"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('code')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Code en ligne"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Alignement */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Aligner à gauche"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Centrer"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive({ textAlign: 'right' })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Aligner à droite"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive({ textAlign: 'justify' })
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Justifier"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Listes & Blocs */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Liste à puces"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('orderedList')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Liste ordonnée"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('blockquote')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Citation / Exergue"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('codeBlock')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Bloc de code"
            >
              <CodeXml className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Ligne de séparation"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Insertion Médias & Liens */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-white/10">
            <button
              type="button"
              onClick={handleOpenLinkModal}
              className={`p-1.5 rounded-lg transition-colors ${
                editor.isActive('link')
                  ? 'bg-[#FF7F3F] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Insérer ou modifier un lien"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleOpenImageModal}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Insérer ou uploader une image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Nettoyage & Mode Source */}
          <div className="flex items-center gap-0.5 pl-1.5 ml-auto">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              title="Effacer le formatage"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowSource(!showSource)}
              className={`px-2 py-1 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                showSource
                  ? 'bg-[#38B29B] text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Basculer entre vue Visuelle et code Source HTML"
            >
              {showSource ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visuel</span>
                </>
              ) : (
                <>
                  <CodeXml className="w-3.5 h-3.5" />
                  <span>HTML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── BANDEAU INTERACTIF D'INSERTION DE LIEN ── */}
        {linkModalOpen && (
          <div className="bg-[#131d2e] border-b border-[#FF7F3F]/30 p-3 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-xs text-[#FF7F3F] font-mono uppercase tracking-wider flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5" /> Lien :
            </span>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://exemple.org ou /mon-chemin"
              className="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF7F3F] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyLink();
                }
                if (e.key === 'Escape') setLinkModalOpen(false);
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={handleApplyLink}
              className="px-3 py-1.5 rounded-lg bg-[#FF7F3F] text-white text-xs font-bold hover:bg-[#FF7F3F]/90 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Appliquer
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── BANDEAU INTERACTIF D'INSERTION D'IMAGE ── */}
        {imageModalOpen && (
          <div className="bg-[#131d2e] border-b border-[#FF7F3F]/30 p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#FF7F3F] font-mono uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Image :
              </span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de l'image (ex: /images/enfant.webp ou https://...)"
                className="flex-1 min-w-[200px] px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF7F3F] focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description alternative (alt)"
                className="w-48 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF7F3F] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyImage();
                  }
                  if (e.key === 'Escape') setImageModalOpen(false);
                }}
              />
              <button
                type="button"
                onClick={handleApplyImage}
                disabled={!imageUrl.trim() || isUploadingImage}
                className="px-3 py-1.5 rounded-lg bg-[#FF7F3F] text-white text-xs font-bold hover:bg-[#FF7F3F]/90 disabled:opacity-40 flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Insérer
              </button>

              {/* Bouton Téléverser un fichier local vers R2 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-3 py-1.5 rounded-lg bg-[#38B29B]/20 text-[#38B29B] hover:bg-[#38B29B]/30 border border-[#38B29B]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours…</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Uploader un fichier</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white ml-auto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 font-mono">❌ {uploadError}</p>
            )}
          </div>
        )}

        {/* ── ZONE D'ÉDITION PRINCIPALE : WYSIWYG OU SOURCE HTML ── */}
        {showSource ? (
          <div className="relative">
            <textarea
              value={rawHtml}
              onChange={handleSourceChange}
              rows={15}
              className="w-full p-6 bg-[#070b13] text-[#38B29B] font-mono text-xs leading-relaxed outline-none resize-y border-none"
              placeholder="<p>Tapez ou collez votre code HTML directement ici…</p>"
            />
            <div className="absolute top-3 right-4 px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/50 pointer-events-none">
              MODE HTML BRUT
            </div>
          </div>
        ) : (
          <div className="relative min-h-[380px] bg-[#0b101b] selection:bg-[#FF7F3F]/40 selection:text-white">
            <EditorContent editor={editor} />
          </div>
        )}

        {/* ── BARRE D'ÉTAT INFÉRIEURE ── */}
        <div className="px-4 py-2.5 bg-[#090d16] border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-white/40 gap-2">
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-white/70 font-semibold">{wordCount}</strong> mots
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>
              <strong className="text-white/70 font-semibold">{charCount}</strong> caractères
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>~{estimatedReadingTime} min de lecture</span>
          </div>

          <div className="flex items-center gap-3 text-white/30">
            <span className="hidden md:inline">
              Raccourcis : Ctrl+B (Gras), Ctrl+I (Italique), Ctrl+U (Souligné), Ctrl+Z (Annuler)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-[#38B29B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38B29B]"></span>
              WYSIWYG Actif
            </span>
          </div>
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
