import test from 'node:test';
import assert from 'node:assert/strict';
import { csvCell, exportCases, initialState, EXPORT_COLUMNS, isCapability, isSeverity } from '../lib/domain.ts';
import { capabilityClaims } from '../lib/claims.ts';
import { publicTideConfig } from '../lib/public-config.ts';

test('CSV exports all fields and records including quoted multiline steps', () => {
  const state = initialState();
  const csv = exportCases(state.cases);
  assert.equal(EXPORT_COLUMNS.length, 11);
  assert.ok(csv.startsWith('\uFEFFid,project,title,description,'));
  assert.ok(csv.includes('expected_result,severity,status,assignee,updated_at'));
  assert.equal((csv.match(/"TF-\d{3}"/g) || []).length, state.cases.length);
  assert.ok(csv.includes('1. Open the authentication workflow.\n2.'));
});
test('CSV prevents spreadsheet formulas and escapes quote/comma/newline', () => {
  for (const value of ['=SUM(A1:A2)', '+cmd', '-2+3', '@SUM(A1)', '  =1', '\t=1']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell('a,"b"\nTiếng Việt'), '"a,""b""\nTiếng Việt"');
});
test('only documented severities and capabilities are accepted', () => {
  assert.equal(isSeverity('critical'), true); assert.equal(isSeverity('admin'), false);
  assert.equal(isCapability('test-editor'), true); assert.equal(isCapability('admin'), false);
});
test('capabilities exclude other application roles and require a finite unexpired exp', () => {
  const payload = { exp: 200, realm_access: { roles: ['test-editor'] }, resource_access: { testflow: { roles: ['report-exporter'] }, other: { roles: ['admin'] } } };
  assert.deepEqual(capabilityClaims(payload, 'testflow', 100), ['test-editor', 'report-exporter']);
  for (const exp of [undefined, NaN, Infinity, '200', 99]) assert.equal(capabilityClaims({ ...payload, exp }, 'testflow', 100), null);
});
const valid = () => ({ realm: 'demo', 'auth-server-url': 'https://tide.example', resource: 'testflow', vendorId: 'vendor', homeOrkUrl: 'https://ork.example', jwk: { keys: [{ kty: 'OKP', crv: 'Ed25519', x: 'public', kid: 'one' }] } });
test('browser config allowlists public fields and excludes arbitrary nested values', () => {
  const clean = publicTideConfig({ ...valid(), arbitrary: { secret: 'never-expose' }, databasePassword: 'never-expose' });
  assert.ok(clean); assert.equal('arbitrary' in clean, false); assert.equal('databasePassword' in clean, false);
  assert.equal(clean['public-client'], true);
});
test('private/symmetric keys and credential-bearing adapters fail closed', () => {
  for (const field of ['d','p','q','dp','dq','qi','oth','k']) {
    const value = valid(); value.jwk.keys[0][field] = 'private'; assert.equal(publicTideConfig(value), null);
  }
  assert.equal(publicTideConfig({ ...valid(), credentials: { secret: 'private' } }), null);
  assert.equal(publicTideConfig({}), null);
  assert.equal(publicTideConfig({ ...valid(), jwk: { keys: [] } }), null);
});
