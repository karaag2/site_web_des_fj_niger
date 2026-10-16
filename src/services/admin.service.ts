import prisma from '@/lib/db';

export const getAdminUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const getAdminDashboardData = async () => {
  const [posts, categories, totalViews, recentPosts, publishedCount, draftCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      include: {
        category: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.post.count({ where: { status: 'draft' } }),
  ]);

  return {
    posts,
    categories,
    totalViews: totalViews._sum.views || 0,
    recentPosts,
    publishedCount,
    draftCount,
  };
};
