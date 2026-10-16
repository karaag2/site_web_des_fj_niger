import { getAllTags } from '@/services/tags.service';

// ─── GET /api/tags ─ Public listing ───────────────────
export async function GET() {
  const tags = await getAllTags();
  return Response.json(tags);
}
