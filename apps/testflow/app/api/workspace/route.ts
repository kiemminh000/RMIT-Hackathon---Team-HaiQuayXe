import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../lib/auth';
import { readState } from '../../../lib/store';
import { consoleUrl, getTideConfig } from '../../../lib/tide-config';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const member = await authenticate(request);
  if (member instanceof NextResponse) return member;
  const state = await readState();
  return NextResponse.json({ member, cases: state.cases, requests: state.requests.filter(item => item.subject === member.subject), reviewRequests: member.isSteward ? state.requests : [], activity: state.activity.slice(0, 20), consoleUrl: consoleUrl(getTideConfig()) }, { headers: { 'Cache-Control': 'no-store' } });
}
