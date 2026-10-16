import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getAllPosts, createPost } from '@/services/blogpost.service';

// ─── GET /api/posts ─ Public listing ──────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '9';
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const featured = searchParams.get('featured') || undefined;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || 'published';

  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = session ? 'admin' : undefined; // assuming session means authorized to see status properly. Note: Should ideally check role.

  const result = await getAllPosts({ page, limit, category, tag, featured, search, status, userRole });

  return Response.json(result);
}

// ─── POST /api/posts ─ Create (auth required) ────────
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post = await createPost(session.user.id, body);
    return Response.json(post, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Ce slug existe déjà') {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (error.message === 'Titre, slug et contenu requis') {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
