import { DemoWorkspace } from '../../components/demo-workspace';

export const dynamic = 'force-dynamic';
export default function DemoPage() {
  if (process.env.TESTFLOW_DEMO_MODE !== '1') {
    return <main className="loading"><h1>Plan C simulation is disabled</h1><p>This isolated rehearsal is available only when the app is started with TESTFLOW_DEMO_MODE=1.</p><a className="button secondary" href="/">Back to TestFlow</a></main>;
  }
  return <DemoWorkspace />;
}
