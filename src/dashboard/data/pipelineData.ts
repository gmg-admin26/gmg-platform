export type PipelineStage =
  | 'Surfaced'
  | 'Under Review'
  | 'Outreach Sent'
  | 'Awaiting Reply'
  | 'Escalated to A&R'
  | 'Meeting Requested'
  | 'Meeting Scheduled'
  | 'Agreement Ready'
  | 'Agreement Sent'
  | 'Contract In Progress'
  | 'Signed'
  | 'Closed / Passed';

export type Recommendation = 'SIGN' | 'WATCH' | 'PASS';

export interface TimelineEvent {
  ts: string;
  type: 'scout' | 'outreach' | 'slack' | 'calendar' | 'pandadoc' | 'ops' | 'system' | 'human';
  actor: string;
  text: string;
  meta?: string;
  color: string;
}

export interface PipelineOpportunity {
  id: string;
  artistName: string;
  market: string;
  genre: string;
  stage: PipelineStage;
  confidence: number;
  aiScouts: string[];
  humanCoSigns: string[];
  assignedScout: string;
  assignedHuman: string;
  contactReadiness: 'Hot' | 'Warm' | 'Cold';
  contactPoint: string;
  recommendation: Recommendation;
  velocityScore: number;
  monthlyListeners: number;
  labelStatus: string;
  nextAction: string;
  discoveredAgo: string;
  opportunityWindow: string;
  signedDate?: string;
  agreementType?: string;
  meetingDate?: string;
  escalationReason?: string;
  opsStatus?: string;
  dealReadinessScore: number;
  timeline: TimelineEvent[];
}

export const PIPELINE_OPPORTUNITIES: PipelineOpportunity[] = [
  {
    id: 'PO-001',
    artistName: 'Zaylevelten',
    market: 'Lagos, Nigeria',
    genre: 'Afro-fusion / Alté Rap',
    stage: 'Signed',
    confidence: 94,
    aiScouts: ['Paragon', 'Nova', 'Prism', 'Flare', 'Rift'],
    humanCoSigns: ['Randy Jackson', 'Paula Moore', 'Latie'],
    assignedScout: 'Paragon',
    assignedHuman: 'Paula Moore',
    contactReadiness: 'Hot',
    contactPoint: 'Via management — direct email confirmed',
    recommendation: 'SIGN',
    velocityScore: 97,
    monthlyListeners: 724000,
    labelStatus: 'Unsigned / Independent',
    nextAction: 'Onboarding initiated',
    discoveredAgo: '14 days ago',
    opportunityWindow: 'Closed — signed',
    signedDate: 'Apr 8, 2026',
    agreementType: 'Standard distribution + catalog',
    dealReadinessScore: 100,
    timeline: [
      { ts: 'Mar 26, 2026 · 9:14 AM', type: 'scout', actor: 'Paragon', text: 'Artist surfaced — Zaylevelten velocity spike +2,071% following Fresh Finds Africa. Unsigned.', color: '#EF4444' },
      { ts: 'Mar 26, 2026 · 9:19 AM', type: 'scout', actor: 'Prism', text: 'Co-signed. Lagos signal confirmed. Afro-fusion trajectory highly favorable.', color: '#F59E0B' },
      { ts: 'Mar 26, 2026 · 9:34 AM', type: 'scout', actor: 'Flare', text: 'Co-signed. ATL / Africa crossover potential elevated. Immediate action recommended.', color: '#F59E0B' },
      { ts: 'Mar 26, 2026 · 10:00 AM', type: 'scout', actor: 'Rift', text: 'Co-signed. NY market signal confirmed. Diaspora demand growing.', color: '#F59E0B' },
      { ts: 'Mar 26, 2026 · 10:22 AM', type: 'outreach', actor: 'Paragon', text: 'Initial outreach sent. Instagram DM drafted and sent to artist. Email to known management contact.', meta: 'Outreach route: Instagram DM + email', color: '#06B6D4' },
      { ts: 'Mar 27, 2026 · 2:11 PM', type: 'outreach', actor: 'Paragon', text: 'Artist management replied. Interest confirmed. Requesting executive intro.', color: '#10B981' },
      { ts: 'Mar 27, 2026 · 2:45 PM', type: 'slack', actor: 'Paragon', text: 'Escalated to Paula Moore via Slack — #ar-priority channel. Management responsive. Needs executive follow-up.', meta: 'Channel: #ar-priority', color: '#8B5CF6' },
      { ts: 'Mar 28, 2026 · 11:00 AM', type: 'human', actor: 'Paula Moore', text: 'Reviewed dossier. Confirmed high priority. Requesting meeting with management.', color: '#EC4899' },
      { ts: 'Mar 29, 2026 · 9:00 AM', type: 'calendar', actor: 'Paragon', text: 'Meeting coordination initiated. Proposed slots sent to management via Google Calendar. Invited: Paula Moore, Randy Jackson.', meta: 'Google Calendar · Internal + External invite', color: '#34D399' },
      { ts: 'Mar 30, 2026 · 3:00 PM', type: 'calendar', actor: 'System', text: 'Meeting confirmed. Apr 2, 2026 at 2:00 PM EST. Attendees: Paula Moore, Randy Jackson, Zaylevelten management.', meta: 'Scheduled · Apr 2, 2026 2:00 PM EST', color: '#10B981' },
      { ts: 'Apr 2, 2026 · 4:15 PM', type: 'human', actor: 'Paula Moore', text: 'Meeting completed. Strong alignment. Terms discussed. Proceed to agreement.', color: '#EC4899' },
      { ts: 'Apr 3, 2026 · 10:00 AM', type: 'pandadoc', actor: 'Paragon', text: 'Standard distribution + catalog agreement generated. Sent via PandaDoc to management.', meta: 'PandaDoc · Sent to: management@zaylevelten.com', color: '#F59E0B' },
      { ts: 'Apr 4, 2026 · 1:22 PM', type: 'pandadoc', actor: 'System', text: 'Agreement viewed by recipient. 3 views total. Signature pending.', meta: 'PandaDoc · Status: Viewed', color: '#F59E0B' },
      { ts: 'Apr 5, 2026 · 11:00 AM', type: 'ops', actor: 'Operations AI', text: 'Monitoring handed to Operations AI. Tracking signature process. Follow-up scheduled if no response in 48h.', color: '#06B6D4' },
      { ts: 'Apr 7, 2026 · 9:00 AM', type: 'ops', actor: 'Operations AI', text: 'Follow-up reminder sent. Contract confirmation call scheduled.', color: '#06B6D4' },
      { ts: 'Apr 8, 2026 · 10:30 AM', type: 'pandadoc', actor: 'System', text: 'Signed contract received. All parties executed. Document archived.', meta: 'PandaDoc · Status: Fully Executed', color: '#10B981' },
      { ts: 'Apr 8, 2026 · 10:45 AM', type: 'ops', actor: 'Operations AI', text: 'Ops confirmed. Zaylevelten added to signed roster. Weekly signings updated.', color: '#10B981' },
    ],
  },
  {
    id: 'PO-002',
    artistName: 'Lamb',
    market: 'Venice Beach, CA',
    genre: 'Jersey Club-Indie / Electronic Pop',
    stage: 'Meeting Scheduled',
    confidence: 85,
    aiScouts: ['Paragon', 'Nova', 'Rift'],
    humanCoSigns: ['Randy Jackson', 'Latie'],
    assignedScout: 'Paragon',
    assignedHuman: 'Randy Jackson',
    contactReadiness: 'Hot',
    contactPoint: 'Direct artist — TikTok confirmed response',
    recommendation: 'SIGN',
    velocityScore: 88,
    monthlyListeners: 186000,
    labelStatus: 'Unsigned / Independent',
    nextAction: 'Meeting Apr 14, 2026 — prepare offer terms',
    discoveredAgo: '8 days ago',
    opportunityWindow: '14-day window',
    meetingDate: 'Apr 14, 2026',
    escalationReason: 'Drake, SZA, Russ co-signs — label competition risk imminent',
    dealReadinessScore: 91,
    timeline: [
      { ts: 'Apr 3, 2026 · 8:00 AM', type: 'scout', actor: 'Paragon', text: 'Artist surfaced — Lamb. Pre-viral candidate. Drake, SZA, Russ co-signs detected. Unsigned.', color: '#EF4444' },
      { ts: 'Apr 3, 2026 · 8:15 AM', type: 'scout', actor: 'Nova', text: 'Co-signed. LA buzz accelerating. TikTok engagement cluster detected.', color: '#F59E0B' },
      { ts: 'Apr 3, 2026 · 8:40 AM', type: 'scout', actor: 'Rift', text: 'Co-signed. NY streaming signal building. Pre-viral window open now.', color: '#F59E0B' },
      { ts: 'Apr 3, 2026 · 9:00 AM', type: 'outreach', actor: 'Paragon', text: 'Initial outreach sent via TikTok DM and email in bio. Subject: A&R Introduction — GMG.', meta: 'Outreach route: TikTok DM + email', color: '#06B6D4' },
      { ts: 'Apr 4, 2026 · 11:30 AM', type: 'outreach', actor: 'Paragon', text: 'Artist replied via TikTok DM. Open to conversation. Requesting more info.', color: '#10B981' },
      { ts: 'Apr 4, 2026 · 12:00 PM', type: 'slack', actor: 'Paragon', text: 'Escalated to Randy Jackson via Slack. Label competition risk flagged — at least 2 major labels identified as circling.', meta: 'Channel: #ar-priority · Reason: Label competition risk', color: '#8B5CF6' },
      { ts: 'Apr 5, 2026 · 10:00 AM', type: 'human', actor: 'Randy Jackson', text: 'Reviewed. Confirmed top priority. Meeting requested immediately.', color: '#EC4899' },
      { ts: 'Apr 5, 2026 · 2:00 PM', type: 'calendar', actor: 'Paragon', text: 'Meeting coordination initiated via Google Calendar. Invited: Randy Jackson, Latie. Artist and manager invited.', meta: 'Google Calendar · Scheduling in progress', color: '#34D399' },
      { ts: 'Apr 6, 2026 · 9:00 AM', type: 'calendar', actor: 'System', text: 'Meeting confirmed. Apr 14, 2026 at 1:00 PM PST. Attendees: Randy Jackson, Latie, Lamb + manager.', meta: 'Scheduled · Apr 14, 2026 1:00 PM PST', color: '#10B981' },
    ],
  },
  {
    id: 'PO-003',
    artistName: 'Ayra Jae',
    market: 'Accra, Ghana',
    genre: 'Afrobeats / Contemporary R&B',
    stage: 'Agreement Sent',
    confidence: 88,
    aiScouts: ['Paragon', 'Prism', 'Flare'],
    humanCoSigns: ['Latie'],
    assignedScout: 'Prism',
    assignedHuman: 'Latie',
    contactReadiness: 'Warm',
    contactPoint: 'Via management — WhatsApp confirmed',
    recommendation: 'SIGN',
    velocityScore: 82,
    monthlyListeners: 540000,
    labelStatus: 'Unsigned / Independent',
    nextAction: 'Operations AI monitoring signature. Follow-up scheduled.',
    discoveredAgo: '12 days ago',
    opportunityWindow: '45-day window',
    agreementType: 'Standard distribution agreement',
    opsStatus: 'Monitoring',
    dealReadinessScore: 86,
    timeline: [
      { ts: 'Mar 30, 2026 · 7:00 AM', type: 'scout', actor: 'Paragon', text: 'Surfaced — Ayra Jae. Ghana. +1,100% streaming in 90 days. UK and Canada diaspora signal building.', color: '#EF4444' },
      { ts: 'Mar 30, 2026 · 7:20 AM', type: 'scout', actor: 'Prism', text: 'Co-signed. Lagos/Accra signal strong. Diaspora pipeline confirmed.', color: '#F59E0B' },
      { ts: 'Mar 30, 2026 · 8:00 AM', type: 'outreach', actor: 'Prism', text: 'Initial WhatsApp outreach sent to management contact. Email follow-up sent.', meta: 'Outreach: WhatsApp + email', color: '#06B6D4' },
      { ts: 'Apr 1, 2026 · 3:00 PM', type: 'outreach', actor: 'Prism', text: 'Management replied. Interested. Requesting executive intro call.', color: '#10B981' },
      { ts: 'Apr 1, 2026 · 4:00 PM', type: 'slack', actor: 'Prism', text: 'Escalated to Latie via Slack. Management responsive. Intro call needed.', meta: 'Channel: #ar-global · Escalation: Latie', color: '#8B5CF6' },
      { ts: 'Apr 2, 2026 · 10:00 AM', type: 'calendar', actor: 'Paragon', text: 'Video call scheduled. Apr 4, 2026 at 10:00 AM GMT. Latie + management confirmed.', meta: 'Google Calendar · Apr 4, 2026', color: '#34D399' },
      { ts: 'Apr 4, 2026 · 11:00 AM', type: 'human', actor: 'Latie', text: 'Call completed. Strong alignment. Artist excited about opportunity. Proceed to standard agreement.', color: '#EC4899' },
      { ts: 'Apr 5, 2026 · 9:00 AM', type: 'pandadoc', actor: 'Prism', text: 'Standard distribution agreement sent via PandaDoc to management.', meta: 'PandaDoc · Sent: management@ayrajae.com', color: '#F59E0B' },
      { ts: 'Apr 5, 2026 · 2:44 PM', type: 'pandadoc', actor: 'System', text: 'Agreement viewed. 2 views recorded. Signature pending.', meta: 'PandaDoc · Status: Viewed', color: '#F59E0B' },
      { ts: 'Apr 6, 2026 · 8:00 AM', type: 'ops', actor: 'Operations AI', text: 'Monitoring handed to Operations AI. Tracking signature progress. Follow-up queued for 48h.', color: '#06B6D4' },
    ],
  },
  {
    id: 'PO-004',
    artistName: 'Mon Rovia',
    market: 'Liberia / USA',
    genre: 'Afro-Appalachian Folk / Indie',
    stage: 'Escalated to A&R',
    confidence: 91,
    aiScouts: ['Paragon', 'Nexus', 'Nova'],
    humanCoSigns: ['Randy Jackson', 'Paula Moore'],
    assignedScout: 'Nexus',
    assignedHuman: 'Paula Moore',
    contactReadiness: 'Warm',
    contactPoint: 'Nettwerk A&R — deal monitoring',
    recommendation: 'WATCH',
    velocityScore: 79,
    monthlyListeners: 2400000,
    labelStatus: 'Nettwerk (exclusive license)',
    nextAction: 'Await Q3 contract status. Paula Moore monitoring label relationship.',
    discoveredAgo: '18 days ago',
    opportunityWindow: 'Monitor Q3 contract',
    escalationReason: 'Active Nettwerk deal — escalated for executive relationship building and pre-emptive outreach strategy',
    dealReadinessScore: 74,
    timeline: [
      { ts: 'Mar 23, 2026 · 10:00 AM', type: 'scout', actor: 'Paragon', text: 'Surfaced — Mon Rovia. 2.4M monthly listeners. Indie folk with viral momentum. Nettwerk exclusive license.', color: '#EF4444' },
      { ts: 'Mar 23, 2026 · 10:30 AM', type: 'scout', actor: 'Nexus', text: 'Co-signed. Nashville signal strong. Sync inquiries increasing. Artist is actively touring.', color: '#F59E0B' },
      { ts: 'Mar 23, 2026 · 11:00 AM', type: 'outreach', actor: 'Nexus', text: 'Initial outreach to Nettwerk A&R contact initiated. Email sent to track licensing terms.', meta: 'Outreach: Nettwerk A&R contact', color: '#06B6D4' },
      { ts: 'Mar 24, 2026 · 2:00 PM', type: 'slack', actor: 'Nexus', text: 'Escalated to Paula Moore via Slack. Nettwerk deal has expiry risk in Q3. Executive relationship needed.', meta: 'Channel: #ar-priority · Assigned: Paula Moore', color: '#8B5CF6' },
      { ts: 'Mar 25, 2026 · 9:00 AM', type: 'human', actor: 'Paula Moore', text: 'Acknowledged. Initiated executive relationship with Nettwerk. Monitoring Q3 contract renewal window.', color: '#EC4899' },
    ],
  },
  {
    id: 'PO-005',
    artistName: 'Mako Sol',
    market: 'Atlanta, GA',
    genre: 'Afrobeats / R&B',
    stage: 'Outreach Sent',
    confidence: 89,
    aiScouts: ['Paragon', 'Flare', 'Rift', 'Nova'],
    humanCoSigns: ['Latie', 'Paula Moore'],
    assignedScout: 'Flare',
    assignedHuman: 'Latie',
    contactReadiness: 'Hot',
    contactPoint: 'Artist management — email confirmed',
    recommendation: 'SIGN',
    velocityScore: 91,
    monthlyListeners: 1640000,
    labelStatus: 'Indie deal expiring Q3',
    nextAction: 'Awaiting management reply. Follow-up queued in 48h.',
    discoveredAgo: '3 weeks ago',
    opportunityWindow: 'Q3 contract expiry',
    dealReadinessScore: 82,
    timeline: [
      { ts: 'Mar 20, 2026 · 8:00 AM', type: 'scout', actor: 'Paragon', text: 'Surfaced — Mako Sol. ATL. +180% streaming MoM. Three editorial playlists. Indie deal expires Q3.', color: '#EF4444' },
      { ts: 'Mar 20, 2026 · 8:30 AM', type: 'scout', actor: 'Flare', text: 'Co-signed. ATL signal confirmed. Actively shopping. Multiple labels showing interest.', color: '#F59E0B' },
      { ts: 'Mar 21, 2026 · 10:00 AM', type: 'outreach', actor: 'Flare', text: 'Outreach sent to artist management via email. Subject: Partnership Discussion — GMG.', meta: 'Email sent · Awaiting reply', color: '#06B6D4' },
      { ts: 'Mar 23, 2026 · 10:00 AM', type: 'outreach', actor: 'Flare', text: 'No response after 48h. Follow-up reminder sent. Management contact confirmed active.', meta: 'Follow-up: +48h', color: '#F59E0B' },
    ],
  },
  {
    id: 'PO-006',
    artistName: 'Lila Daye',
    market: 'Houston, TX',
    genre: 'Alt-R&B / Bedroom Soul',
    stage: 'Under Review',
    confidence: 79,
    aiScouts: ['Paragon', 'Nova'],
    humanCoSigns: [],
    assignedScout: 'Nova',
    assignedHuman: 'Latie',
    contactReadiness: 'Warm',
    contactPoint: 'Direct artist — Instagram / SubmitHub',
    recommendation: 'WATCH',
    velocityScore: 71,
    monthlyListeners: 188000,
    labelStatus: 'Unsigned / Independent',
    nextAction: 'Paragon completing full dossier. Human review pending.',
    discoveredAgo: '5 days ago',
    opportunityWindow: 'Window open',
    dealReadinessScore: 58,
    timeline: [
      { ts: 'Apr 6, 2026 · 7:00 AM', type: 'scout', actor: 'Paragon', text: 'Surfaced — Lila Daye. Houston. +640% in 60 days. Spotify Fresh Finds add. Unsigned.', color: '#EF4444' },
      { ts: 'Apr 6, 2026 · 7:30 AM', type: 'scout', actor: 'Nova', text: 'Co-signed. West Coast potential. Bedroom soul trajectory strong for editorial.', color: '#F59E0B' },
      { ts: 'Apr 7, 2026 · 9:00 AM', type: 'system', actor: 'System', text: 'Full intelligence dossier initiated. Paragon compiling artist profile.', color: '#06B6D4' },
    ],
  },
  {
    id: 'PO-007',
    artistName: 'Sung Holly',
    market: 'Dallas, TX',
    genre: 'Bedroom Pop / Singer-Songwriter',
    stage: 'Surfaced',
    confidence: 68,
    aiScouts: ['Paragon'],
    humanCoSigns: [],
    assignedScout: 'Paragon',
    assignedHuman: '—',
    contactReadiness: 'Cold',
    contactPoint: 'YouTube — email in description',
    recommendation: 'WATCH',
    velocityScore: 58,
    monthlyListeners: 22000,
    labelStatus: 'Unsigned / Independent',
    nextAction: 'Monitor for next release catalyst. No action required yet.',
    discoveredAgo: '1 week ago',
    opportunityWindow: 'Early watch — 90 days',
    dealReadinessScore: 38,
    timeline: [
      { ts: 'Apr 4, 2026 · 6:00 AM', type: 'scout', actor: 'Paragon', text: 'Surfaced — Sung Holly. Dallas. Consistent YouTube growth. Strong songwriting. Not viral yet.', color: '#EF4444' },
      { ts: 'Apr 4, 2026 · 6:05 AM', type: 'system', actor: 'System', text: 'Opportunity added to watch list. Monitoring for release catalyst.', color: '#06B6D4' },
    ],
  },
];

export const STAGE_ORDER: PipelineStage[] = [
  'Surfaced',
  'Under Review',
  'Outreach Sent',
  'Awaiting Reply',
  'Escalated to A&R',
  'Meeting Requested',
  'Meeting Scheduled',
  'Agreement Ready',
  'Agreement Sent',
  'Contract In Progress',
  'Signed',
  'Closed / Passed',
];

export const STAGE_CONFIG: Record<PipelineStage, { color: string; bg: string; border: string; dot: string }> = {
  'Surfaced':             { color: '#6B7280', bg: 'bg-white/[0.04]',        border: 'border-white/[0.08]',    dot: '#6B7280' },
  'Under Review':         { color: '#06B6D4', bg: 'bg-[#06B6D4]/[0.06]',   border: 'border-[#06B6D4]/15',   dot: '#06B6D4' },
  'Outreach Sent':        { color: '#3B82F6', bg: 'bg-[#3B82F6]/[0.06]',   border: 'border-[#3B82F6]/15',   dot: '#3B82F6' },
  'Awaiting Reply':       { color: '#8B5CF6', bg: 'bg-[#8B5CF6]/[0.06]',   border: 'border-[#8B5CF6]/15',   dot: '#8B5CF6' },
  'Escalated to A&R':     { color: '#F59E0B', bg: 'bg-[#F59E0B]/[0.07]',   border: 'border-[#F59E0B]/20',   dot: '#F59E0B' },
  'Meeting Requested':    { color: '#F59E0B', bg: 'bg-[#F59E0B]/[0.07]',   border: 'border-[#F59E0B]/20',   dot: '#F59E0B' },
  'Meeting Scheduled':    { color: '#34D399', bg: 'bg-[#34D399]/[0.07]',   border: 'border-[#34D399]/20',   dot: '#34D399' },
  'Agreement Ready':      { color: '#EC4899', bg: 'bg-[#EC4899]/[0.06]',   border: 'border-[#EC4899]/15',   dot: '#EC4899' },
  'Agreement Sent':       { color: '#EC4899', bg: 'bg-[#EC4899]/[0.07]',   border: 'border-[#EC4899]/20',   dot: '#EC4899' },
  'Contract In Progress': { color: '#EF4444', bg: 'bg-[#EF4444]/[0.07]',   border: 'border-[#EF4444]/20',   dot: '#EF4444' },
  'Signed':               { color: '#10B981', bg: 'bg-[#10B981]/[0.08]',   border: 'border-[#10B981]/25',   dot: '#10B981' },
  'Closed / Passed':      { color: '#374151', bg: 'bg-white/[0.025]',      border: 'border-white/[0.05]',   dot: '#374151' },
};

export const PIPELINE_STATS = {
  outreachToday: 3,
  escalationsPending: 2,
  meetingsScheduled: 1,
  agreementsSent: 1,
  awaitingSignature: 1,
  signedThisWeek: 1,
};
