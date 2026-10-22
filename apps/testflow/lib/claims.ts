export function capabilityClaims(payload: Record<string, unknown>, resource: string, now = Date.now() / 1000): string[] | null {
  if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp) || payload.exp <= now) return null;
  const realm = payload.realm_access as { roles?: unknown } | undefined;
  const clients = payload.resource_access as Record<string, { roles?: unknown }> | undefined;
  const realmRoles = Array.isArray(realm?.roles) ? realm.roles.filter((role): role is string => typeof role === 'string') : [];
  const appRoles = Array.isArray(clients?.[resource]?.roles) ? (clients[resource].roles as unknown[]).filter((role): role is string => typeof role === 'string') : [];
  return [...realmRoles, ...appRoles];
}
