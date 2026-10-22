import { redirect } from 'next/navigation';
import TideEntry from '../components/tide-entry';
import { WorkspacePreview } from '../components/workspace';
import { getTideConfig } from '../lib/tide-config';

export default function Page() {
  if (process.env.TESTFLOW_DEMO_MODE === '1') redirect('/demo');
  return getTideConfig() ? <TideEntry /> : <WorkspacePreview />;
}
