import { NextRequest, NextResponse } from 'next/server';
import { verifyTideCloakToken } from '@tidecloak/nextjs/server';
import { CAPABILITIES, type Capability, type Member } from './domain';
import { getTideConfig } from './tide-config';
import { capabilityClaims } from './claims';

export async function authenticate(request: NextRequest, capability?: Capability): Promise<Member | NextResponse> {
  const config = getTideConfig();
  if (!config) return NextResponse.json({ error: 'TideCloak is not configured. A real realm is required.' }, { status: 503 });
  const header = request.headers.get('authorization');
  if (!header || !/^Bearer [^\s]+$/i.test(header)) return NextResponse.json({ error: 'Sign in with TideCloak to continue.' }, { status: 401 });
  try {
    const payload = await verifyTideCloakToken(config, header.slice(7), []) as Record<string, unknown> | null;
    if (!payload) return NextResponse.json({ error: 'Your session could not be verified.' }, { status: 401 });
    const subject = payload.vuid || payload.sub;
    if (typeof subject !== 'string' || !subject) return NextResponse.json({ error: 'Verified identity is missing.' }, { status: 403 });
    const roles = capabilityClaims(payload, String(config.resource));
    if (!roles) return NextResponse.json({ error: 'Your session has expired or has no valid expiry.' }, { status: 401 });
    // Scope capabilities to this realm/application; no generic admin bypass.
    if (capability && !roles.includes(capability)) return NextResponse.json({ error: `The ${capability} permission is required.` }, { status: 403 });
    const management = (payload.resource_access as Record<string, { roles?: string[] }> | undefined)?.['realm-management'];
    const isSteward = Array.isArray(management?.roles) && management.roles.includes('tide-realm-admin');
    return { subject, name: String(payload.preferred_username || 'Team member').slice(0, 80), capabilities: CAPABILITIES.filter(role => roles.includes(role)), isSteward };
  } catch {
    return NextResponse.json({ error: 'Your session could not be verified. Sign in again.' }, { status: 401 });
  }
}

export async function parseObject(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > 4096) return null;
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch { return null; }
}
