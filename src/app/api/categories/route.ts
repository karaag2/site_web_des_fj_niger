import { getAllCategories } from '@/services/categories.service';

// ─── GET /api/categories ─ Public listing ─────────────
export async function GET() {
  const categories = await getAllCategories()

  return Response.json(categories);
}
