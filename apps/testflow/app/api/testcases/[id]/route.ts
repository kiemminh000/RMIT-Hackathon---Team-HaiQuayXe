import { NextRequest, NextResponse } from 'next/server';
import { authenticate, parseObject } from '../../../../lib/auth';
import { isSeverity } from '../../../../lib/domain';
import { activity, changeState } from '../../../../lib/store';
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const member = await authenticate(request, 'test-editor');
  if (member instanceof NextResponse) return member;
  const body = await parseObject(request);
  if (!body || Object.keys(body).length !== 1 || !isSeverity(body.severity)) return NextResponse.json({ error: 'Provide only a valid severity: critical, high, medium or low.' }, { status: 400 });
  const severity = body.severity;
  const { id } = await context.params;
  const row = await changeState(state => {
    const testcase = state.cases.find(item => item.id === id);
    if (!testcase) return null;
    const previous = testcase.severity;
    testcase.severity = severity;
    testcase.updated_at = new Date().toISOString();
    activity(state, member, `Changed severity from ${previous} to ${severity}`, id);
    return testcase;
  });
  return row ? NextResponse.json({ testcase: row }) : NextResponse.json({ error: 'Test case not found.' }, { status: 404 });
}
