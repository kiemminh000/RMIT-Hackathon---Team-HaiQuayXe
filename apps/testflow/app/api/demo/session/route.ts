import { handleDemo } from '../../../../lib/demo';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export function POST(request: Request) { return handleDemo(request, 'session'); }
export function DELETE(request: Request) { return handleDemo(request, 'session'); }
