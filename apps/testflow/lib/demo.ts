import { randomBytes, randomUUID } from 'node:crypto';
import {
  CAPABILITIES, PROJECT, exportCases, initialState, isCapability, isSeverity,
  type AccessRequest, type Activity, type Capability, type Member, type TestCase,
} from './domain';

// Plan C is deliberately a simulation. None of these identities or approvals
// is a Tide identity, a signed role claim, or independent cryptographic consent.
export const DEMO_THRESHOLD = 2;
export const DEMO_COOKIE = 'testflow_demo_session';
const SESSION_SECONDS = 4 * 60 * 60;
const IDENTITIES = {
  tester: { subject: 'demo:tester', name: 'Simulated tester', isSteward: false },
  'steward-a': { subject: 'demo:steward-a', name: 'Simulated steward A', isSteward: true },
  'steward-b': { subject: 'demo:steward-b', name: 'Simulated steward B', isSteward: true },
  'steward-c': { subject: 'demo:steward-c', name: 'Simulated steward C', isSteward: true },
} as const;
type Identity = keyof typeof IDENTITIES;
export type DemoRequest = Omit<AccessRequest, 'status'> & {
  approvals: string[];
  status: 'pending' | 'granted';
};
type DemoState = { cases: TestCase[]; requests: DemoRequest[]; activity: Activity[] };
type DemoSession = { identity: Identity; expires: number };
export type DemoAction = 'workspace' | 'session' | 'requests' | 'approve' | 'testcase' | 'export' | 'reset';
type DemoRuntime = {
  state: DemoState;
  sessions: Map<string, DemoSession>;
  queue: Promise<unknown>;
};

function freshState(): DemoState {
  return { cases: initialState().cases, requests: [], activity: [] };
}
function freshRuntime(): DemoRuntime {
  return { state: freshState(), sessions: new Map(), queue: Promise.resolve() };
}

class DemoError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
function fail(status: number, message: string): never { throw new DemoError(status, message); }
function json(body: unknown, status = 200, additionalHeaders?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...additionalHeaders },
  });
}
function sessionCookie(request: Request, token = '', remove = false) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${DEMO_COOKIE}=${token}; Path=/api/demo; HttpOnly; SameSite=Strict; Max-Age=${remove ? 0 : SESSION_SECONDS}${secure}`;
}
function sessionToken(request: Request): string | null {
  const matches = (request.headers.get('cookie') || '').split(';')
    .map(value => value.trim()).filter(value => value.startsWith(`${DEMO_COOKIE}=`));
  if (matches.length !== 1) return null;
  const token = matches[0].slice(DEMO_COOKIE.length + 1);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}
function isIdentity(value: unknown): value is Identity {
  return typeof value === 'string' && Object.hasOwn(IDENTITIES, value);
}
function exactKeys(body: Record<string, unknown>, keys: string[]) {
  return Object.keys(body).length === keys.length && keys.every(key => Object.hasOwn(body, key));
}
async function parseBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    fail(415, 'Send an application/json object.');
  }
  const text = await request.text();
  if (text.length > 4096) fail(400, 'The simulation request is too large.');
  let value: unknown;
  try { value = JSON.parse(text); } catch { fail(400, 'Send a valid JSON object.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'Send a JSON object.');
  return value as Record<string, unknown>;
}
function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  let matches = request.headers.get('sec-fetch-site') !== 'cross-site';
  try {
    const internalUrl = new URL(request.url);
    // Next may rebuild request.url using its bind hostname (localhost), while
    // the browser connects to 127.0.0.1. Host retains the requested authority.
    // Do not trust forwarded-host headers or allow another port/protocol.
    const host = request.headers.get('host') ?? internalUrl.host;
    if (!host || /[\s/@?#\\%]/.test(host)) matches = false;
    const expected = new URL(`${internalUrl.protocol}//${host}`).origin;
    if (origin !== null && (new URL(origin).origin !== origin || origin !== expected)) matches = false;
  } catch {
    matches = false;
  }
  if (!matches) {
    fail(403, 'Open the simulation on this site before changing its state.');
  }
}
function allowedMethod(action: DemoAction, method: string) {
  const methods: Record<DemoAction, string[]> = {
    workspace: ['GET'], session: ['POST', 'DELETE'], requests: ['POST'],
    approve: ['POST'], testcase: ['PATCH'], export: ['GET'], reset: ['POST'],
  };
  if (!methods[action].includes(method)) fail(405, 'This method is not supported.');
}

/** An isolated, single-process synthetic workspace; a process restart clears it. */
export function createDemoService(options: {
  enabled?: () => boolean;
  now?: () => number;
  runtime?: DemoRuntime;
} = {}) {
  const runtime = options.runtime || freshRuntime();
  const enabled = options.enabled || (() => process.env.TESTFLOW_DEMO_MODE === '1');
  const now = options.now || Date.now;

  function memberFor(request: Request): Member | null {
    const token = sessionToken(request);
    if (!token) return null;
    const session = runtime.sessions.get(token);
    if (!session) return null;
    if (session.expires <= now()) {
      runtime.sessions.delete(token);
      return null;
    }
    const identity = IDENTITIES[session.identity];
    const capabilities = CAPABILITIES.filter(capability => runtime.state.requests.some(item =>
      item.subject === identity.subject && item.capability === capability && item.status === 'granted',
    ));
    return { ...identity, capabilities };
  }
  function requireMember(request: Request, capability?: Capability): Member {
    const member = memberFor(request);
    if (!member) fail(401, 'Select a simulated identity to continue.');
    if (capability && !member.capabilities.includes(capability)) fail(403, `The ${capability} permission requires two simulated steward approvals.`);
    return member;
  }
  function activity(member: Member, action: string, target: string) {
    runtime.state.activity.unshift({ id: randomUUID(), actor: member.name, action, target, at: new Date(now()).toISOString() });
    runtime.state.activity = runtime.state.activity.slice(0, 100);
  }
  function workspace(request: Request) {
    return {
      mode: 'simulation' as const,
      members: Object.values(IDENTITIES).map(identity => ({ ...identity })),
      member: memberFor(request),
      cases: runtime.state.cases,
      requests: runtime.state.requests,
      activity: runtime.state.activity,
      threshold: DEMO_THRESHOLD,
    };
  }
  async function perform(request: Request, action: DemoAction, id: string | undefined, body: Record<string, unknown> | undefined): Promise<Response> {
    // State and sessions share only this simulation queue; the live store is never imported.
    if (action === 'workspace') return json(workspace(request));
    if (action === 'session') {
      const old = sessionToken(request);
      if (request.method === 'DELETE') {
        if (old) runtime.sessions.delete(old);
        return json({ mode: 'simulation', member: null }, 200, { 'Set-Cookie': sessionCookie(request, '', true) });
      }
      if (!body || !exactKeys(body, ['identity']) || !isIdentity(body.identity)) fail(400, 'Choose tester, steward-a, steward-b or steward-c as a simulated identity.');
      for (const [token, session] of runtime.sessions) if (session.expires <= now()) runtime.sessions.delete(token);
      if (old) runtime.sessions.delete(old);
      if (runtime.sessions.size >= 1000) fail(429, 'The simulation has too many active sessions. Reset the demo to start again.');
      const token = randomBytes(32).toString('hex');
      runtime.sessions.set(token, { identity: body.identity, expires: now() + SESSION_SECONDS * 1000 });
      const copiedRequest = new Request(request.url, { headers: { cookie: `${DEMO_COOKIE}=${token}` } });
      return json({ mode: 'simulation', member: memberFor(copiedRequest) }, 200, { 'Set-Cookie': sessionCookie(request, token) });
    }
    if (action === 'reset') {
      if (!body || !exactKeys(body, [])) fail(400, 'Reset accepts only an empty JSON object.');
      // Intentional demo control available to every viewer, not a live admin operation.
      runtime.state = freshState();
      runtime.sessions.clear();
      return json({ mode: 'simulation', member: null, message: 'Simulation reset. All demo sessions, requests and grants were cleared.' }, 200, { 'Set-Cookie': sessionCookie(request, '', true) });
    }
    if (action === 'requests') {
      const member = requireMember(request);
      if (!body || !exactKeys(body, ['capability', 'reason']) || !isCapability(body.capability) || typeof body.reason !== 'string' || body.reason.trim().length < 8 || body.reason.length > 500) fail(400, 'Choose a permission and give a reason of 8–500 characters.');
      const capability = body.capability;
      if (member.capabilities.includes(capability)) fail(409, 'This simulated identity already has that permission.');
      if (runtime.state.requests.some(item => item.subject === member.subject && item.capability === capability && item.status === 'pending')) fail(409, 'A pending simulation request already exists for that permission.');
      if (runtime.state.requests.length >= 1000) fail(409, 'Reset the simulation before creating more requests.');
      const item: DemoRequest = {
        id: randomUUID(), subject: member.subject, name: member.name, capability,
        reason: body.reason.trim(), status: 'pending', approvals: [], created_at: new Date(now()).toISOString(),
      };
      runtime.state.requests.push(item);
      activity(member, `Requested simulated ${capability} access`, item.id);
      return json({ mode: 'simulation', request: item, message: 'Request saved. No permission is granted until two different eligible simulated stewards approve.' }, 201);
    }
    if (action === 'approve') {
      const member = requireMember(request);
      if (!body || !exactKeys(body, [])) fail(400, 'Approval accepts only an empty JSON object.');
      const item = runtime.state.requests.find(entry => entry.id === id);
      if (!item) fail(404, 'Simulation request not found.');
      if (item.subject === member.subject) fail(403, 'A requester cannot approve their own simulation request.');
      if (!member.isSteward) fail(403, 'Only a simulated steward can approve this request.');
      if (item.approvals.includes(member.subject)) fail(409, 'This simulated steward has already approved the request.');
      if (item.status === 'granted') fail(409, 'This simulation request is already granted.');
      item.approvals.push(member.subject);
      activity(member, `Approved simulated ${item.capability} access (${item.approvals.length}/${DEMO_THRESHOLD})`, item.id);
      if (item.approvals.length >= DEMO_THRESHOLD) {
        item.status = 'granted';
        activity(member, `Two simulated approvals granted ${item.capability} to ${item.name}`, item.id);
      }
      return json({ mode: 'simulation', request: item, message: item.status === 'granted' ? 'Two simulated approvals received. Only the requested permission is now available.' : 'One simulated approval recorded. Access remains blocked.' });
    }
    if (action === 'testcase') {
      const member = requireMember(request, 'test-editor');
      if (!body || !exactKeys(body, ['severity']) || !isSeverity(body.severity)) fail(400, 'Provide only a valid severity: critical, high, medium or low.');
      const row = runtime.state.cases.find(entry => entry.id === id);
      if (!row) fail(404, 'Synthetic test case not found.');
      const previous = row.severity;
      row.severity = body.severity;
      row.updated_at = new Date(now()).toISOString();
      activity(member, `Changed synthetic severity from ${previous} to ${row.severity}`, row.id);
      return json({ mode: 'simulation', testcase: row });
    }
    const member = requireMember(request, 'report-exporter');
    activity(member, 'Exported all 11 synthetic test case fields', PROJECT);
    return new Response(exportCases(runtime.state.cases), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${PROJECT}-simulation-testcases.csv"`,
        'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  return {
    async handle(request: Request, action: DemoAction, id?: string): Promise<Response> {
      if (!enabled()) return json({ error: 'Not found.' }, 404);
      try {
        allowedMethod(action, request.method);
        if (!['GET', 'HEAD'].includes(request.method)) requireSameOrigin(request);
        const body = ['POST', 'PATCH'].includes(request.method) ? await parseBody(request) : undefined;
        const operation = runtime.queue.then(() => {
          if (!enabled()) return json({ error: 'Not found.' }, 404);
          return perform(request, action, id, body);
        });
        runtime.queue = operation.catch(() => undefined);
        return await operation;
      } catch (error) {
        if (error instanceof DemoError) return json({ error: error.message, mode: 'simulation' }, error.status);
        return json({ error: 'The simulation could not complete this request.', mode: 'simulation' }, 500);
      }
    },
  };
}

// Share only the demo runtime across Next route bundles and hot reloads.
// No persistent live file, Tide token, realm configuration or live queue is used.
const globals = globalThis as typeof globalThis & { testflowDemoRuntimeV1?: DemoRuntime };
globals.testflowDemoRuntimeV1 ||= freshRuntime();
const service = createDemoService({ runtime: globals.testflowDemoRuntimeV1 });
export function handleDemo(request: Request, action: DemoAction, id?: string) {
  return service.handle(request, action, id);
}
