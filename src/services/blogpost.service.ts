import prisma from '@/lib/db';

export const getAllPosts = async (params: {
  page?: string;
  limit?: string;
  category?: string;
  tag?: string;
  featured?: string;
  search?: string;
  status?: string;
  userRole?: string;
}) => {
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '9');
  
  const where: Record<string, unknown> = {};

  if (params.status !== 'published') {
    if (!params.userRole) {
      where.status = 'published';
    } else {
      where.status = params.status || 'published';
    }
  } else {
    where.status = 'published';
  }

  if (params.category) where.category = { slug: params.category };
  if (params.tag) where.tags = { some: { tag: { slug: params.tag } } };
  if (params.featured === 'true') where.featured = true;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { excerpt: { contains: params.search } },
      { content: { contains: params.search } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createPost = async (authorId: string, data: any) => {
  const { title, slug, excerpt, content, coverImage, categoryId, status, featured, readTime, tagIds } = data;

  if (!title || !slug || !content) {
    throw new Error('Titre, slug et contenu requis');
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    throw new Error('Ce slug existe déjà');
  }

  return await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      categoryId: categoryId ? parseInt(categoryId) : null,
      authorId,
      status: status || 'draft',
      featured: featured || false,
      readTime: readTime || 5,
      publishedAt: status === 'published' ? new Date() : null,
      tags: tagIds?.length ? { create: tagIds.map((id: number) => ({ tagId: id })) } : undefined,
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });
};

export const getPostBySlug = async (slug: string, currentUserId?: string, updateViewCount: boolean = false) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) throw new Error('Article non trouvé');

  // Handle visibility for non-published posts
  if (post.status !== 'published' && !currentUserId) {
    throw new Error('Article non trouvé');
  }

  if (updateViewCount) {
    try {
      await prisma.post.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    } catch (err) {
      console.warn(`[Views] Failed to increment view count for post "${slug}":`, err);
    }
  }

  return post;
};

export const updatePost = async (slug: string, userId: string, userRole: string, data: any) => {
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (!existing) throw new Error('Article non trouvé');

  if (existing.authorId !== userId && userRole === 'editor') {
    throw new Error('Accès interdit');
  }

  const { title, excerpt, content, coverImage, categoryId, status, featured, readTime, tagIds } = data;

  if (tagIds !== undefined) {
    await prisma.postTag.deleteMany({ where: { postId: existing.id } });
  }

  return await prisma.post.update({
    where: { slug },
    data: {
      ...(title && { title }),
      ...(data.slug && { slug: data.slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
      ...(status && {
        status,
        publishedAt: status === 'published' && !existing.publishedAt ? new Date() : existing.publishedAt,
      }),
      ...(featured !== undefined && { featured }),
      ...(readTime && { readTime }),
      ...(tagIds?.length && {
        tags: { create: tagIds.map((id: number) => ({ tagId: id })) },
      }),
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });
};

export const deletePost = async (slug: string, userId: string, userRole: string) => {
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (!existing) throw new Error('Article non trouvé');

  if (existing.authorId !== userId && userRole === 'editor') {
    throw new Error('Accès interdit');
  }

  await prisma.post.delete({ where: { slug } });
  return { message: 'Article supprimé' };
};
