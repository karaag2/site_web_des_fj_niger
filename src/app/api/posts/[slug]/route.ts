import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getPostBySlug, updatePost, deletePost } from '@/services/blogpost.service';

// ─── GET /api/posts/[slug] ─ Public single post ──────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const post = await getPostBySlug(slug, session?.user?.id, true);
    return Response.json(post);
  } catch (error: any) {
    if (error.message === 'Article non trouvé') {
      return Response.json({ error: 'Article non trouvé' }, { status: 404 });
    }
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ─── PUT /api/posts/[slug] ─ Update (auth required) ──
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const userRole = session.user.role || 'user'; // Assume base implementation for user fetch
    
    const post = await updatePost(slug, session.user.id, userRole, body);
    return Response.json(post);
  } catch (error: any) {
    if (error.message === 'Article non trouvé') return Response.json({ error: error.message }, { status: 404 });
    if (error.message === 'Accès interdit') return Response.json({ error: error.message }, { status: 403 });
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ─── DELETE /api/posts/[slug] ─ Delete (auth required)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const userRole = session.user.role || 'user';

    const result = await deletePost(slug, session.user.id, userRole);
    return Response.json(result);
  } catch (error: any) {
    if (error.message === 'Article non trouvé') return Response.json({ error: error.message }, { status: 404 });
    if (error.message === 'Accès interdit') return Response.json({ error: error.message }, { status: 403 });
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
