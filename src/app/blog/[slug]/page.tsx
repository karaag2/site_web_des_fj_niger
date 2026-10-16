import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import SideNav from '@/components/SideNav';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/blog/ArticleContent';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImage: true },
  });

  if (!post) return { title: 'Article non trouvé' };

  return {
    title: `${post.title} — Blog FJ Niger`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, status: 'published' },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  // Increment views
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  // Related posts (same category, excluding current)
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'published',
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  return (
    <SmoothScroll>
      <CustomCursor />
      <SideNav />
      <TopNav />

      <main className="md:pl-16 transition-[padding] duration-700 ease-out">
        <ArticleContent post={post} relatedPosts={relatedPosts} />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
