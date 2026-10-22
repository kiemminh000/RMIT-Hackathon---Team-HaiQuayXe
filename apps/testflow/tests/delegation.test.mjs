import test from 'node:test';
import assert from 'node:assert/strict';
import { delegationEvidence } from '../lib/delegation.ts';

const member = { subject: 'tester-1', name: 'Tester', capabilities: [], isSteward: false };
const request = { id: 'request-1', subject: 'tester-1', name: 'Tester', capability: 'test-editor', reason: 'Prioritise the team report.', status: 'pending', created_at: '2026-10-22T08:00:00.000Z' };

test('a saved app request neither grants access nor proves a Tide review occurred', () => {
  const evidence = delegationEvidence('test-editor', member, [request], false);
  assert.equal(evidence.request.id, 'request-1');
  assert.equal(evidence.access, 'not-in-session');
  assert.equal(evidence.tideReview, 'not-observed');
});

test('current signed capabilities may exist without an app request and do not prove its approval history', () => {
  const signedMember = { ...member, capabilities: ['test-editor'] };
  const editor = delegationEvidence('test-editor', signedMember, [], false);
  assert.equal(editor.request, null);
  assert.equal(editor.access, 'available');
  assert.equal(editor.tideReview, 'not-observed');
  assert.equal(delegationEvidence('report-exporter', signedMember, [request], false).access, 'not-in-session');
});

test('removing a capability changes current access without inventing a denial or losing the saved request', () => {
  const before = delegationEvidence('test-editor', { ...member, capabilities: ['test-editor'] }, [request], false);
  const after = delegationEvidence('test-editor', member, [request], false);
  assert.equal(before.access, 'available');
  assert.equal(after.access, 'not-in-session');
  assert.deepEqual(after.request, request);
  assert.equal(after.tideReview, 'not-observed');
});

test('preview never presents a supplied request or capability as verified evidence', () => {
  assert.deepEqual(delegationEvidence('test-editor', { ...member, capabilities: ['test-editor'] }, [request], true), {
    request: null, access: 'unverified', tideReview: 'not-observed',
  });
});

test('request details are scoped to the current identity and exact capability without mutating history', () => {
  const history = [request, { ...request, id: 'other-person', subject: 'tester-2' }, { ...request, id: 'other-capability', capability: 'report-exporter' }];
  const before = JSON.stringify(history);
  assert.equal(delegationEvidence('test-editor', member, history, false).request.id, 'request-1');
  assert.equal(delegationEvidence('test-editor', { ...member, subject: 'no-requests' }, history, false).request, null);
  assert.equal(JSON.stringify(history), before);
});
