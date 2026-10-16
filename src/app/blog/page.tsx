import prisma from '@/lib/db';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import SideNav from '@/components/SideNav';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogSidebar from '@/components/blog/BlogSidebar';

export const metadata = {
  title: 'Blog — Les Fabricants de Joie du Niger',
  description: 'Histoires de vies transformées, témoignages de foi, formations et actualités du mouvement des Fabricants de Joie au Niger.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || '1');
  const category = params.category as string | undefined;
  const tag = params.tag as string | undefined;
  const search = params.search as string | undefined;

  const where: Record<string, unknown> = { status: 'published' };
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  const limit = 9;
  const [posts, total, categories, tags, featuredPosts] = await Promise.all([
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
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { status: 'published' } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.post.findMany({
      where: { status: 'published', featured: true },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <SmoothScroll>
      <CustomCursor />
      <SideNav />
      <TopNav />

      <main className="md:pl-16 transition-[padding] duration-700 ease-out">
        <BlogHero featuredPosts={featuredPosts} />

        <section className="relative py-20 lg:py-32 bg-surface">
          {/* Textures */}
          <div className="absolute inset-0 texture-paper opacity-40 mix-blend-multiply pointer-events-none z-0"></div>
          <div className="absolute inset-0 texture-dots opacity-30 pointer-events-none z-0"></div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col xl:flex-row gap-12 xl:gap-16">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <BlogGrid
                  posts={posts}
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  activeCategory={category}
                  activeTag={tag}
                  searchQuery={search}
                />
              </div>

              {/* Sidebar */}
              <div className="w-full xl:w-[340px] shrink-0">
                <BlogSidebar
                  categories={categories}
                  tags={tags}
                  activeCategory={category}
                  activeTag={tag}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
