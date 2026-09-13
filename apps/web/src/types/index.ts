export type VisitChannel = 'paid' | 'organic' | 'direct' | 'referral';
export type VisitorStatus = 'monitoring' | 'excluded' | 'whitelisted';
export type SignalId = 'ipAddress' | 'location' | 'interactionLevel' | 'botProbability' | 'vpnProxy' | 'formFill' | 'conversion' | 'deviceFingerprint' | 'clickVelocityMs' | 'temporalPattern' | 'sessionDepth' | 'ipReputation' | 'priorVisitsFlagged' | 'adCreativeHit';

export interface VisitSignal { signal: SignalId; value: string | number; note: string; diagnostic?: boolean; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'blue'; }
export interface Visit { id: string; ts: string; channel: VisitChannel; page: string; referrer?: string; costUsd?: number; deviceFingerprint: string; signals: VisitSignal[]; converted?: boolean; }
export interface ExclusionLog { platform: 'google_ads' | 'meta_ads' | 'none'; addedAt?: string; removedAt?: string; reason: string; }
export interface Visitor { id: string; ip: string; status: VisitorStatus; attention?: boolean; subState?: string; risk: number; visits: Visit[]; paidClicks: number; firstSeen: string; lastSeen: string; lastUpdated: string; geo: { country: string; region: string; city: string }; isp: string; leadSignal: string; exclusion: ExclusionLog; }
