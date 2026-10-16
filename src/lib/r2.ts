import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export interface R2Config {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  publicUrl?: string;
}

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  contentType: string;
  storage: 'r2' | 'local';
  warning?: string;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

/**
 * Récupère les configurations R2 depuis l'environnement.
 */
export function getR2Config(): R2Config {
  return {
    accountId: process.env.R2_ACCOUNT_ID?.trim(),
    accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim(),
    bucketName: process.env.R2_BUCKET_NAME?.trim(),
    publicUrl: process.env.R2_PUBLIC_URL?.trim(),
  };
}

/**
 * Vérifie si Cloudflare R2 est correctement configuré.
 */
export function isR2Configured(): boolean {
  const cfg = getR2Config();
  return Boolean(
    cfg.accountId &&
    cfg.accessKeyId &&
    cfg.secretAccessKey &&
    cfg.bucketName &&
    cfg.publicUrl
  );
}

let s3ClientInstance: S3Client | null = null;

/**
 * Retourne une instance configurée du client S3 pour Cloudflare R2.
 */
export function getR2Client(): S3Client {
  if (s3ClientInstance) return s3ClientInstance;

  const cfg = getR2Config();
  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 n\'est pas configuré. Vérifiez vos variables d\'environnement.');
  }

  s3ClientInstance = new S3Client({
    region: 'auto',
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId!,
      secretAccessKey: cfg.secretAccessKey!,
    },
  });

  return s3ClientInstance;
}

/**
 * Génère une clé de fichier unique et sécurisée.
 */
export function generateFileKey(originalName: string, folder: string = 'articles'): { key: string; sanitizedFilename: string } {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  const base = path.basename(originalName, ext);
  const sanitizedBase = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image';

  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const sanitizedFilename = `${sanitizedBase}-${uniqueSuffix}${ext}`;
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'articles';
  const key = `${cleanFolder}/${sanitizedFilename}`;

  return { key, sanitizedFilename };
}

/**
 * Upload d'un buffer d'image avec fallback local automatique si R2 n'est pas configuré.
 */
export async function uploadFileBuffer({
  buffer,
  originalName,
  contentType,
  folder = 'articles',
}: {
  buffer: Buffer;
  originalName: string;
  contentType: string;
  folder?: string;
}): Promise<UploadResult> {
  const { key, sanitizedFilename } = generateFileKey(originalName, folder);
  const size = buffer.length;

  if (isR2Configured()) {
    const client = getR2Client();
    const cfg = getR2Config();

    await client.send(
      new PutObjectCommand({
        Bucket: cfg.bucketName!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const publicUrlBase = cfg.publicUrl!.replace(/\/$/, '');
    const url = `${publicUrlBase}/${key}`;

    return {
      url,
      key,
      filename: sanitizedFilename,
      size,
      contentType,
      storage: 'r2',
    };
  }

  // ─── Mode Fallback Local ─────────────────────────────
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'articles';
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', cleanFolder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, sanitizedFilename);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${cleanFolder}/${sanitizedFilename}`;

  return {
    url,
    key,
    filename: sanitizedFilename,
    size,
    contentType,
    storage: 'local',
    warning: 'Cloudflare R2 non configuré dans .env. L\'image a été sauvegardée localement dans public/uploads.',
  };
}

/**
 * Génère une URL présignée pour upload direct si nécessaire.
 */
export async function getPresignedUploadUrl({
  key,
  contentType,
  expiresIn = 3600,
}: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<{ presignedUrl: string; publicUrl: string; key: string }> {
  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 n\'est pas configuré.');
  }

  const client = getR2Client();
  const cfg = getR2Config();

  const command = new PutObjectCommand({
    Bucket: cfg.bucketName!,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(client, command, { expiresIn });
  const publicUrlBase = cfg.publicUrl!.replace(/\/$/, '');

  return {
    presignedUrl,
    publicUrl: `${publicUrlBase}/${key}`,
    key,
  };
}
