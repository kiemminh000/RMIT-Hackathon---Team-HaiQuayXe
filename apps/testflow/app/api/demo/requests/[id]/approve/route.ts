import { handleDemo } from '../../../../../../lib/demo';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleDemo(request, 'approve', (await context.params).id);
}
