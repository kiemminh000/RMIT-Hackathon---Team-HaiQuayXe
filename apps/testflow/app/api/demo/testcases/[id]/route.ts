import { handleDemo } from '../../../../../lib/demo';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleDemo(request, 'testcase', (await context.params).id);
}
