import type { SignalId, Visit, Visitor } from '../types';

const signal = (signalId: SignalId, value: string | number, note: string, extra: Partial<Visit['signals'][number]> = {}) => ({ signal: signalId, value, note, ...extra });
const visit = (id: string, ts: string, channel: Visit['channel'], page: string, deviceFingerprint: string, signals: Visit['signals'], extra: Partial<Visit> = {}): Visit => ({ id, ts, channel, page, deviceFingerprint, signals, ...extra });
const baseGeo = { country: 'United States', region: 'California', city: 'San Francisco' };

const blockedJourney: Visit[] = Array.from({ length: 14 }, (_, index) => { const minuteOfDay = 3 * 60 + 37 + Math.round((index * 92) / 13); const hour = Math.floor(minuteOfDay / 60); const minute = minuteOfDay % 60; return visit(`mal-${index + 1}`, `Sep 12 · ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, 'paid', index % 3 === 0 ? '/pricing' : '/features', 'fp-headless-7b2', [
  signal('botProbability', 98 + (index % 3), 'Diagnostic model clue only; the journey pattern is the decision.', { diagnostic: true, tone: 'danger' }),
  signal('clickVelocityMs', 184 - (index % 4) * 9, 'Sustained under 300ms is machine-like.', { diagnostic: true, tone: 'danger' }),
  signal('interactionLevel', 'Low', 'No scroll or meaningful mouse movement recorded.', { tone: 'danger' }),
  signal('ipReputation', 'Datacenter', 'The network is associated with hosting infrastructure.', { tone: 'danger' }),
  signal('sessionDepth', 1, 'Depth 1 means the visit bounced after one page.'),
  ...(index % 2 === 0 ? [signal('formFill', 'Invalid email', 'Seven attempted form fills could not be delivered.', { tone: 'danger' })] : []),
], { costUsd: 3.4 + (index % 4) * 0.35 }); });

const ambiguousJourney: Visit[] = [
  visit('amb-1', 'Aug 22 · 09:18', 'paid', '/pricing', 'fp-res-19a', [signal('interactionLevel', 'High', 'Scrolled through 82% of the page and moved the pointer naturally.', { tone: 'success' }), signal('sessionDepth', 5, 'Meaningful browsing depth suggests a human journey.'), signal('adCreativeHit', 'Summer / comparison', 'Creative attribution remains auditable.')], { costUsd: 4.2 }),
  visit('amb-2', 'Aug 27 · 13:42', 'organic', '/pricing', 'fp-res-19a', [signal('vpnProxy', 'VPN detected', 'A VPN can hide the real location; it is a clue, not a verdict.', { tone: 'warning' }), signal('interactionLevel', 'High', 'Read the comparison table and expanded FAQ.', { tone: 'success' }), signal('sessionDepth', 7, 'The visitor explored beyond the landing page.')], { referrer: 'Google organic' }),
  visit('amb-3', 'Sep 04 · 11:06', 'paid', '/case-studies', 'fp-res-19a', [signal('interactionLevel', 'Medium', 'Read a case study and returned after 21 days.', { tone: 'brand' }), signal('vpnProxy', 'VPN detected', 'VPN was present on two of the five visits.', { tone: 'warning' }), signal('temporalPattern', 'Work hours', 'Visits cluster during normal work hours.')], { costUsd: 4.2 }),
  visit('amb-4', 'Sep 10 · 15:27', 'referral', '/pricing', 'fp-res-19a', [signal('sessionDepth', 4, 'Visited pricing, FAQ, and contact pages.'), signal('interactionLevel', 'High', 'Hovered comparison rows and opened the FAQ.', { tone: 'success' }), signal('ipReputation', 'Residential', 'The network is not a known datacenter range.')], { referrer: 'Agency partner' }),
  visit('amb-5', 'Sep 12 · 10:51', 'paid', '/pricing', 'fp-res-19a', [signal('interactionLevel', 'Medium', 'Returns to pricing but has not submitted a form.', { tone: 'brand' }), signal('temporalPattern', 'Work hours', 'The latest visit remains within normal work hours.')], { costUsd: 4.2 }),
];

const convertedJourney: Visit[] = [
  visit('conv-1', 'Sep 09 · 02:14', 'paid', '/pricing', 'fp-emulated-44', [signal('botProbability', 94, 'Diagnostic model clue only; it raised the initial concern.', { diagnostic: true, tone: 'danger' }), signal('clickVelocityMs', 221, 'Fast cadence across two clicks.', { diagnostic: true, tone: 'danger' }), signal('temporalPattern', 'Idle hours', 'The visit arrived at 02:14 local time.', { tone: 'warning' })], { costUsd: 3.1 }),
  visit('conv-2', 'Sep 09 · 02:16', 'paid', '/demo', 'fp-emulated-44', [signal('interactionLevel', 'Low', 'Initial interaction was limited.', { tone: 'warning' }), signal('priorVisitsFlagged', 'Yes', 'The visitor had already triggered signals on the prior visit.', { tone: 'danger' })], { costUsd: 3.1 }),
  visit('conv-3', 'Sep 09 · 02:20', 'paid', '/checkout', 'fp-emulated-44', [signal('conversion', 'Purchase confirmed', 'A real order validates the visitor and triggers automatic re-evaluation.', { tone: 'success' }), signal('formFill', 'Valid email', 'The submitted order email was deliverable.', { tone: 'success' }), signal('interactionLevel', 'High', 'Completed checkout and reviewed order details.', { tone: 'success' })], { costUsd: 3.1, converted: true }),
];

const trustedJourney: Visit[] = [
  visit('trust-1', 'Sep 02 · 11:24', 'paid', '/pricing', 'fp-maya-22', [signal('interactionLevel', 'High', 'Scrolled, compared plans, and opened FAQ.', { tone: 'success' }), signal('vpnProxy', 'VPN detected', 'VPN challenge triggered a manual review.', { tone: 'warning' })], { costUsd: 4.2 }),
  visit('trust-2', 'Sep 03 · 11:51', 'direct', '/contact', 'fp-maya-22', [signal('formFill', 'Valid email', 'Form submission was deliverable.', { tone: 'success' }), signal('interactionLevel', 'High', 'Completed a contact form after a deliberate journey.', { tone: 'success' })]),
  visit('trust-3', 'Sep 03 · 12:08', 'referral', '/thank-you', 'fp-maya-22', [signal('conversion', 'Demo booked', 'A confirmed demo request resolved the challenge.', { tone: 'success' }), signal('priorVisitsFlagged', 'Reviewed', 'The visitor was challenged, re-analyzed, and manually trusted.', { tone: 'brand' })], { referrer: 'Partner network' }),
];

const firstTimer: Visit[] = [visit('first-1', 'Sep 13 · 08:34', 'paid', '/features', 'fp-new-001', [signal('interactionLevel', 'Not enough evidence yet', 'One visit is not a verdict. ClickGuard is waiting for interactions and clicks.', { tone: 'brand' }), signal('adCreativeHit', 'Demand gen / Q3', 'Creative attribution remains auditable.')], { costUsd: 3.4 })];

const baseVisitor = (overrides: Partial<Visitor> & Pick<Visitor, 'id' | 'ip' | 'visits' | 'firstSeen' | 'lastSeen' | 'lastUpdated'>): Visitor => ({ status: 'monitoring', risk: 28, paidClicks: overrides.visits.filter((item) => item.channel === 'paid').length, geo: baseGeo, isp: 'Comcast Cable', leadSignal: 'Awaiting more interactions', exclusion: { platform: 'none', reason: 'No exclusion action taken.' }, ...overrides });

const generated: Visitor[] = Array.from({ length: 39 }, (_, index) => {
  const paid = index % 4 !== 0;
  const channel = paid ? 'paid' : index % 2 === 0 ? 'organic' : 'direct';
  const day = String(Math.max(1, 13 - (index % 12))).padStart(2, '0');
  const page = index % 3 === 0 ? '/pricing' : index % 3 === 1 ? '/features' : '/blog/ppc-benchmarks';
  const visits = Array.from({ length: (index % 5) + 1 }, (_, visitIndex) => visit(`gen-${index + 1}-${visitIndex + 1}`, `Sep ${day} · ${String(8 + (visitIndex % 9)).padStart(2, '0')}:${String((12 + index + visitIndex * 11) % 60).padStart(2, '0')}`, visitIndex === 0 ? channel : visitIndex % 3 === 0 ? 'organic' : 'direct', page, `fp-generic-${index}`, [signal('interactionLevel', visitIndex === 0 ? 'Awaiting clicks' : 'Medium', 'Normal interaction is a positive signal; ClickGuard continues watching the journey.', { tone: 'brand' }), signal('sessionDepth', visitIndex + 1, 'Pages viewed in this session.'), ...(visitIndex === 0 ? [signal('adCreativeHit', index % 2 ? 'Search / competitor' : 'Retargeting / spring', 'Creative attribution remains auditable.')] : [])], paid && visitIndex === 0 ? { costUsd: 2.8 + (index % 4) * 0.4 } : {}));
  const status = index % 9 === 0 ? 'whitelisted' : index % 7 === 0 ? 'excluded' : 'monitoring';
  const risk = status === 'excluded' ? 74 + (index % 20) : status === 'whitelisted' ? 12 : 18 + (index % 50);
  return baseVisitor({ id: `visitor-${index + 1}`, ip: `198.51.100.${index + 10}`, visits, firstSeen: `Sep ${day}, 2026`, lastSeen: `Sep ${day}, 2026`, lastUpdated: `Sep ${String(Math.min(13, Number(day) + 1)).padStart(2, '0')}, 2026`, status, risk, geo: { country: index % 3 === 0 ? 'United States' : index % 3 === 1 ? 'Canada' : 'United Kingdom', region: index % 3 === 0 ? 'California' : index % 3 === 1 ? 'Ontario' : 'England', city: index % 3 === 0 ? 'Los Angeles' : index % 3 === 1 ? 'Toronto' : 'London' }, isp: index % 2 ? 'AT&T Services' : 'Comcast Cable', leadSignal: status === 'excluded' ? 'Repeat clicks · low interaction' : status === 'whitelisted' ? 'Conversion validated' : visitIndexLead(visits), exclusion: status === 'excluded' ? { platform: index % 2 ? 'meta_ads' : 'google_ads', addedAt: `Sep ${day}, 2026`, reason: 'Cumulative signals crossed the exclusion threshold.' } : { platform: 'none', reason: 'No exclusion action taken.' } });
});

function visitIndexLead(visits: Visit[]) { return visits[0]?.signals[0]?.value === 'Awaiting clicks' ? 'Awaiting interactions / clicks' : 'Normal browsing pattern'; }

export const mockTraffic: Visitor[] = [
  baseVisitor({ id: 'visitor-blocked', ip: '203.0.113.72', status: 'excluded', risk: 99, visits: blockedJourney, firstSeen: 'Sep 12, 2026', lastSeen: 'Sep 12, 2026', lastUpdated: 'Sep 12, 2026 · 05:09', geo: { country: 'United States', region: 'Virginia', city: 'Ashburn' }, isp: 'DigitalOcean', leadSignal: '14 visits · machine-like cadence · datacenter IP', exclusion: { platform: 'google_ads', addedAt: 'Sep 12, 2026 · 05:09', reason: 'Cumulative bot pattern confirmed across 14 visits.' } }),
  baseVisitor({ id: 'visitor-ambiguous', ip: '198.51.100.44', status: 'monitoring', attention: true, risk: 64, visits: ambiguousJourney, firstSeen: 'Aug 22, 2026', lastSeen: 'Sep 12, 2026', lastUpdated: 'Sep 12, 2026 · 10:51', geo: { country: 'United States', region: 'New York', city: 'Brooklyn' }, isp: 'Verizon Business', leadSignal: 'VPN on 2 visits · pricing-only return pattern', exclusion: { platform: 'none', reason: 'Under review; no exclusion action taken.' } }),
  baseVisitor({ id: 'visitor-converted', ip: '203.0.113.19', status: 'monitoring', risk: 22, visits: convertedJourney, firstSeen: 'Sep 09, 2026', lastSeen: 'Sep 09, 2026', lastUpdated: 'Sep 09, 2026 · 02:20', geo: { country: 'United States', region: 'Texas', city: 'Austin' }, isp: 'Google Fiber', leadSignal: 'Purchase validated · auto-cleared', exclusion: { platform: 'none', removedAt: 'Sep 09, 2026 · 02:20', reason: 'Automatically unblocked after confirmed conversion.' } }),
  baseVisitor({ id: 'visitor-first-timer', ip: '192.0.2.91', status: 'monitoring', risk: 8, subState: 'awaiting interactions/clicks', visits: firstTimer, firstSeen: 'Sep 13, 2026', lastSeen: 'Sep 13, 2026', lastUpdated: 'Sep 13, 2026 · 08:34', geo: { country: 'United States', region: 'Illinois', city: 'Chicago' }, isp: 'Google Fiber', leadSignal: 'Awaiting interactions / clicks', exclusion: { platform: 'none', reason: 'First visit; monitoring quietly.' } }),
  baseVisitor({ id: 'visitor-trusted', ip: '198.51.100.8', status: 'whitelisted', risk: 10, visits: trustedJourney, firstSeen: 'Sep 02, 2026', lastSeen: 'Sep 03, 2026', lastUpdated: 'Sep 03, 2026 · 12:08', geo: { country: 'United States', region: 'Washington', city: 'Seattle' }, isp: 'T-Mobile USA', leadSignal: 'Conversion validated · manually trusted', exclusion: { platform: 'none', removedAt: 'Sep 03, 2026 · 12:08', reason: 'Challenged, re-analyzed, and unblocked after a valid demo request.' } }),
  ...generated,
];

export const excludedSpend = mockTraffic.filter((visitor) => visitor.status === 'excluded').reduce((total, visitor) => total + visitor.visits.reduce((sum, item) => sum + (item.channel === 'paid' ? item.costUsd ?? 0 : 0), 0), 0);
