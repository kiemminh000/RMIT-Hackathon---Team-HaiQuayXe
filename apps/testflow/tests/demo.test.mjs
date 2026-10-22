import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Load the actual TypeScript service without starting a server or changing the
// production bundler's extensionless imports. No production dependency is mocked.
const require = createRequire(import.meta.url);
const loaded = new Map();
function loadLocal(name) {
  if (loaded.has(name)) return loaded.get(name);
  const source = fs.readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const localRequire = id => id === './domain' ? loadLocal('domain') : require(id);
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  loaded.set(name, module.exports);
  return module.exports;
}
const { createDemoService, DEMO_COOKIE } = loadLocal('demo');
const { EXPORT_COLUMNS } = loadLocal('domain');
const service = options => createDemoService({ enabled: () => true, ...options });

function client(app) {
  let cookie = '';
  return {
    async call(action, method = 'GET', body, id, extraHeaders = {}) {
      const response = await app.handle(new Request(`http://localhost:3030/api/demo/${action}`, {
        method,
        headers: { ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...(cookie ? { cookie } : {}), ...extraHeaders },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }), action, id);
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) cookie = setCookie.split(';')[0];
      return response;
    },
    async signIn(identity) {
      const response = await this.call('session', 'POST', { identity });
      assert.equal(response.status, 200);
      return response;
    },
    get cookie() { return cookie; },
  };
}
async function requestPermission(person, capability = 'test-editor') {
  const response = await person.call('requests', 'POST', { capability, reason: 'Prepare our synthetic testing report.' });
  assert.equal(response.status, 201);
  return (await response.json()).request;
}
async function team(app) {
  const tester = client(app), a = client(app), b = client(app), c = client(app);
  await tester.signIn('tester'); await a.signIn('steward-a'); await b.signIn('steward-b'); await c.signIn('steward-c');
  return { tester, a, b, c };
}

test('all simulation actions return 404 unless the exact environment gate is enabled', async () => {
  const prior = process.env.TESTFLOW_DEMO_MODE;
  try {
    for (const value of [undefined, '0', 'true']) {
      if (value === undefined) delete process.env.TESTFLOW_DEMO_MODE;
      else process.env.TESTFLOW_DEMO_MODE = value;
      const app = createDemoService();
      for (const [action, method] of [['workspace','GET'],['session','POST'],['session','DELETE'],['requests','POST'],['approve','POST'],['testcase','PATCH'],['export','GET'],['reset','POST']]) {
        assert.equal((await client(app).call(action, method, ['POST','PATCH'].includes(method) ? {} : undefined, 'missing')).status, 404);
      }
    }
    process.env.TESTFLOW_DEMO_MODE = '1';
    assert.equal((await client(createDemoService()).call('workspace')).status, 200);
  } finally {
    if (prior === undefined) delete process.env.TESTFLOW_DEMO_MODE; else process.env.TESTFLOW_DEMO_MODE = prior;
  }
});

test('anonymous workspace is clearly synthetic; sessions are opaque HTTPOnly SameSite cookies', async () => {
  const person = client(service());
  const initial = await (await person.call('workspace')).json();
  assert.equal(initial.mode, 'simulation'); assert.equal(initial.member, null);
  assert.equal(initial.threshold, 2); assert.equal(initial.members.length, 4);
  assert.ok(initial.members.every(member => member.name.startsWith('Simulated ')));
  assert.equal((await person.call('testcase', 'PATCH', { severity: 'high' }, 'TF-003')).status, 401);
  const response = await person.signIn('tester');
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  assert.match(response.headers.get('set-cookie'), /Path=\/api\/demo/);
  assert.match(person.cookie, new RegExp(`^${DEMO_COOKIE}=[a-f0-9]{64}$`));
  const signed = await response.json();
  assert.equal(signed.member.subject, 'demo:tester');
  assert.deepEqual(signed.member.capabilities, []);
  assert.equal((await person.call('session', 'DELETE')).status, 200);
  assert.equal((await (await person.call('workspace')).json()).member, null);
});

test('a request and one approval grant nothing; two distinct approvals grant editing only', async () => {
  const { tester, a, b } = await team(service());
  assert.equal((await tester.call('testcase', 'PATCH', { severity: 'critical' }, 'TF-003')).status, 403);
  assert.equal((await tester.call('export')).status, 403);
  const request = await requestPermission(tester);
  assert.deepEqual(request.approvals, []); assert.equal(request.status, 'pending');
  assert.equal((await tester.call('testcase', 'PATCH', { severity: 'critical' }, 'TF-003')).status, 403);
  assert.equal((await tester.call('approve', 'POST', {}, request.id)).status, 403);
  const first = await a.call('approve', 'POST', {}, request.id);
  assert.equal(first.status, 200); assert.equal((await first.json()).request.status, 'pending');
  assert.equal((await tester.call('testcase', 'PATCH', { severity: 'critical' }, 'TF-003')).status, 403);
  assert.equal((await a.call('approve', 'POST', {}, request.id)).status, 409);
  const second = await b.call('approve', 'POST', {}, request.id);
  assert.equal(second.status, 200);
  const granted = (await second.json()).request;
  assert.equal(granted.status, 'granted');
  assert.deepEqual(granted.approvals, ['demo:steward-a','demo:steward-b']);
  const edit = await tester.call('testcase', 'PATCH', { severity: 'critical' }, 'TF-003');
  assert.equal(edit.status, 200); assert.equal((await edit.json()).testcase.severity, 'critical');
  assert.equal((await tester.call('export')).status, 403);
  assert.equal((await a.call('testcase', 'PATCH', { severity: 'low' }, 'TF-003')).status, 403);
  const updated = await (await tester.call('workspace')).json();
  assert.deepEqual(updated.member.capabilities, ['test-editor']);
  assert.ok(updated.activity.some(entry => entry.action.includes('Two simulated approvals')));
});

test('export needs its own two approvals and uses the existing safe all-fields CSV formatter', async () => {
  const { tester, a, b } = await team(service());
  const request = await requestPermission(tester, 'report-exporter');
  await a.call('approve', 'POST', {}, request.id);
  assert.equal((await tester.call('export')).status, 403);
  await b.call('approve', 'POST', {}, request.id);
  const response = await tester.call('export');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/csv/);
  assert.match(response.headers.get('content-disposition'), /simulation-testcases.csv/);
  const csv = await response.text();
  assert.ok(csv.includes(EXPORT_COLUMNS.join(',')));
  assert.equal((csv.match(/"TF-\d{3}"/g) || []).length, 8);
  assert.ok(csv.includes('1. Open the authentication workflow.\n2.'));
  assert.equal((await tester.call('testcase', 'PATCH', { severity: 'low' }, 'TF-003')).status, 403);
});

test('self-approval is forbidden even for a simulated steward; non-stewards cannot approve others', async () => {
  const { tester, a, b, c } = await team(service());
  const request = await requestPermission(a);
  assert.equal((await a.call('approve', 'POST', {}, request.id)).status, 403);
  assert.equal((await tester.call('approve', 'POST', {}, request.id)).status, 403);
  assert.equal((await b.call('approve', 'POST', {}, request.id)).status, 200);
  assert.equal((await c.call('approve', 'POST', {}, request.id)).status, 200);
  assert.equal((await a.call('testcase', 'PATCH', { severity: 'high' }, 'TF-003')).status, 200);
});

test('the simulation queue rejects simultaneous duplicate approvals without granting early', async () => {
  const { tester, a, b } = await team(service());
  const request = await requestPermission(tester);
  const duplicate = await Promise.all([a.call('approve','POST',{},request.id),a.call('approve','POST',{},request.id)]);
  assert.deepEqual(duplicate.map(result => result.status).sort(), [200,409]);
  const pending = (await (await tester.call('workspace')).json()).requests[0];
  assert.equal(pending.status, 'pending'); assert.equal(pending.approvals.length, 1);
  assert.equal((await b.call('approve','POST',{},request.id)).status, 200);
  assert.equal((await b.call('approve','POST',{},request.id)).status, 409);
});

test('reset restores synthetic cases and clears every grant, approval and session', async () => {
  const { tester, a, b } = await team(service());
  const request = await requestPermission(tester);
  await a.call('approve','POST',{},request.id); await b.call('approve','POST',{},request.id);
  await tester.call('testcase','PATCH',{ severity:'critical' },'TF-003');
  const response = await tester.call('reset','POST',{});
  assert.equal(response.status, 200); assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  for (const person of [tester,a,b]) {
    const reset = await (await person.call('workspace')).json();
    assert.equal(reset.member, null); assert.deepEqual(reset.requests, []); assert.deepEqual(reset.activity, []);
    assert.equal(reset.cases.find(item => item.id === 'TF-003').severity, 'medium');
  }
  await tester.signIn('tester');
  assert.equal((await tester.call('testcase','PATCH',{ severity:'critical' },'TF-003')).status, 403);
});

test('validation rejects extra claims, malformed content and cross-site mutations', async () => {
  const app = service(), person = client(app);
  assert.equal((await person.call('session','POST',{ identity:'__proto__' })).status, 400);
  assert.equal((await person.call('session','POST',{ identity:'tester', capabilities:['test-editor'] })).status, 400);
  await person.signIn('tester');
  for (const body of [[],null,{ capability:'admin',reason:'Please allow me.' },{ capability:'test-editor',reason:'short' },{ capability:'test-editor',reason:'Valid long reason',subject:'demo:steward-a' }]) {
    assert.equal((await person.call('requests','POST',body)).status, 400);
  }
  assert.equal((await person.call('requests','POST',{ capability:'test-editor',reason:'A valid reason here' },undefined,{ origin:'https://elsewhere.example' })).status, 403);
  const wrongType = await app.handle(new Request('http://localhost:3030/api/demo/session',{ method:'POST',body:'{"identity":"tester"}' }),'session');
  assert.equal(wrongType.status, 415);
  const malformed = await app.handle(new Request('http://localhost:3030/api/demo/session',{ method:'POST',headers:{'content-type':'application/json'},body:'{' }),'session');
  assert.equal(malformed.status, 400);
  const request = await requestPermission(person);
  assert.equal((await person.call('requests','POST',{ capability:'test-editor',reason:'Duplicate valid request' })).status, 409);
  const steward = client(app); await steward.signIn('steward-a');
  assert.equal((await steward.call('approve','POST',{ subject:'demo:steward-b' },request.id)).status, 400);
  assert.equal((await person.call('reset','POST',{ preserveRoles:true })).status, 400);
});

test('same-origin checks use the incoming Host when Next rebuilds the URL with its bind hostname', async () => {
  const app = service();
  const post = headers => app.handle(new Request('http://localhost:3030/api/demo/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: '127.0.0.1:3030', origin: 'http://127.0.0.1:3030', ...headers },
    body: JSON.stringify({ identity: 'tester' }),
  }), 'session');
  assert.equal((await post({ 'sec-fetch-site': 'same-origin' })).status, 200);
  for (const headers of [
    { origin: 'http://localhost:3030' },
    { origin: 'http://127.0.0.1:3031' },
    { origin: 'https://127.0.0.1:3030' },
    { origin: 'https://elsewhere.example', 'x-forwarded-host': 'elsewhere.example' },
    { origin: 'null' },
    { origin: 'http://127.0.0.1:3030/other' },
    { 'sec-fetch-site': 'cross-site' },
    { host: '127.0.0.1:3030/other' },
    { host: 'user@127.0.0.1:3030' },
    { host: '127.0.0.1:3030,elsewhere.example' },
  ]) assert.equal((await post(headers)).status, 403, JSON.stringify(headers));
});

test('forged or expired sessions cannot import roles; separate demo services share no state', async () => {
  let now = 1000;
  const app = service({ now: () => now });
  const person = client(app); await person.signIn('tester'); await requestPermission(person);
  const forged = await app.handle(new Request('http://localhost:3030/api/demo/export',{ headers:{ cookie:`${DEMO_COOKIE}=${'a'.repeat(64)}`, authorization:'Bearer fake-tide-admin', 'x-role':'report-exporter' } }),'export');
  assert.equal(forged.status, 401);
  const duplicate = await app.handle(new Request('http://localhost:3030/api/demo/export',{ headers:{cookie:`${person.cookie}; ${person.cookie}`} }),'export');
  assert.equal(duplicate.status, 401);
  now += 4 * 60 * 60 * 1000 + 1;
  assert.equal((await person.call('export')).status, 401);
  const other = await (await client(service()).call('workspace')).json();
  assert.deepEqual(other.requests, []); assert.equal(other.member, null);
});
