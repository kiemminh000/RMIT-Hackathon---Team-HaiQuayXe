import fs from 'node:fs';
import path from 'node:path';
import type { TidecloakConfig } from '@tidecloak/nextjs/server';
import { publicTideConfig } from './public-config';

export function getTideConfig(): TidecloakConfig | null {
  const filename = path.join(process.cwd(), 'tidecloak.json');
  try {
    const value = publicTideConfig(JSON.parse(fs.readFileSync(filename, 'utf8')));
    return value as TidecloakConfig | null;
  } catch { return null; }
}
export function consoleUrl(config: TidecloakConfig | null): string | null {
  if (!config) return null;
  const explicit = process.env.TIDECLOAK_CONSOLE_URL;
  try {
    const url = new URL(explicit || `${config['auth-server-url'].replace(/\/$/, '')}/realms/${encodeURIComponent(config.realm)}/tide-console/`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
