import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import {
  isR2Configured,
  getR2Config,
  uploadFileBuffer,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from '@/lib/r2';

export const runtime = 'nodejs';

// ─── GET /api/upload ─ Vérification du statut de stockage ──────
export async function GET() {
  const r2Active = isR2Configured();
  const cfg = getR2Config();

  return Response.json({
    r2Configured: r2Active,
    storage: r2Active ? 'r2' : 'local',
    bucket: r2Active ? cfg.bucketName : null,
    message: r2Active
      ? 'Stockage Cloudflare R2 actif et configuré.'
      : 'Stockage Cloudflare R2 non configuré. Mode fallback local actif.',
  });
}

// ─── POST /api/upload ─ Upload d'une image ──────────────────────
export async function POST(request: Request) {
  // 1. Vérification de la session admin / utilisateur
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Non authentifié. Connexion requise.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'articles';

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'Aucun fichier transmis dans la requête.' }, { status: 400 });
    }

    // 2. Validation du type MIME
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return Response.json(
        {
          error: `Format de fichier non supporté (${file.type || 'inconnu'}). Formats autorisés : JPG, PNG, WebP, GIF, SVG, AVIF.`,
        },
        { status: 400 }
      );
    }

    // 3. Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        {
          error: `Le fichier dépasse la taille maximale autorisée (${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} Mo).`,
        },
        { status: 400 }
      );
    }

    // 4. Lecture du buffer et upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileBuffer({
      buffer,
      originalName: file.name,
      contentType: file.type,
      folder,
    });

    return Response.json(
      {
        success: true,
        ...result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Upload API Error]:', error);
    return Response.json(
      {
        error: error?.message || 'Erreur interne lors du traitement de l\'image.',
      },
      { status: 500 }
    );
  }
}
