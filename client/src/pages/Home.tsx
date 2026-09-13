import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Badge,
  Button,
  BulkActionsBar,
  ChevronDown,
  Drawer,
  EmptyState,
  FilterBar,
  Globe2,
  IconForSignal,
  KpiStrip,
  RiskGauge,
  StatusChip,
  Timeline,
  Tooltip,
  Undo2,
  Users,
  VerdictBanner,
} from '@clickguard/ui';
import { Check, Download, Moon, MoreHorizontal, Search, ShieldAlert, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { excludedSpend, mockTraffic } from '@web/data/mockTraffic';
import type { Visit, Visitor } from '@web/types';
import './threat-monitoring.css';

type SortKey = 'ip' | 'risk' | 'visits' | 'paidClicks' | 'firstSeen' | 'lastUpdated';
type SortDirection = 'asc' | 'desc';

const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) => value.replace(', 2026', '').replace(' · ', ' · ');
const riskBand = (risk: number): 'low' | 'medium' | 'high' => risk >= 70 ? 'high' : risk >= 40 ? 'medium' : 'low';
const channelLabel: Record<Visit['channel'], string> = { paid: 'Paid', organic: 'Organic', direct: 'Direct', referral: 'Referral' };

function avatarSeed(ip: string) { return ip.split('.').reduce((total, value) => total + Number(value), 0) % 6; }
function visitorInitials(visitor: Visitor) { return visitor.geo.city.slice(0, 1) + visitor.geo.country.slice(0, 1); }

export default function Home() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockTraffic);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [risk, setRisk] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toast, setToast] = useState<{ message: string; undo?: () => void } | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);

  const filteredVisitors = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = visitors.filter((visitor) => {
      const matchesStatus = status === 'all' || (status === 'needs-look' ? visitor.attention : visitor.status === status);
      const matchesChannel = channel === 'all' || visitor.visits.some((visit) => visit.channel === channel);
      const matchesRisk = risk === 'all' || riskBand(visitor.risk) === risk;
      const matchesSearch = !query || visitor.ip.includes(query) || visitor.isp.toLowerCase().includes(query);
      return matchesStatus && matchesChannel && matchesRisk && matchesSearch;
    });
    return filtered.sort((a, b) => {
      const value = (visitor: Visitor) => sortKey === 'ip' ? visitor.ip : sortKey === 'risk' ? visitor.risk : sortKey === 'visits' ? visitor.visits.length : sortKey === 'paidClicks' ? visitor.paidClicks : sortKey === 'firstSeen' ? visitor.firstSeen : visitor.lastUpdated;
      const left = value(a); const right = value(b);
      if (left === right) return 0;
      const result = left > right ? 1 : -1;
      return sortDirection === 'asc' ? result : -result;
    });
  }, [channel, risk, search, sortDirection, sortKey, status, visitors]);

  const blockedVisits = visitors.filter((visitor) => visitor.status === 'excluded').reduce((total, visitor) => total + visitor.visits.length, 0);
  const monitoringCount = visitors.filter((visitor) => visitor.status === 'monitoring').length;
  const selectedAll = filteredVisitors.length > 0 && filteredVisitors.every((visitor) => selected.includes(visitor.id));

  const setSort = (key: SortKey) => { if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDirection('desc'); } };
  const resetFilters = () => { setStatus('all'); setChannel('all'); setRisk('all'); setSearch(''); };
  const toggleSelection = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleAll = () => setSelected(selectedAll ? [] : filteredVisitors.map((visitor) => visitor.id));

  const performAction = (ids: string[], action: 'exclude' | 'trust' | 'unblock' | 'whitelist' | 'review') => {
    const previous = visitors;
    const now = 'Sep 13, 2026 · 09:42';
    setVisitors((current) => current.map((visitor) => {
      if (!ids.includes(visitor.id)) return visitor;
      if (action === 'exclude') return { ...visitor, status: 'excluded', attention: false, lastUpdated: now, exclusion: { platform: 'google_ads', addedAt: now, reason: 'Manual exclusion from Threat Monitoring.' } };
      if (action === 'trust' || action === 'whitelist') return { ...visitor, status: 'whitelisted', attention: false, lastUpdated: now, exclusion: { platform: 'none', removedAt: now, reason: 'Trusted by the marketing team.' } };
      if (action === 'unblock') return { ...visitor, status: 'monitoring', attention: false, lastUpdated: now, exclusion: { platform: 'none', removedAt: now, reason: 'Unblocked by the marketing team.' } };
      return { ...visitor, status: 'monitoring', attention: true, lastUpdated: now, exclusion: { ...visitor.exclusion, reason: 'Marked for review by the marketing team.' } };
    }));
    setSelected([]);
    if (selectedVisitor && ids.includes(selectedVisitor.id)) setSelectedVisitor(null);
    const message = action === 'exclude' ? `${ids.length} visitor${ids.length === 1 ? '' : 's'} added to the Google Ads exclusion list.` : action === 'review' ? 'Visitor marked for review.' : 'Visitor state updated and history preserved.';
    setToast({ message, undo: () => { setVisitors(previous); setToast(null); } });
    window.setTimeout(() => setToast(null), 7000);
  };

  const exportCsv = () => {
    const rows = [['IP', 'Status', 'Risk band', 'Visits', 'Paid clicks', 'Spend', 'First seen', 'Last updated'], ...filteredVisitors.map((visitor) => [visitor.ip, visitor.status, riskBand(visitor.risk), String(visitor.visits.length), String(visitor.paidClicks), String(visitor.visits.reduce((sum, visit) => sum + (visit.costUsd ?? 0), 0)), visitor.firstSeen, visitor.lastUpdated])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'clickguard-threat-monitoring.csv'; anchor.click(); URL.revokeObjectURL(url);
    setToast({ message: `${filteredVisitors.length} visitors exported as CSV.` });
    window.setTimeout(() => setToast(null), 4500);
  };

  return <div className="threat-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="topbar"><div className="brand-lockup"><div className="brand-mark"><ShieldAlert size={17} /></div><div><strong>click<span>guard</span></strong><small>clarity · control · confidence</small></div></div><nav aria-label="Primary navigation"><a className="nav-active" href="#main-content">Threat Monitoring</a><a href="#analytics" onClick={(event) => event.preventDefault()}>Threat Analytics</a><a href="#forensics" onClick={(event) => event.preventDefault()}>Click Forensics</a></nav><div className="account-tools"><label className="account-selector"><span className="account-avatar">AI</span><span><strong>Acme Industries</strong><small>Google Ads · Meta Ads</small></span><ChevronDown size={14} /></label><button className="theme-toggle" type="button" onClick={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}</button><button className="user-menu" type="button" aria-label="Open account menu"><MoreHorizontal size={17} /></button></div></header>
    <main id="main-content" className="page-wrap">
      <section className="page-heading"><div><div className="heading-kicker"><span className="live-dot" /> Live protection <span>·</span> Updated just now</div><h1>Threat Monitoring</h1><p>See who ClickGuard is quietly watching, what it learned, and why a visitor was blocked.</p></div><div className="heading-actions"><Button variant="secondary" size="sm" onClick={exportCsv}><Download size={14} /> Export CSV</Button><Button variant="primary" size="sm"><ShieldAlert size={14} /> Connect ad account</Button></div></section>
      <div className="trust-note"><span className="trust-note-icon"><Check size={15} /></span><p><strong>Trust is the product.</strong> Every status is reversible, every paid click is auditable, and the reasoning trail stays attached to the visit where it happened.</p><span className="accuracy-pill">99.8% accuracy</span></div>
      <KpiStrip items={[{ label: 'Blocked visits', value: String(blockedVisits), detail: 'Cumulative threats stopped', tone: 'danger', icon: <ShieldAlert size={18} /> }, { label: 'Spend avoided', value: formatMoney(excludedSpend), detail: 'Auditable paid traffic value', tone: 'success', icon: <span className="kpi-dollar">$</span> }, { label: 'Monitoring', value: String(monitoringCount), detail: 'Visitors quietly observed', tone: 'blue', icon: <Users size={18} /> }, { label: 'Decision accuracy', value: '99.8%', detail: 'Across reviewed traffic', tone: 'violet', icon: <Check size={18} /> }]} />
      <section className="workspace" aria-label="Visitor monitoring workspace">
        <div className="section-heading"><div><span className="eyebrow">Visitor queue</span><h2>All traffic, one reasoning trail</h2></div><div className="queue-summary"><span className="queue-count">{filteredVisitors.length}</span><span>of {visitors.length} visitors</span></div></div>
        <FilterBar status={status} setStatus={setStatus} channel={channel} setChannel={setChannel} risk={risk} setRisk={setRisk} search={search} setSearch={setSearch} onReset={resetFilters} />
        <div className="results-bar"><span aria-live="polite">Showing <strong>{filteredVisitors.length}</strong> of {visitors.length} visitors</span><span className="results-hint"><span className="kbd">/</span> to search <span className="kbd">Esc</span> closes a visitor</span></div>
        {selected.length > 0 && <BulkActionsBar count={selected.length} onAction={(action) => performAction(selected, action)} onExport={exportCsv} />}
        {filteredVisitors.length === 0 ? <EmptyState zeroResults onReset={resetFilters} /> : <div className="table-card"><table className="traffic-table"><caption className="sr-only">ClickGuard Threat Monitoring visitor traffic</caption><thead><tr><th scope="col" className="check-col"><input type="checkbox" checked={selectedAll} onChange={toggleAll} aria-label="Select all visible visitors" /></th><SortableHeader label="Visitor" sortKey="ip" sortKeyState={sortKey} sortDirection={sortDirection} setSort={setSort} /><th scope="col">Status</th><SortableHeader label="Risk" sortKey="risk" sortKeyState={sortKey} sortDirection={sortDirection} setSort={setSort} /><SortableHeader label="Visits" sortKey="visits" sortKeyState={sortKey} sortDirection={sortDirection} setSort={setSort} /><th scope="col">Lead signal</th><SortableHeader label="First seen" sortKey="firstSeen" sortKeyState={sortKey} sortDirection={sortDirection} setSort={setSort} /><SortableHeader label="Last updated" sortKey="lastUpdated" sortKeyState={sortKey} sortDirection={sortDirection} setSort={setSort} /></tr></thead><tbody>{filteredVisitors.map((visitor) => <VisitorRow key={visitor.id} visitor={visitor} selected={selected.includes(visitor.id)} onToggle={() => toggleSelection(visitor.id)} onOpen={() => setSelectedVisitor(visitor)} />)}</tbody></table><div className="table-footer"><span>Showing {filteredVisitors.length} visitor{filteredVisitors.length === 1 ? '' : 's'} · page 1 of 3</span><div className="pagination"><Button variant="ghost" size="sm" disabled>Previous</Button><Button variant="secondary" size="sm">1</Button><Button variant="ghost" size="sm">2</Button><Button variant="ghost" size="sm">3</Button><Button variant="ghost" size="sm">Next <ArrowDown size={12} className="rotate-270" /></Button></div></div></div>}
      </section>
    </main>
    {selectedVisitor && <VisitorDrawer visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} onAction={(action) => performAction([selectedVisitor.id], action)} />}
    {toast && <div className="toast" role="status"><span className="toast-icon"><Check size={14} /></span><span>{toast.message}</span>{toast.undo && <button type="button" onClick={toast.undo}><Undo2 size={13} /> Undo</button>}<button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={14} /></button></div>}
  </div>;
}

function SortableHeader({ label, sortKey, sortKeyState, sortDirection, setSort }: { label: string; sortKey: SortKey; sortKeyState: SortKey; sortDirection: SortDirection; setSort: (key: SortKey) => void }) {
  const active = sortKey === sortKeyState;
  return <th scope="col" aria-sort={active ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'}><button type="button" className={`sort-button ${active ? 'is-active' : ''}`} onClick={() => setSort(sortKey)}>{label}{active ? sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : <ArrowDown size={12} className="sort-muted" />}</button></th>;
}

function VisitorRow({ visitor, selected, onToggle, onOpen }: { visitor: Visitor; selected: boolean; onToggle: () => void; onOpen: () => void }) {
  const totalSpend = visitor.visits.reduce((sum, visit) => sum + (visit.costUsd ?? 0), 0);
  const lastVisit = visitor.visits[visitor.visits.length - 1];
  return <tr className={selected ? 'is-selected' : ''}><td className="check-col"><input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Select ${visitor.ip}`} /></td><td><button className="visitor-cell" type="button" onClick={onOpen}><span className={`identicon identicon-${avatarSeed(visitor.ip)}`} aria-hidden="true">{visitorInitials(visitor)}</span><span><strong>{visitor.ip}</strong><small>{visitor.geo.city}, {visitor.geo.country} <span>· {visitor.isp}</span></small></span></button></td><td><StatusChip status={visitor.status} attention={visitor.attention} substate={visitor.subState} /></td><td><RiskGauge band={riskBand(visitor.risk)} /></td><td><div className="visit-count"><strong>{visitor.visits.length}</strong><span>{visitor.paidClicks} paid</span>{visitor.visits.length > 10 && <Badge tone="violet">+{visitor.visits.length - 5} burst</Badge>}</div></td><td><Tooltip label="This is the lead signal ClickGuard attached to the journey. Open the visitor to see every contributing signal."><span className="lead-signal"><IconForSignal signal={visitor.leadSignal} /><span>{visitor.leadSignal}</span></span></Tooltip></td><td><span className="date-cell">{formatDate(visitor.firstSeen)}<small>{visitor.visits[0]?.channel === 'paid' ? 'Paid landing' : channelLabel[visitor.visits[0]?.channel ?? 'direct']}</small></span></td><td><Tooltip label={`Last visit: ${lastVisit?.ts ?? 'No visits'} · ${formatMoney(totalSpend)} total paid spend`}><span className="date-cell"><strong>{formatDate(visitor.lastUpdated)}</strong><small>{lastVisit?.ts.split(' · ')[1] ?? '—'} last seen</small></span></Tooltip></td></tr>;
}

function VisitorDrawer({ visitor, onClose, onAction }: { visitor: Visitor; onClose: () => void; onAction: (action: 'unblock' | 'whitelist' | 'review') => void }) {
  const isConverted = visitor.id === 'visitor-converted';
  const isAmbiguous = visitor.id === 'visitor-ambiguous';
  const timelineVisits = visitor.visits.map((item) => ({ id: item.id, ts: item.ts, channel: channelLabel[item.channel], page: item.page, referrer: item.referrer, costUsd: item.costUsd, converted: item.converted, signals: item.signals.map((item) => ({ label: signalLabel(item.signal), value: item.value, note: item.note, diagnostic: item.diagnostic, tone: item.tone })) }));
  const burstVisits = visitor.visits.length > 10 ? timelineVisits.slice(0, 10) : undefined;
  return <Drawer open onOpenChange={(open) => { if (!open) onClose(); }} title="Visitor reasoning trail" description="The evidence stays attached to the visit where ClickGuard observed it."><div className="drawer-visitor-head"><div className={`drawer-identicon identicon-${avatarSeed(visitor.ip)}`}>{visitorInitials(visitor)}</div><div><strong>{visitor.ip}</strong><span>{visitor.geo.city}, {visitor.geo.region} · {visitor.isp}</span></div><div className="drawer-platforms">{visitor.exclusion.platform !== 'none' ? <Badge tone="brand">{visitor.exclusion.platform === 'google_ads' ? 'Google Ads' : 'Meta Ads'}</Badge> : <Badge tone="neutral">No exclusion</Badge>}</div></div><VerdictBanner tone={visitor.status === 'excluded' ? 'danger' : isAmbiguous ? 'warning' : visitor.status === 'whitelisted' || isConverted ? 'success' : 'brand'} icon={visitor.status === 'excluded' ? <ShieldAlert size={18} /> : isConverted ? <Check size={18} /> : <Globe2 size={18} />} detail={visitor.status === 'excluded' ? `Added to ${visitor.exclusion.platform === 'google_ads' ? 'Google Ads' : 'Meta Ads'} exclusion list · ${visitor.lastUpdated}` : isConverted ? 'Perceived as suspicious → validated after purchase · auto-cleared' : isAmbiguous ? 'Confidence is Medium · the next evidence can change this assessment' : `${visitor.status === 'whitelisted' ? 'Manually trusted after review' : 'Watching · evidence still developing'} · ${visitor.lastUpdated}`}>{visitor.status === 'excluded' ? 'Blocked — cumulative bot pattern confirmed.' : isAmbiguous ? 'Under review — mixed signals.' : isConverted ? 'Trusted — conversion validated the visitor.' : visitor.status === 'whitelisted' ? 'Trusted — the team kept this visitor visible.' : 'Watching — awaiting more interactions and clicks.'}</VerdictBanner><div className="drawer-meta"><div><span>Visits</span><strong>{visitor.visits.length}</strong></div><div><span>Paid clicks</span><strong>{visitor.paidClicks}</strong></div><div><span>Spend</span><strong>{formatMoney(visitor.visits.reduce((sum, visit) => sum + (visit.costUsd ?? 0), 0))}</strong></div><div><span>Risk</span><RiskGauge band={riskBand(visitor.risk)} score={visitor.risk} detail /></div></div><div className="trail-heading"><div><span className="eyebrow">Click Forensics</span><h3>Journey as the decision</h3></div><span className="trail-caption">{visitor.visits.length} timestamps · {visitor.visits.reduce((sum, visit) => sum + visit.signals.length, 0)} signals</span></div><Timeline visits={timelineVisits} burst={burstVisits ? { label: `${visitor.visits.length} visits · dense journey`, detail: `${visitor.visits.filter((visit) => visit.signals.some((item) => item.signal === 'sessionDepth' && item.value === 1)).length} bounce signals · expand to inspect each visit`, visits: burstVisits } : undefined} reEvaluation={isAmbiguous ? { confidence: 'Medium', prognosis: 'If this visitor engages with 3+ pages in the next 7 days, we clear the concern automatically.', diagnostics: ['VPN on 2 visits', 'Pricing-only return pattern', 'High interaction'] } : undefined} converter={isConverted} /><div className="rule-note"><AlertCircle size={15} /><span><strong>Why this is cumulative:</strong> ClickGuard evaluates the visitor’s whole journey — not a single last visit. The IP is what gets added to the exclusion list.</span></div><div className="drawer-actions"><Button variant="ghost" size="sm" onClick={onClose}>Close</Button><Button variant="secondary" size="sm" onClick={() => onAction(visitor.status === 'excluded' ? 'unblock' : 'whitelist')}><Undo2 size={14} /> {visitor.status === 'excluded' ? 'Unblock' : 'Whitelist'}</Button><Button variant="primary" size="sm" onClick={() => onAction('review')}><Search size={14} /> Mark for review</Button></div></Drawer>;
}

function signalLabel(signal: string) { const labels: Record<string, string> = { ipAddress: 'IP address', location: 'Location', interactionLevel: 'Interaction', botProbability: 'Bot probability', vpnProxy: 'VPN / proxy', formFill: 'Form fill', conversion: 'Conversion', deviceFingerprint: 'Device', clickVelocityMs: 'Click speed', temporalPattern: 'Time pattern', sessionDepth: 'Pages', ipReputation: 'IP reputation', priorVisitsFlagged: 'Prior flags', adCreativeHit: 'Creative' }; return labels[signal] ?? signal; }
