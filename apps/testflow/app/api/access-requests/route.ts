import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { authenticate, parseObject } from '../../../lib/auth';
import { isCapability, type AccessRequest } from '../../../lib/domain';
import { activity, changeState } from '../../../lib/store';
export async function POST(request: NextRequest) {
  const member = await authenticate(request);
  if (member instanceof NextResponse) return member;
  const body = await parseObject(request);
  if (!body || Object.keys(body).some(key => !['capability', 'reason'].includes(key)) || !isCapability(body.capability) || typeof body.reason !== 'string' || body.reason.trim().length < 8 || body.reason.length > 500) return NextResponse.json({ error: 'Choose a permission and give a reason of 8–500 characters.' }, { status: 400 });
  const capability = body.capability;
  const reason = body.reason.trim();
  if (member.capabilities.includes(capability)) return NextResponse.json({ error: 'Your verified session already has this permission.' }, { status: 409 });
  const result = await changeState(state => {
    const existing = state.requests.find(item => item.subject === member.subject && item.capability === capability && item.status === 'pending');
    if (existing) return existing;
    const access: AccessRequest = { id: randomUUID(), subject: member.subject, name: member.name, capability, reason, status: 'pending', created_at: new Date().toISOString() };
    state.requests.push(access);
    activity(state, member, `Requested ${capability} access`, 'Awaiting steward action in TideCloak');
    return access;
  });
  return NextResponse.json({ request: result, message: 'Request saved. A steward must propose the role change in TideCloak; required approvals happen there. This request grants no permission.' }, { status: 201 });
}
