import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  Fingerprint,
  Globe2,
  Info,
  Loader2,
  LockKeyhole,
  MousePointer2,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Timer,
  Undo2,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';

import './styles.css';

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'blue';

const toneClass: Record<Tone, string> = {
  neutral: 'cg-tone-neutral',
  brand: 'cg-tone-brand',
  success: 'cg-tone-success',
  warning: 'cg-tone-warning',
  danger: 'cg-tone-danger',
  violet: 'cg-tone-violet',
  blue: 'cg-tone-blue',
};

export function Button({ variant = 'secondary', size = 'md', className = '', children, ...props }: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg' }) {
  return <button className={`cg-button cg-button-${variant} cg-button-${size} ${className}`} {...props}>{children}</button>;
}

export function Badge({ tone = 'neutral', icon, children, className = '' }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return <span className={`cg-badge ${toneClass[tone]} ${className}`}>{icon}{children}</span>;
}

export function DiagnosticTag({ children }: { children: ReactNode }) {
  return <Badge tone="violet" icon={<Sparkles size={12} />}>{children}</Badge>;
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={160}><TooltipPrimitive.Root><TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger><TooltipPrimitive.Portal><TooltipPrimitive.Content className="cg-tooltip" sideOffset={6}>{label}<TooltipPrimitive.Arrow className="cg-tooltip-arrow" /></TooltipPrimitive.Content></TooltipPrimitive.Portal></TooltipPrimitive.Root></TooltipPrimitive.Provider>;
}

export function ChannelChip({ channel, compact = false }: { channel: 'paid' | 'organic' | 'direct' | 'referral'; compact?: boolean }) {
  const config = {
    paid: { label: 'Paid', tone: 'brand' as Tone, icon: <MousePointer2 size={12} />, meaning: 'Paid click · advertiser spend applies' },
    organic: { label: 'Organic', tone: 'success' as Tone, icon: <Globe2 size={12} />, meaning: 'Organic arrival · no ad spend' },
    direct: { label: 'Direct', tone: 'neutral' as Tone, icon: <ArrowDown size={12} />, meaning: 'Direct arrival · no ad spend' },
    referral: { label: 'Referral', tone: 'violet' as Tone, icon: <ChevronRight size={12} />, meaning: 'Referral arrival · no ad spend' },
  }[channel];
  return <Tooltip label={config.meaning}><span className={`cg-channel-chip ${compact ? 'is-compact' : ''}`}><span className={`cg-channel-icon ${toneClass[config.tone]}`}>{config.icon}</span>{config.label}</span></Tooltip>;
}

export function SpendChip({ amount, context = 'paid-visit' }: { amount: number; context?: 'paid-visit' | 'spend-avoided' }) {
  return <span className={`cg-spend-chip ${context === 'spend-avoided' ? 'is-avoided' : ''}`}><span>$</span>{amount.toFixed(2)}{context === 'spend-avoided' ? ' saved' : ' spend'}</span>;
}

export function SignalEvidence({ label, value, meaning, diagnostic = false, tone = 'neutral' }: { label: string; value: string | number; meaning: string; diagnostic?: boolean; tone?: Tone }) {
  return <div className={`cg-signal-evidence ${toneClass[tone]}`}><div className="cg-signal-evidence-head"><span>{label}</span>{diagnostic && <DiagnosticTag>Diagnostic only</DiagnosticTag>}</div><strong>{value}</strong><p>{meaning}</p></div>;
}

export function BurstNode({ count, duration, range, bounceRate, expanded, onToggle }: { count: number; duration: string; range: string; bounceRate: string; expanded?: boolean; onToggle?: () => void }) {
  return <div className="cg-burst-node"><button type="button" onClick={onToggle} aria-expanded={expanded}><span className="cg-burst-icon"><Zap size={15} /></span><span><strong>{count} visits · dense journey</strong><small>{duration} · {range} · {bounceRate} bounce</small></span><ChevronDown size={16} className={expanded ? 'is-open' : ''} /></button></div>;
}

export function ConversionResolution({ onOverride }: { onOverride?: (action: 'review' | 'reblock') => void }) {
  return <div className="cg-conversion-resolution"><div className="cg-resolution-header"><span className="cg-resolution-icon"><Check size={15} /></span><div><strong>Conversion resolved the challenge</strong><small>Automatic rule applied · visitor removed from exclusion lists</small></div></div><div className="cg-resolution-steps"><span>Perceived as suspicious</span><i>→</i><span>Purchase confirmed</span><i>→</i><strong>Auto-cleared</strong></div>{onOverride && <div className="cg-resolution-actions"><Button size="sm" variant="secondary" onClick={() => onOverride('review')}>Mark for review</Button><Button size="sm" variant="danger" onClick={() => onOverride('reblock')}>Re-block override</Button></div>}</div>;
}

export function PageControls({ page, pageCount, total, pageSize, onPageChange }: { page: number; pageCount: number; total: number; pageSize: number; onPageChange: (page: number) => void }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return <nav className="cg-page-controls" aria-label="Visitor table pagination"><span>Showing <strong>{start}–{end}</strong> of {total}</span><div className="cg-page-buttons"><Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Button>{Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5).map((pageNumber) => <Button key={pageNumber} variant={pageNumber === page ? 'secondary' : 'ghost'} size="sm" aria-current={pageNumber === page ? 'page' : undefined} onClick={() => onPageChange(pageNumber)}>{pageNumber}</Button>)}<Button variant="ghost" size="sm" disabled={page === pageCount || pageCount === 0} onClick={() => onPageChange(page + 1)}>Next <ChevronRight size={12} /></Button></div></nav>;
}

export function StatusChip({ status, attention = false, substate }: { status: 'monitoring' | 'excluded' | 'whitelisted'; attention?: boolean; substate?: string }) {
  const config = {
    monitoring: { label: attention ? 'Needs a look' : 'Watching', tone: attention ? 'warning' as Tone : 'blue' as Tone, icon: <Eye size={13} /> },
    excluded: { label: 'Blocked', tone: 'danger' as Tone, icon: <ShieldOff size={13} /> },
    whitelisted: { label: 'Trusted', tone: 'success' as Tone, icon: <ShieldCheck size={13} /> },
  }[status];
  return <span className="cg-status-stack"><Badge tone={config.tone} icon={config.icon}>{config.label}</Badge>{substate && <span className="cg-substate">{substate}</span>}</span>;
}

export function RiskGauge({ band, score, detail = false }: { band: 'low' | 'medium' | 'high'; score?: number; detail?: boolean }) {
  const label = band === 'medium' ? 'Medium' : band[0].toUpperCase() + band.slice(1);
  const filled = score ? Math.max(1, Math.round(score / 20)) : band === 'high' ? 5 : band === 'medium' ? 3 : 1;
  return <span className={`cg-risk cg-risk-${band} ${detail ? 'cg-risk-detail' : ''}`} title={detail && score !== undefined ? `Diagnostic risk signal: ${score} of 100` : undefined}><span className="cg-risk-ticks" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < filled ? 'is-filled' : ''} />)}</span><span>{label}</span>{detail && score !== undefined && <strong>{score}/100 <small>diagnostic</small></strong>}</span>;
}

export function VerdictBanner({ tone = 'neutral', icon = <ShieldCheck size={18} />, children, detail }: { tone?: Tone; icon?: ReactNode; children: ReactNode; detail?: ReactNode }) {
  return <div className={`cg-verdict ${toneClass[tone]}`}><span className="cg-verdict-icon">{icon}</span><div><strong>{children}</strong>{detail && <span>{detail}</span>}</div></div>;
}

export function KpiStrip({ items }: { items: Array<{ label: string; value: string; detail: string; tone?: Tone; icon: ReactNode }> }) {
  return <section className="cg-kpis" aria-label="Threat Monitoring overview">{items.map((item) => <div className="cg-kpi" key={item.label}><div className={`cg-kpi-icon ${toneClass[item.tone ?? 'brand']}`}>{item.icon}</div><div><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></div></div>)}</section>;
}

export function SearchInput({ value, onChange, onClear }: { value: string; onChange: (value: string) => void; onClear: () => void }) {
  return <label className="cg-search"><span className="sr-only">Search by IP address or ISP</span><Globe2 size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search IP or ISP" aria-describedby="search-help" />{value && <button type="button" aria-label="Clear search" onClick={onClear}><X size={14} /></button>}<span id="search-help" className="sr-only">IP format is validated as you type</span></label>;
}

export function FilterBar({ status, setStatus, channel, setChannel, risk, setRisk, search, setSearch, onReset }: { status: string; setStatus: (value: string) => void; channel: string; setChannel: (value: string) => void; risk: string; setRisk: (value: string) => void; search: string; setSearch: (value: string) => void; onReset: () => void }) {
  return <div className="cg-filterbar"><div className="cg-filter-intro"><span className="eyebrow">Explore traffic</span><strong>Filter the reasoning queue</strong></div><label className="cg-select-label"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="monitoring">Watching</option><option value="needs-look">Needs a look</option><option value="excluded">Blocked</option><option value="whitelisted">Trusted</option></select><ChevronDown size={14} /></label><label className="cg-select-label"><span>Channel</span><select value={channel} onChange={(event) => setChannel(event.target.value)}><option value="all">All channels</option><option value="paid">Paid</option><option value="organic">Organic</option><option value="direct">Direct</option><option value="referral">Referral</option></select><ChevronDown size={14} /></label><label className="cg-select-label"><span>Risk band</span><select value={risk} onChange={(event) => setRisk(event.target.value)}><option value="all">All bands</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><ChevronDown size={14} /></label><SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} /><Button variant="ghost" size="sm" onClick={onReset}>Reset</Button></div>;
}

export function EmptyState({ zeroResults, onReset }: { zeroResults?: boolean; onReset?: () => void }) {
  if (zeroResults) return <div className="cg-empty"><div className="cg-empty-icon"><CircleHelp size={22} /></div><h3>No visitors match those filters</h3><p>Try widening the status, channel, or risk band. ClickGuard keeps every visitor visible by default.</p><Button variant="secondary" onClick={onReset}>Reset filters</Button></div>;
  return <div className="cg-empty"><div className="cg-empty-icon"><ShieldCheck size={22} /></div><h3>No threats yet — that’s what protection looks like</h3><p>ClickGuard is quietly watching click speed, fingerprint, VPN/proxy, repeat patterns, and bounce signals.</p><div className="cg-empty-signals"><Badge tone="blue">Click speed</Badge><Badge tone="violet">Fingerprint</Badge><Badge tone="neutral">VPN / proxy</Badge><Badge tone="neutral">Repeat patterns</Badge><Badge tone="neutral">Bounce</Badge></div><Button variant="primary"><Zap size={15} /> Connect your ad account</Button></div>;
}

export function Skeleton({ width = '100%' }: { width?: string }) { return <span className="cg-skeleton" style={{ '--skeleton-width': width } as React.CSSProperties} aria-hidden="true" />; }

export function ActionBar({ onAction, disabled }: { onAction: (action: 'unblock' | 'whitelist' | 'review') => void; disabled?: boolean }) {
  return <div className="cg-actionbar"><div><span className="eyebrow">Visitor actions</span><strong>Keep the final say</strong><small>Every action is reversible and leaves a visible trail.</small></div><div className="cg-action-buttons"><Button size="sm" variant="secondary" disabled={disabled} onClick={() => onAction('unblock')}><Undo2 size={14} /> Unblock</Button><Button size="sm" variant="secondary" disabled={disabled} onClick={() => onAction('whitelist')}><ShieldCheck size={14} /> Whitelist</Button><Button size="sm" variant="primary" disabled={disabled} onClick={() => onAction('review')}><Eye size={14} /> Mark for review</Button></div></div>;
}

export function ReEvaluationCard({ confidence, prognosis, diagnostics }: { confidence: 'Low' | 'Medium' | 'High'; prognosis: string; diagnostics: string[] }) {
  return <div className="cg-reeval"><div className="cg-reeval-top"><span className="cg-node-label"><RefreshIcon /> Re-evaluation</span><Badge tone="warning">Under review</Badge></div><p>Mixed signals remain. ClickGuard is keeping this visitor visible while the journey develops.</p><div className="cg-reeval-grid"><div><span>Confidence</span><strong>{confidence}</strong></div><div><span>Falsifiable prognosis</span><strong>{prognosis}</strong></div></div><div className="cg-diagnostics"><span>Diagnostics only</span>{diagnostics.map((item) => <DiagnosticTag key={item}>{item}</DiagnosticTag>)}</div></div>;
}

function RefreshIcon() { return <span className="cg-refresh-icon"><Loader2 size={14} /></span>; }

export type TimelineVisit = { id: string; ts: string; channel: string; page: string; referrer?: string; costUsd?: number; signals: Array<{ label: string; value: string | number; note: string; diagnostic?: boolean; tone?: Tone }>; converted?: boolean };

export function Timeline({ visits, burst, reEvaluation, converter }: { visits: TimelineVisit[]; burst?: { label: string; detail: string; visits: TimelineVisit[] }; reEvaluation?: { confidence: 'Low' | 'Medium' | 'High'; prognosis: string; diagnostics: string[] }; converter?: boolean }) {
  const [expandedBurst, setExpandedBurst] = useState(false);
  const shownVisits = burst && !expandedBurst ? visits.filter((visit) => !burst.visits.some((burstVisit) => burstVisit.id === visit.id)) : visits;
  return <div className="cg-timeline">{converter && <div className="cg-phase"><span className="cg-phase-dot cg-phase-dot-suspicious" /><div><strong>Phase 1 · Perceived as suspicious</strong><span>Accumulated signals triggered a temporary block across the visitor journey.</span></div></div>}{burst && <div className="cg-burst"><button type="button" onClick={() => setExpandedBurst((value) => !value)} aria-expanded={expandedBurst}><span className="cg-burst-icon"><Zap size={15} /></span><span><strong>{burst.label}</strong><small>{burst.detail}</small></span><ChevronDown size={16} className={expandedBurst ? 'is-open' : ''} /></button></div>}{shownVisits.map((visit) => <VisitNode visit={visit} key={visit.id} />)}{reEvaluation && <ReEvaluationCard {...reEvaluation} />}{converter && <div className="cg-phase cg-phase-final"><span className="cg-phase-dot cg-phase-dot-cleared" /><div><strong>Phase 2 · Validated after purchase</strong><span>Conversion confirmed. Automatic rule applied: perceived as suspicious → validated after purchase → auto-cleared.</span><div className="cg-converter-callout"><Check size={14} /> The visitor was removed from exclusion lists automatically.</div></div></div>}</div>;
}

function VisitNode({ visit }: { visit: TimelineVisit }) {
  const [open, setOpen] = useState(false);
  const channelTone: Record<string, Tone> = { Paid: 'brand', Organic: 'success', Direct: 'neutral', Referral: 'violet' };
  return <article className={`cg-visit ${open ? 'is-open' : ''}`}><span className="cg-visit-line" /><div className="cg-visit-dot" /><div className="cg-visit-body"><div className="cg-visit-top"><div><span className="cg-visit-time"><Clock3 size={13} />{visit.ts}</span><Badge tone={channelTone[visit.channel] ?? 'neutral'}>{visit.channel}</Badge>{visit.costUsd !== undefined && <span className="cg-cost-chip">${visit.costUsd.toFixed(2)} spend</span>}</div><button type="button" className="cg-icon-button" onClick={() => setOpen((value) => !value)} aria-label={`${open ? 'Collapse' : 'Expand'} visit ${visit.id}`} aria-expanded={open}><ChevronRight size={16} /></button></div><h4>{visit.page}</h4>{visit.referrer && <p className="cg-referrer">via {visit.referrer}</p>}<div className="cg-signal-preview">{visit.signals.slice(0, 3).map((signal) => <Tooltip label={signal.note} key={`${visit.id}-${signal.label}`}><span className="cg-signal-tag"><Info size={12} />{signal.label}</span></Tooltip>)}{visit.signals.length > 3 && <span className="cg-more-signals">+{visit.signals.length - 3} more</span>}</div>{open && <div className="cg-visit-details">{visit.signals.map((signal) => <VisitDetail key={`${visit.id}-${signal.label}`} label={signal.label} value={String(signal.value)} meaning={signal.note} diagnostic={signal.diagnostic} tone={signal.tone} />)}</div>}</div></article>;
}

export function VisitDetail({ label, value, meaning, diagnostic, tone = 'neutral' }: { label: string; value: string; meaning: string; diagnostic?: boolean; tone?: Tone }) {
  return <div className={`cg-visit-detail ${toneClass[tone]}`}><div className="cg-detail-heading"><strong>{label}</strong>{diagnostic && <DiagnosticTag>Diagnostic</DiagnosticTag>}</div><span className="cg-detail-value">{value}</span><p>{meaning}</p></div>;
}

export function Drawer({ open, onOpenChange, children, title, description }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode; title: string; description?: string }) {
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="cg-dialog-overlay" /><DialogPrimitive.Content className="cg-drawer"><div className="cg-drawer-head"><div><DialogPrimitive.Title className="cg-drawer-title">{title}</DialogPrimitive.Title>{description && <DialogPrimitive.Description className="cg-drawer-description">{description}</DialogPrimitive.Description>}</div><DialogPrimitive.Close asChild><button className="cg-icon-button" aria-label="Close visitor details"><X size={18} /></button></DialogPrimitive.Close></div>{children}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>;
}

export function BulkActionsBar({ count, onAction, onExport }: { count: number; onAction: (action: 'exclude' | 'trust') => void; onExport: () => void }) {
  return <div className="cg-bulkbar"><span><strong>{count}</strong> selected</span><div><Button size="sm" variant="danger" onClick={() => onAction('exclude')}><ShieldOff size={14} /> Exclude</Button><Button size="sm" variant="secondary" onClick={() => onAction('trust')}><ShieldCheck size={14} /> Trust</Button><Button size="sm" variant="ghost" onClick={onExport}>Export CSV</Button></div></div>;
}

export function IconForSignal({ signal }: { signal: string }) {
  if (signal.toLowerCase().includes('interaction') || signal.toLowerCase().includes('click')) return <MousePointer2 size={14} />;
  if (signal.toLowerCase().includes('device') || signal.toLowerCase().includes('finger')) return <Fingerprint size={14} />;
  if (signal.toLowerCase().includes('ip') || signal.toLowerCase().includes('reputation')) return <LockKeyhole size={14} />;
  return <Info size={14} />;
}

export { AlertCircle, ArrowDown, ArrowUp, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Eye, Globe2, Info, Loader2, ShieldCheck, ShieldOff, Sparkles, Timer, Undo2, UserRound, Users, Zap };
