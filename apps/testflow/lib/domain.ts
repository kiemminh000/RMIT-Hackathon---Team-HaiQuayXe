export const CAPABILITIES = ['test-editor', 'report-exporter'] as const;
export type Capability = (typeof CAPABILITIES)[number];
export const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;
export type Severity = (typeof SEVERITIES)[number];
export type TestCase = {
  id: string; project: string; title: string; description: string;
  preconditions: string; steps: string; expected_result: string;
  severity: Severity; status: string; assignee: string; updated_at: string;
};
export type AccessRequest = {
  id: string; subject: string; name: string; capability: Capability;
  reason: string; status: 'pending'; created_at: string;
};
export type Activity = { id: string; actor: string; action: string; target: string; at: string };
export type WorkspaceState = { cases: TestCase[]; requests: AccessRequest[]; activity: Activity[] };
export type Member = { subject: string; name: string; capabilities: Capability[]; isSteward: boolean };
export const PROJECT = 'A3G9ST-DEMO';

export function isCapability(value: unknown): value is Capability {
  return typeof value === 'string' && (CAPABILITIES as readonly string[]).includes(value);
}
export function isSeverity(value: unknown): value is Severity {
  return typeof value === 'string' && (SEVERITIES as readonly string[]).includes(value);
}
export function csvCell(value: unknown): string {
  const text = String(value ?? '');
  // Prevent spreadsheet formulas, including formulas preceded by whitespace.
  const safe = /^[\s\u0000-\u001f]*[=+@-]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
export const EXPORT_COLUMNS = ['id', 'project', 'title', 'description', 'preconditions', 'steps', 'expected_result', 'severity', 'status', 'assignee', 'updated_at'] as const;
export function exportCases(cases: TestCase[]): string {
  return '\uFEFF' + [EXPORT_COLUMNS.join(','), ...cases.map(row => EXPORT_COLUMNS.map(key => csvCell(row[key])).join(','))].join('\r\n') + '\r\n';
}
export function initialState(): WorkspaceState {
  const examples: Array<[string, string, Severity, string, string, string]> = [
    ['Login with valid credentials', 'Authentication', 'critical', 'Passed', 'Minh', 'The user reaches the project workspace.'],
    ['Reject an incorrect password', 'Authentication', 'high', 'Passed', 'Linh', 'Sign-in fails without exposing account details.'],
    ['Update a test case severity', 'Test management', 'medium', 'Blocked', 'An', 'An authorised test editor can save the new severity.'],
    ['Export every test case field', 'Reporting', 'high', 'Blocked', 'Bao', 'An authorised report exporter receives all 11 CSV columns.'],
    ['Preserve Vietnamese characters', 'Reporting', 'medium', 'Not run', 'Minh', 'Vietnamese text remains readable after CSV download.'],
    ['Deny an unauthorised API request', 'Permissions', 'critical', 'Not run', 'Linh', 'A request without a verified user token is rejected.'],
    ['Keep edit and export permissions separate', 'Permissions', 'high', 'Not run', 'An', 'Editing permission does not automatically permit export.'],
    ['Display an empty search result', 'Usability', 'low', 'Passed', 'Bao', 'A clear empty state appears without hiding the search input.'],
  ];
  return {
    cases: examples.map(([title, area, severity, status, assignee, expected], index) => ({
      id: `TF-${String(index + 1).padStart(3, '0')}`, project: PROJECT, title,
      description: `Synthetic software-testing exercise for ${area.toLowerCase()}.`,
      preconditions: 'Use this demo project with synthetic records only.',
      steps: `1. Open the ${area.toLowerCase()} workflow.\n2. Perform the action in the title.\n3. Compare the result with the expected behaviour.`,
      expected_result: expected, severity, status, assignee, updated_at: '2026-10-22T03:00:00.000Z',
    })), requests: [], activity: [],
  };
}
