import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TideCloakProvider } from '@tidecloak/nextjs';
import { getTideConfig } from '../lib/tide-config';
import './globals.css';

export const metadata: Metadata = { title: 'TestFlow - Move testing forward', description: 'A testing workspace with explicit capabilities and shared permission governance.' };
export const dynamic = 'force-dynamic';
export default function RootLayout({ children }: { children: ReactNode }) {
  const config = process.env.TESTFLOW_DEMO_MODE === '1' ? null : getTideConfig();
  return <html lang="en"><body>{config ? <TideCloakProvider config={config}>{children}</TideCloakProvider> : children}</body></html>;
}
