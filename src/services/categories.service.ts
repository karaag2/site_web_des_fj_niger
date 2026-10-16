import prisma from "@/lib/db";

export const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { posts: { where: { status: 'published' } } } } },
        orderBy: { name: 'asc' },
    });
    return categories
}