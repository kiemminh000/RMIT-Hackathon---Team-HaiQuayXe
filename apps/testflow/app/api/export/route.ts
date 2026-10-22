import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../lib/auth';
import { exportCases, PROJECT } from '../../../lib/domain';
import { activity, changeState } from '../../../lib/store';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const member = await authenticate(request, 'report-exporter');
  if (member instanceof NextResponse) return member;
  const csv = await changeState(state => {
    activity(state, member, 'Exported all 11 test case fields', PROJECT);
    return exportCases(state.cases);
  });
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${PROJECT}-testcases.csv"`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
