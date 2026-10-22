import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TESTFLOW_UNCONFIGURED_URL;
test('an unconfigured running app refuses every protected action without pretending to authenticate', { skip: !base }, async () => {
  for (const [path, method, body] of [
    ['/api/workspace', 'GET'], ['/api/export', 'GET'],
    ['/api/testcases/TF-001', 'PATCH', { severity: 'low', role: 'admin' }],
    ['/api/access-requests', 'POST', { capability: 'report-exporter', reason: 'Test the guard', approved: true }],
  ]) {
    for (const token of [null, 'forged.token.value']) {
      const response = await fetch(base + path, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      assert.equal(response.status, 503, `${method} ${path}`);
      const payload = await response.json();
      assert.match(payload.error, /not configured/i);
      assert.equal(payload.cases, undefined);
      assert.equal(response.headers.get('content-disposition'), null);
    }
  }
});
