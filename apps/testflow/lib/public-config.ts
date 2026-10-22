const PRIVATE_KEY_FIELDS = ['d', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'k'];
const PUBLIC_KEY_FIELDS = ['kid', 'kty', 'alg', 'use', 'crv', 'x', 'y', 'n', 'e'];
export function publicTideConfig(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.credentials || input['client-secret'] || input.clientSecret || input['public-client'] === false) return null;
  const required = ['realm', 'auth-server-url', 'resource', 'vendorId', 'homeOrkUrl'];
  if (!required.every(key => typeof input[key] === 'string' && String(input[key]).length > 0)) return null;
  const jwk = input.jwk as { keys?: unknown[] } | undefined;
  if (!jwk || !Array.isArray(jwk.keys) || jwk.keys.length === 0) return null;
  const keys: Record<string, string>[] = [];
  for (const raw of jwk.keys) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const key = raw as Record<string, unknown>;
    if (PRIVATE_KEY_FIELDS.some(field => field in key) || !['RSA', 'EC', 'OKP'].includes(String(key.kty))) return null;
    const publicKey: Record<string, string> = {};
    for (const field of PUBLIC_KEY_FIELDS) if (typeof key[field] === 'string') publicKey[field] = key[field];
    keys.push(publicKey);
  }
  return Object.fromEntries([...required.map(key => [key, input[key]]), ['jwk', { keys }], ['public-client', true]]);
}
