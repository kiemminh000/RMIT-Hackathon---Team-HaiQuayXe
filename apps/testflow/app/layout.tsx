import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TideCloakProvider } from '@tidecloak/nextjs';
import { getTideConfig } from '../lib/tide-config';
import { WorkspacePreview } from '../components/workspace';
import './globals.css';

export const metadata: Metadata = { title: 'TestFlow — Move testing forward', description: 'A testing workspace with explicit capabilities and shared permission governance.' };
export const dynamic = 'force-dynamic';
export default function RootLayout({ children }: { children: ReactNode }) {
  const config = getTideConfig();
  return <html lang="en"><body>{config ? <TideCloakProvider config={config}>{children}</TideCloakProvider> : <WorkspacePreview />}</body></html>;
}
