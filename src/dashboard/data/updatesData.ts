import { type ArtistOSRole } from '../../auth/roles';

export type UpdatePriority = 'urgent' | 'high' | 'normal' | 'low';
export type UpdateScope = 'single_artist' | 'by_artist' | 'by_label' | 'selected_artists' | 'selected_labels' | 'full_roster' | 'internal_team';
export type UpdateStatus = 'published' | 'draft' | 'archived';
export type NotificationChannel = 'in_app' | 'email' | 'sms';
export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface DeliveryRecord {
  channel: NotificationChannel;
  status: DeliveryStatus;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface SystemUpdate {
  id: string;
  title: string;
  body: string;
  priority: UpdatePriority;
  scope: UpdateScope;
  targetArtistIds?: string[];
  targetLabelIds?: string[];
  author: string;
  authorRole: ArtistOSRole;
  createdAt: string;
  publishedAt?: string;
  status: UpdateStatus;
  visibleToRoles: ArtistOSRole[];
  channels: NotificationChannel[];
  acknowledged?: boolean;
  deliveries?: DeliveryRecord[];
}

export const SYSTEM_UPDATES: SystemUpdate[] = [
  {
    id: 'UPD-001',
    title: 'Ayra Jae — International Campaign Approved',
    body: 'The Q2 international expansion budget has been approved. $24K allocated across UK, Nigeria, and Brazil ad markets. Campaign kicks off April 14. Marketing team assigned.',
    priority: 'urgent',
    scope: 'by_artist',
    targetArtistIds: ['AOS-004'],
    author: 'Dana Reeves',
    authorRole: 'admin_team',
    createdAt: '2026-04-10T09:14:00Z',
    publishedAt: '2026-04-10T09:15:00Z',
    status: 'published',
    visibleToRoles: ['admin_team', 'artist_manager', 'label_partner'],
    channels: ['in_app', 'email'],
    deliveries: [
      { channel: 'in_app', status: 'read',      sentAt: '2026-04-10T09:15:00Z', deliveredAt: '2026-04-10T09:15:00Z', readAt: '2026-04-10T09:22:00Z' },
      { channel: 'email',  status: 'delivered', sentAt: '2026-04-10T09:15:00Z', deliveredAt: '2026-04-10T09:16:00Z' },
    ],
  },
  {
    id: 'UPD-002',
    title: 'ZEAL — Brazil Geo Budget Approved',
    body: 'Geo ad budget for Brazil approved at $3,100 for April. Targeting São Paulo and Rio metro areas. TikTok and Spotify ad placements confirmed.',
    priority: 'high',
    scope: 'by_artist',
    targetArtistIds: ['AOS-001'],
    author: 'Dana Reeves',
    authorRole: 'admin_team',
    createdAt: '2026-04-09T15:30:00Z',
    publishedAt: '2026-04-09T15:31:00Z',
    status: 'published',
    visibleToRoles: ['admin_team', 'artist_manager'],
    channels: ['in_app', 'email'],
    deliveries: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-04-09T15:31:00Z', deliveredAt: '2026-04-09T15:31:00Z' },
      { channel: 'email',  status: 'sent',      sentAt: '2026-04-09T15:31:00Z' },
    ],
  },
  {
    id: 'UPD-003',
    title: 'Q2 Roster Performance Review — Internal',
    body: 'Internal review of Q1 roster performance completed. Ayra Jae leads with +31.2% listener growth. ZEAL second at +12.4%. Sung Holly up +18.4% off small base — early signal. Mon Rovia needs manager assignment urgently.',
    priority: 'high',
    scope: 'internal_team',
    author: 'Alex Kim',
    authorRole: 'admin_team',
    createdAt: '2026-04-08T11:00:00Z',
    publishedAt: '2026-04-08T11:00:00Z',
    status: 'published',
    visibleToRoles: ['admin_team'],
    channels: ['in_app'],
    deliveries: [
      { channel: 'in_app', status: 'read', sentAt: '2026-04-08T11:00:00Z', deliveredAt: '2026-04-08T11:00:00Z', readAt: '2026-04-08T12:14:00Z' },
    ],
  },
  {
    id: 'UPD-004',
    title: 'Roster Recoupment Status — April 2026',
    body: 'Monthly recoupment report distributed. Cato Strand remains in active recoupment at 42% progress. Lila Daye tracking behind plan. Recommend reviewing ad spend allocation.',
    priority: 'normal',
    scope: 'internal_team',
    author: 'Alex Kim',
    authorRole: 'admin_team',
    createdAt: '2026-04-07T08:45:00Z',
    publishedAt: '2026-04-07T08:45:00Z',
    status: 'published',
    visibleToRoles: ['admin_team'],
    channels: ['in_app', 'email'],
    deliveries: [
      { channel: 'in_app', status: 'read',      sentAt: '2026-04-07T08:45:00Z', deliveredAt: '2026-04-07T08:45:00Z', readAt: '2026-04-07T09:10:00Z' },
      { channel: 'email',  status: 'delivered', sentAt: '2026-04-07T08:46:00Z', deliveredAt: '2026-04-07T08:47:00Z' },
    ],
  },
  {
    id: 'UPD-005',
    title: 'Mako Sol — EP Launch Timeline Confirmed',
    body: 'Debut EP launch confirmed for July 2026. Pre-save campaign to begin mid-June. Marketing strategy session scheduled with Dana for May 1.',
    priority: 'normal',
    scope: 'by_artist',
    targetArtistIds: ['AOS-002'],
    author: 'Dana Reeves',
    authorRole: 'admin_team',
    createdAt: '2026-04-06T14:20:00Z',
    publishedAt: '2026-04-06T14:20:00Z',
    status: 'published',
    visibleToRoles: ['admin_team', 'artist_manager'],
    channels: ['in_app', 'sms'],
    deliveries: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-04-06T14:20:00Z', deliveredAt: '2026-04-06T14:20:00Z' },
      { channel: 'sms',    status: 'sent',      sentAt: '2026-04-06T14:21:00Z' },
    ],
  },
  {
    id: 'UPD-006',
    title: 'Lila Daye — Vocal Production Budget Needs Approval',
    body: 'Lila Daye vocal production budget request of $4,200 submitted by Marcus Webb. Pending admin approval. Blocking Q2 single recording timeline.',
    priority: 'high',
    scope: 'internal_team',
    author: 'Marcus Webb',
    authorRole: 'admin_team',
    createdAt: '2026-04-05T16:00:00Z',
    publishedAt: '2026-04-05T16:00:00Z',
    status: 'published',
    visibleToRoles: ['admin_team'],
    channels: ['in_app', 'email'],
    deliveries: [
      { channel: 'in_app', status: 'pending' },
      { channel: 'email',  status: 'failed', sentAt: '2026-04-05T16:01:00Z' },
    ],
  },
  {
    id: 'UPD-007',
    title: 'Sung Holly — TikTok Strategy Session',
    body: 'First English-language single planned Q2. TikTok fanbase engagement strong. Ji-Yeon Park and Dana to co-develop strategy. Pre-save campaign design underway.',
    priority: 'normal',
    scope: 'by_artist',
    targetArtistIds: ['AOS-007'],
    author: 'Dana Reeves',
    authorRole: 'admin_team',
    createdAt: '2026-04-04T10:00:00Z',
    publishedAt: '2026-04-04T10:00:00Z',
    status: 'published',
    visibleToRoles: ['admin_team', 'artist_manager'],
    channels: ['in_app'],
    deliveries: [
      { channel: 'in_app', status: 'read', sentAt: '2026-04-04T10:00:00Z', deliveredAt: '2026-04-04T10:00:00Z', readAt: '2026-04-04T11:30:00Z' },
    ],
  },
  {
    id: 'UPD-008',
    title: 'Platform Infrastructure Upgrade — Nebula Data Layer v2',
    body: 'Nebula data layer integration upgraded to v2 schema. All artist financial records now syncing correctly. Team: no action required.',
    priority: 'low',
    scope: 'internal_team',
    author: 'GMG Engineering',
    authorRole: 'admin_team',
    createdAt: '2026-04-03T07:00:00Z',
    publishedAt: '2026-04-03T07:00:00Z',
    status: 'published',
    visibleToRoles: ['admin_team'],
    channels: ['in_app'],
    deliveries: [
      { channel: 'in_app', status: 'read', sentAt: '2026-04-03T07:00:00Z', deliveredAt: '2026-04-03T07:00:00Z', readAt: '2026-04-03T08:15:00Z' },
    ],
  },
];

export function getUpdatesForRole(role: ArtistOSRole, artistIds?: string[]): SystemUpdate[] {
  return SYSTEM_UPDATES.filter(u => {
    if (!u.visibleToRoles.includes(role)) return false;
    if (role === 'admin_team') return true;
    if (u.scope === 'internal_team') return false;
    if ((u.scope === 'single_artist' || u.scope === 'by_artist') && artistIds && u.targetArtistIds) {
      return u.targetArtistIds.some(id => artistIds.includes(id));
    }
    if (u.scope === 'full_roster') return true;
    return true;
  });
}

export function getUnreadCount(role: ArtistOSRole, artistIds?: string[]): number {
  return getUpdatesForRole(role, artistIds).filter(u => {
    const inApp = u.deliveries?.find(d => d.channel === 'in_app');
    return !inApp || inApp.status !== 'read';
  }).length;
}

export const PRIORITY_META: Record<UpdatePriority, { label: string; color: string; bg: string; border: string }> = {
  urgent: { label: 'Urgent', color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25' },
  high:   { label: 'High',   color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25' },
  normal: { label: 'Normal', color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25' },
  low:    { label: 'Low',    color: '#6B7280', bg: 'bg-white/[0.05]',  border: 'border-white/[0.10]' },
};

export const CHANNEL_META: Record<NotificationChannel, { label: string; color: string; icon: string }> = {
  in_app: { label: 'In-App',  color: '#06B6D4', icon: 'bell'  },
  email:  { label: 'Email',   color: '#10B981', icon: 'mail'  },
  sms:    { label: 'SMS',     color: '#F59E0B', icon: 'phone' },
};

export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: '#6B7280' },
  sent:      { label: 'Sent',      color: '#F59E0B' },
  delivered: { label: 'Delivered', color: '#06B6D4' },
  read:      { label: 'Read',      color: '#10B981' },
  failed:    { label: 'Failed',    color: '#EF4444' },
};
