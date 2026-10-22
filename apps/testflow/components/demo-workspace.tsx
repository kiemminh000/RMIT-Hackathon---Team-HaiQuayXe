'use client';

import { useCallback, useEffect, useState } from 'react';
import { Brand, Icon } from './workspace';
import { Modal } from './modal';
import { SEVERITIES, type AccessRequest, type Activity, type Capability, type Member, type Severity, type TestCase } from '../lib/domain';
import './demo.css';

type DemoIdentity = 'tester' | 'steward-a' | 'steward-b' | 'steward-c';
type DemoRequest = Omit<AccessRequest, 'status'> & { status: 'pending' | 'granted'; approvals: string[] };
type DemoPayload = {
  mode: 'simulation'; members: Array<Pick<Member, 'subject' | 'name' | 'isSteward'>>;
  member: Member | null; cases: TestCase[]; requests: DemoRequest[]; activity: Activity[]; threshold: 2;
};
type Notice = { error: boolean; message: string } | null;
const PERSONAS: Array<{ identity: DemoIdentity; label: string; initials: string; description: string }> = [
  { identity: 'tester', label: 'Tester', initials: 'T', description: 'Requests access and does the work' },
  { identity: 'steward-a', label: 'Steward A', initials: 'A', description: 'First distinct demo approval' },
  { identity: 'steward-b', label: 'Steward B', initials: 'B', description: 'Second distinct demo approval' },
  { identity: 'steward-c', label: 'Steward C', initials: 'C', description: 'Another steward can help' },
];
const permissionName = (capability: Capability) => capability === 'test-editor' ? 'Edit test severity' : 'Export all fields';

export function DemoWorkspace() {
  const [data, setData] = useState<DemoPayload | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState<TestCase | null>(null);
  const [requesting, setRequesting] = useState<Capability | null>(null);
  const [reason, setReason] = useState('');
  const [requestAttempted, setRequestAttempted] = useState(false);
  const [resetting, setResetting] = useState(false);

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`/api/demo${path}`, { ...init, credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `The demo request failed (${response.status}).`);
    }
    return response;
  }, []);
  const load = useCallback(async () => {
    const response = await request('/workspace');
    const payload = await response.json() as DemoPayload;
    if (payload.mode !== 'simulation') throw new Error('This page requires the isolated Plan C simulation.');
    setData(payload);
  }, [request]);
  useEffect(() => { void load().catch(error => setNotice({ error: true, message: error.message })); }, [load]);

  async function perform(action: () => Promise<string>) {
    setBusy(true); setNotice(null);
    try {
      const message = await action();
      await load();
      setNotice({ error: false, message });
      return true;
    } catch (error) {
      setNotice({ error: true, message: error instanceof Error ? error.message : 'The demo action could not be completed.' });
      return false;
    } finally { setBusy(false); }
  }
  async function post(path: string, body: Record<string, unknown>) {
    return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  }
  function openRequest(capability: Capability) {
    setRequestAttempted(false);
    setRequesting(capability);
    setReason(capability === 'test-editor'
      ? 'The project owner is offline. I need to raise the severity of our blocked test before the team review.'
      : 'I need the complete test report for our team review.');
  }
  async function exportReport() {
    await perform(async () => {
      const response = await request('/export');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'A3G9ST-DEMO-testcases-simulation.csv';
      anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      return 'Demo report downloaded: all 11 fields. This export used simulated access, not live Tide authorization.';
    });
  }

  const member = data?.member ?? null;
  const canEdit = !!member?.capabilities.includes('test-editor');
  const canExport = !!member?.capabilities.includes('report-exporter');
  const visibleCases = data?.cases.filter(item =>
    `${item.id} ${item.title} ${item.assignee}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'all' || item.status === filter),
  ) ?? [];
  const activePersona = PERSONAS.find(persona => member?.subject === `demo:${persona.identity}`);
  const openRequests = data?.requests.filter(item => item.status === 'pending').length ?? 0;

  return <div className="demo-app">
    <div className="demo-mode-banner" role="note"><span className="demo-mode-marker" /><strong>Plan C simulation • no live Tide connection</strong><span>Demo identities and approvals are enforced by the isolated demo server. No Tide signatures are created.</span></div>
    <div className="demo-layout">
      <aside className="demo-sidebar"><Brand /><span className="demo-sidebar-kicker">TEAM HAIQUAYXE</span><h2>Shared work.<br />Shared responsibility.</h2><p>A3G9ST-DEMO<br />Software Testing workspace</p><nav aria-label="Demo workspace"><a href="#demo-cases"><Icon name="grid" />Test cases</a><a href="#demo-requests"><Icon name="people" />Access requests<span>{openRequests}</span></a><a href="#demo-activity"><Icon name="history" />Activity</a></nav><div className="demo-sidebar-note"><Icon name="shield" /><strong>One permission at a time.</strong><p>Editing a test does not grant report export or administrator access.</p></div><a href="/" className="demo-live-link">Back to TestFlow<Icon name="arrow" /></a></aside>
      <main className="demo-main">
        <header className="demo-heading"><div><span className="eyebrow">A3G9ST-DEMO / INTERACTIVE REHEARSAL</span><h1>Keep the team moving<span>.</span></h1><p>The owner is offline. Delegate one task through shared review.</p></div><button className="button secondary" disabled={busy || !data} onClick={() => setResetting(true)}><Icon name="refresh" />Reset rehearsal</button></header>

        <section className="demo-personas" aria-labelledby="demo-personas-title"><div className="demo-section-intro"><div><h2 id="demo-personas-title">Choose a demo identity</h2><p>Switch roles to rehearse each person's part. These are simulated sessions.</p></div>{member && <button className="text-button" disabled={busy} onClick={() => void perform(async () => { await request('/session', { method: 'DELETE' }); return 'Signed out of the simulated session.'; })}><Icon name="logout" />Leave demo session</button>}</div><div className="demo-persona-grid">{PERSONAS.map(persona => {
          const active = activePersona?.identity === persona.identity;
          return <button key={persona.identity} type="button" className={`demo-persona ${active ? 'selected' : ''}`} aria-pressed={active} disabled={busy || !data} onClick={() => void perform(async () => { await post('/session', { identity: persona.identity }); return `Now using ${persona.label}'s simulated session.`; })}><span className="demo-persona-avatar">{persona.initials}</span><span><strong>{persona.label}</strong><small>{persona.description}</small></span>{active && <Icon name="check" />}</button>;
        })}</div></section>

        {notice && <div className={`notice ${notice.error ? 'error' : 'success'}`} role={notice.error ? 'alert' : 'status'}>{notice.message}</div>}
        {!data ? <div className="demo-empty"><Icon name="refresh" /><h2>{notice?.error ? 'The demo is unavailable' : 'Loading the demo workspace…'}</h2><p>{notice?.error ? 'Plan C must be enabled on this app instance. Live Tide authentication is not used as a fallback.' : 'Fetching synthetic cases and the current rehearsal state.'}</p><button className="button secondary" onClick={() => void load().catch(error => setNotice({ error: true, message: error.message }))}>Try again</button></div> : <>
          <section className="demo-story-strip" aria-label="Demo scenario"><span><Icon name="people" /><strong>Owner offline</strong><small>Other stewards can review</small></span><span><Icon name="shield" /><strong>{data.threshold} different approvals</strong><small>One steward cannot grant access alone</small></span><span><Icon name="check" /><strong>One specific capability</strong><small>Editing and export stay separate</small></span></section>

          <div className="demo-work-grid">
            <section className="table-card" id="demo-cases"><div className="section-heading"><div><h2>Test cases <span className="count">{data.cases.length}</span></h2><p>Synthetic records for the team review.</p></div><button className="button primary" disabled={busy || !canExport} onClick={() => void exportReport()} title={canExport ? 'Download the synthetic report' : 'A separate report-exporter capability is required'}><Icon name={canExport ? 'download' : 'lock'} />Export all fields</button></div><div className="table-toolbar"><label className="search"><Icon name="search" /><input aria-label="Search demo test cases" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search cases or teammate…" /></label><select aria-label="Filter demo test status" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All statuses</option>{['Passed', 'Failed', 'Blocked', 'Not run'].map(status => <option key={status}>{status}</option>)}</select></div><div className="table-scroll"><table><thead><tr><th>Test case</th><th>Severity</th><th>Status</th><th>Assignee</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{visibleCases.map(item => <tr key={item.id}><td><button className="case-link" onClick={() => setDetail(item)}><span>{item.id}</span><strong>{item.title}</strong></button></td><td><div className={`severity ${item.severity}`}><span />{canEdit ? <select aria-label={`Demo severity for ${item.id}`} value={item.severity} disabled={busy} onChange={event => { const severity = event.target.value as Severity; void perform(async () => { await request(`/testcases/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ severity }) }); return `${item.id} severity updated in the simulation.`; }); }}>{SEVERITIES.map(severity => <option key={severity}>{severity}</option>)}</select> : <><span>{item.severity}</span><Icon name="lock" /></>}</div></td><td><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}><i />{item.status}</span></td><td><span className="assignee"><span>{item.assignee.slice(0, 1)}</span>{item.assignee}</span></td><td><button className="icon-button" aria-label={`View demo ${item.id} details`} onClick={() => setDetail(item)}><Icon name="arrow" /></button></td></tr>)}</tbody></table>{visibleCases.length === 0 && <div className="empty-state">No test cases match your search.</div>}</div><div className="table-footer"><span>Showing {visibleCases.length} of {data.cases.length} cases</span><span><Icon name="lock" />{canEdit ? 'Editing enabled for this demo identity' : 'Editing requires a separate demo grant'}</span></div></section>

            <aside className="demo-permissions"><div className="card-eyebrow"><Icon name="shield" /> CURRENT DEMO ACCESS</div><h2>{activePersona ? `${activePersona.label}'s permissions` : 'Choose an identity first'}</h2><p>Access below comes from the demo server's current session.</p>{(['test-editor', 'report-exporter'] as Capability[]).map(capability => {
              const granted = !!member?.capabilities.includes(capability);
              const existing = data.requests.find(item => item.subject === member?.subject && item.capability === capability && item.status === 'pending');
              return <div className="demo-permission" key={capability}><div><strong>{permissionName(capability)}</strong><span className={granted ? 'granted' : 'restricted'}>{granted ? 'Demo granted' : 'Locked'}</span></div><p>{capability === 'test-editor' ? 'Change severity without administrator access.' : 'Download all 11 fields in one CSV report.'}</p>{!granted && (existing ? <a className="text-button" href={`#request-${existing.id}`}>View request · {existing.approvals.length}/{data.threshold}<Icon name="arrow" /></a> : <button className="text-button" disabled={busy || !member || member.isSteward} onClick={() => openRequest(capability)}>{capability === 'test-editor' ? 'Request editing access' : 'Request export access'}<Icon name="arrow" /></button>)}</div>;
            })}{member?.isSteward && <div className="demo-steward-note"><Icon name="people" /><p>You are reviewing as a steward. Your approval counts once. Use the tester identity to request access and perform the delegated work.</p></div>}<button className="button subtle wide" disabled={busy} onClick={() => void perform(async () => 'Demo permissions refreshed.')}><Icon name="refresh" />Refresh demo permissions</button></aside>
          </div>

          <section className="demo-request-panel" id="demo-requests"><div className="demo-section-intro"><div><span className="card-eyebrow">SHARED REVIEW</span><h2>Access requests</h2><p>Two different demo stewards must approve the same request. Counts below are recorded by the demo server.</p></div><div className="demo-review-controls"><span className="demo-mini-badge">Simulation · {data.threshold} of 3 stewards</span>{data.requests.length > 0 && <label className="demo-review-identity">Review as<select aria-label="Demo review identity" disabled={busy} value={activePersona?.identity || ''} onChange={event => { const identity = event.target.value as DemoIdentity; void perform(async () => { await post('/session', { identity }); return `Switched to ${PERSONAS.find(persona => persona.identity === identity)?.label || 'a demo identity'} for this rehearsal.`; }); }}><option value="" disabled>Choose identity</option>{PERSONAS.map(persona => <option key={persona.identity} value={persona.identity}>{persona.label}</option>)}</select></label>}</div></div>{data.requests.length === 0 ? <div className="demo-empty compact"><Icon name="people" /><h3>The first step belongs to the tester.</h3><p>Select <strong>Tester</strong>, then <strong>Request editing access</strong>. The saved request will appear here with 0/{data.threshold} approvals.</p></div> : <div className="demo-request-list">{data.requests.map(item => {
            const alreadyApproved = !!member && item.approvals.includes(member.subject);
            const complete = item.status === 'granted';
            return <article className={`demo-request ${complete ? 'complete' : ''}`} key={item.id} id={`request-${item.id}`}><div className="demo-request-top"><div><span className="demo-request-kicker">{item.name} requested</span><h3>{permissionName(item.capability)}</h3></div><span className={`demo-request-state ${complete ? 'complete' : ''}`}>{complete ? 'Demo grant complete' : item.approvals.length ? 'Another steward needed' : 'Awaiting demo approvals'}</span></div><p className="demo-request-reason">{item.reason}</p><div className="demo-approval-row"><div className="demo-approval-count"><strong>{item.approvals.length}<span>/{data.threshold}</span></strong><span>distinct demo approvals</span></div><div className="demo-approvers" aria-label="Recorded demo approvals">{PERSONAS.filter(persona => persona.identity !== 'tester').map(persona => {
              const approved = item.approvals.includes(`demo:${persona.identity}`);
              return <span key={persona.identity} className={approved ? 'approved' : ''}><span>{approved ? <Icon name="check" /> : persona.initials}</span>{persona.label}<small>{approved ? 'Approved' : 'No approval'}</small></span>;
            })}</div></div><div className="demo-request-bottom"><p>{complete ? 'This capability is granted to the requesting tester. Other capabilities stay unchanged.' : `${Math.max(0, data.threshold - item.approvals.length)} more different steward approval${data.threshold - item.approvals.length === 1 ? '' : 's'} required. Access remains locked.`}</p>{member?.isSteward && !complete ? <button className="button primary" disabled={busy || alreadyApproved} onClick={() => void perform(async () => { await post(`/requests/${item.id}/approve`, {}); return `Approval recorded for ${activePersona?.label || 'this demo steward'}. The server checks the two-person threshold.`; })}><Icon name={alreadyApproved ? 'check' : 'shield'} />{alreadyApproved ? 'Already approved' : 'Approve request'}</button> : complete && member?.isSteward ? <button className="button secondary" disabled={busy} onClick={() => void perform(async () => { await post('/session', { identity: 'tester' }); return 'Returned to the tester to try the granted capability.'; })}>Return to Tester<Icon name="arrow" /></button> : null}</div></article>;
          })}</div>}</section>

          <section className="demo-activity" id="demo-activity"><div className="demo-section-intro"><div><h2>Rehearsal activity</h2><p>A plain application log of demo actions. It is not a Tide audit proof.</p></div><Icon name="history" /></div>{data.activity.length ? data.activity.slice(0, 12).map(item => <div className="demo-activity-row" key={item.id}><span className="activity-dot" /><div><strong>{item.actor}</strong><span>{item.action}</span><small>{item.target}</small></div><time dateTime={item.at}>{new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>) : <div className="demo-empty compact"><p>Requests, approvals and permitted actions will appear here as the demo server records them.</p></div>}</section>
        </>}
        <footer className="demo-footer"><span>TestFlow · RMIT Hackathon 2026 · Team HaiQuayXe</span><span>Synthetic data · Simulated governance · No Jira connection</span></footer>
      </main>
    </div>

    {detail && <Modal className="detail-dialog" labelledBy="demo-detail-title" onClose={() => setDetail(null)}><button className="icon-button dialog-close" aria-label="Close demo details" onClick={() => setDetail(null)}><Icon name="close" /></button><span className="eyebrow">SYNTHETIC CASE / {detail.id}</span><h2 id="demo-detail-title">{detail.title}</h2>{[['Description', detail.description], ['Preconditions', detail.preconditions], ['Steps', detail.steps], ['Expected result', detail.expected_result]].map(([label, value]) => <div className="detail-field" key={label}><strong>{label}</strong><p>{value}</p></div>)}<small>Plan C simulation. This record is not connected to Jira.</small></Modal>}
    {requesting && <Modal labelledBy="demo-request-title" busy={busy} onClose={() => setRequesting(null)}><form onSubmit={event => { event.preventDefault(); if (busy) return; setRequestAttempted(true); void perform(async () => { await post('/requests', { capability: requesting, reason }); return 'Demo request saved. Two different stewards must approve before access changes.'; }).then(saved => { if (saved) { setRequesting(null); requestAnimationFrame(() => document.getElementById('demo-requests')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); } }); }}><button type="button" className="icon-button dialog-close" aria-label="Close demo access request" disabled={busy} onClick={() => setRequesting(null)}><Icon name="close" /></button><span className="card-eyebrow"><Icon name="shield" /> SIMULATED ACCESS REQUEST</span><h2 id="demo-request-title">{requesting === 'test-editor' ? 'Request editing access' : 'Request export access'}</h2><p>Ask for one capability. The demo server records a grant only after two different stewards approve.</p><label className="field-label" htmlFor="demo-reason">Why do you need this access?</label><textarea id="demo-reason" minLength={8} maxLength={500} required value={reason} disabled={busy} onChange={event => setReason(event.target.value)} />{requestAttempted && notice?.error && <div className="notice error" role="alert">{notice.message} Your explanation is still here.</div>}<div className="request-note"><Icon name="lock" />Saving the request does not grant access.</div><button className="button primary wide" disabled={busy}>{busy ? 'Saving…' : 'Save demo request'}<Icon name="arrow" /></button></form></Modal>}
    {resetting && <Modal labelledBy="demo-reset-title" busy={busy} onClose={() => setResetting(false)}><button className="icon-button dialog-close" aria-label="Close reset confirmation" disabled={busy} onClick={() => setResetting(false)}><Icon name="close" /></button><span className="eyebrow">REHEARSAL CONTROLS</span><h2 id="demo-reset-title">Start a fresh rehearsal?</h2><p>This clears only the isolated demo's requests, grants, sessions and activity, and restores its synthetic cases. Live TestFlow and TideCloak are unchanged.</p><div className="demo-reset-actions"><button className="button secondary" disabled={busy} onClick={() => setResetting(false)}>Keep this rehearsal</button><button className="button primary" disabled={busy} onClick={() => void perform(async () => { await post('/reset', {}); return 'Demo reset. Choose Tester to begin a fresh rehearsal.'; }).then(reset => { if (reset) setResetting(false); })}>{busy ? 'Resetting…' : 'Reset demo data'}</button></div>{notice?.error && <div className="notice error" role="alert">{notice.message}</div>}</Modal>}
  </div>;
}
