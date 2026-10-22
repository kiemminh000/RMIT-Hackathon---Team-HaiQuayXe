import { redirect } from 'next/navigation';
import AuthRedirect from '../../../components/auth-redirect';
import { getTideConfig } from '../../../lib/tide-config';
export default function RedirectPage() {
  if (process.env.TESTFLOW_DEMO_MODE === '1' || !getTideConfig()) redirect('/');
  return <AuthRedirect />;
}
