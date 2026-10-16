import prisma from '@/lib/db';

export const getAllTags = async () => {
  return await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  });
};
