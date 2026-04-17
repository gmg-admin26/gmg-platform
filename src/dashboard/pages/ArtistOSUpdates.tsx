import { useState, useMemo } from 'react';
import { Bell, Send, Mail, MessageSquare, Check, X, ChevronDown, ChevronUp, Users, Tag, Layers } from 'lucide-react';
import { useRole } from '../../auth/RoleContext';
import {
  SYSTEM_UPDATES,
  PRIORITY_META,
  CHANNEL_META,
  DELIVERY_STATUS_META,
  getUpdatesForRole,
  type UpdatePriority,
  type NotificationChannel,
  type SystemUpdate,
  type DeliveryRecord,
} from '../data/updatesData';
import { SIGNED_ARTISTS } from '../data/artistRosterData';
import { ROLE_PERMISSIONS } from '../../auth/roles';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

function fmtTime(ts?: string) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const SCOPE_LABELS: Record<string, string> = {
  full_roster: 'Full Roster',
  by_artist: 'By Artist',
  by_label: 'By Label',
  selected_artists: 'Selected Artists',
  internal_team: 'Internal Team',
};

interface ComposeState {
  title: string;
  body: string;
  scope: string;
  priority: UpdatePriority;
  channels: NotificationChannel[];
  targetArtistIds: string[];
  targetLabelId: string;
}

const BLANK_COMPOSE: ComposeState = {
  title: '', body: '', scope: 'full_roster', priority: 'normal',
  channels: ['in_app'], targetArtistIds: [], targetLabelId: '',
};

let mockIdCtr = 100;
function makeId() { return `UPD-NEW-${++mockIdCtr}`; }

export default function ArtistOSUpdates() {
  const { roleState } = useRole();
  const role = roleState.role ?? 'artist_manager';
  const perms = ROLE_PERMISSIONS[role];

  const [filterPriority, setFilterPriority] = useState<UpdatePriority | 'all'>('all');
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | 'all'>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compose, setCompose] = useState<ComposeState>(BLANK_COMPOSE);
  const [updates, setUpdates] = useState<SystemUpdate[]>(SYSTEM_UPDATES);
  const [sentFlash, setSentFlash] = useState<string | null>(null);

  const visibleUpdates = useMemo(() => {
    return getUpdatesForRole(role, roleState.user?.artistIds)
      .filter(u => updates.find(x => x.id === u.id) ?? u)
      .map(u => updates.find(x => x.id === u.id) ?? u)
      .filter(u => filterPriority === 'all' || u.priority === filterPriority)
      .filter(u => filterChannel === 'all' || u.channels.includes(filterChannel));
  }, [updates, role, roleState.user?.artistIds, filterPriority, filterChannel]);

  const unreadCount = visibleUpdates.filter(u => {
    const inApp = u.deliveries?.find(d => d.channel === 'in_app');
    return !inApp || inApp.status !== 'read';
  }).length;

  function toggleChannel(ch: NotificationChannel) {
    setCompose(p => ({
      ...p,
      channels: p.channels.includes(ch) ? p.channels.filter(c => c !== ch) : [...p.channels, ch],
    }));
  }

  function toggleArtist(id: string) {
    setCompose(p => ({
      ...p,
      targetArtistIds: p.targetArtistIds.includes(id)
        ? p.targetArtistIds.filter(x => x !== id)
        : [...p.targetArtistIds, id],
    }));
  }

  function markRead(updateId: string) {
    setUpdates(prev => prev.map(u => {
      if (u.id !== updateId) return u;
      const existing = u.deliveries ?? [];
      const hasInApp = existing.some(d => d.channel === 'in_app');
      const now = new Date().toISOString();
      const newDeliveries: DeliveryRecord[] = hasInApp
        ? existing.map(d => d.channel === 'in_app' ? { ...d, status: 'read', readAt: now } : d)
        : [...existing, { channel: 'in_app', status: 'read', sentAt: now, deliveredAt: now, readAt: now }];
      return { ...u, deliveries: newDeliveries };
    }));
  }

  function publishBroadcast() {
    if (!compose.title || !compose.body || compose.channels.length === 0) return;
    const now = new Date().toISOString();
    const deliveries: DeliveryRecord[] = compose.channels.map(ch => ({
      channel: ch,
      status: ch === 'sms' ? 'sent' : 'delivered',
      sentAt: now,
      deliveredAt: ch !== 'sms' ? now : undefined,
    }));
    const newUpdate: SystemUpdate = {
      id: makeId(),
      title: compose.title,
      body: compose.body,
      priority: compose.priority,
      scope: compose.scope as SystemUpdate['scope'],
      targetArtistIds: compose.scope === 'by_artist' ? compose.targetArtistIds : undefined,
      author: 'Admin',
      authorRole: 'admin_team',
      createdAt: now,
      publishedAt: now,
      status: 'published',
      visibleToRoles: ['admin_team', 'artist_manager'],
      channels: compose.channels,
      deliveries,
    };
    setUpdates(prev => [newUpdate, ...prev]);
    setSentFlash(newUpdate.id);
    setTimeout(() => setSentFlash(null), 3000);
    setCompose(BLANK_COMPOSE);
    setShowCompose(false);
  }

  function getDeliverySummary(update: SystemUpdate) {
    const deliveries = update.deliveries ?? [];
    const sent = deliveries.filter(d => ['sent', 'delivered', 'read'].includes(d.status)).length;
    const delivered = deliveries.filter(d => ['delivered', 'read'].includes(d.status)).length;
    const read = deliveries.filter(d => d.status === 'read').length;
    return { sent, delivered, read, total: deliveries.length };
  }

  return (
    <div className="p-5 space-y-5 min-h-full bg-[#08090B]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#06B6D4]" />
          <h1 className="text-[18px] font-bold text-white tracking-tight">Updates</h1>
          <span className="text-[10px] font-mono text-white/25 ml-1">
            {role === 'admin_team' ? 'All System Updates' : 'Your Updates'}
          </span>
          {unreadCount > 0 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-[#0D0E11] border border-white/[0.07] rounded-lg p-0.5">
            {(['all', 'urgent', 'high', 'normal', 'low'] as const).map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                className={`text-[9px] font-mono px-2.5 py-1 rounded-md transition-all capitalize ${filterPriority === p ? 'bg-white/[0.08] text-white/70' : 'text-white/25 hover:text-white/45'}`}>
                {p}
              </button>
            ))}
          </div>
          {/* Channel filter */}
          <div className="flex items-center gap-1 bg-[#0D0E11] border border-white/[0.07] rounded-lg p-0.5">
            {(['all', 'in_app', 'email', 'sms'] as const).map(c => (
              <button key={c} onClick={() => setFilterChannel(c)}
                className={`text-[9px] font-mono px-2 py-1 rounded-md transition-all capitalize ${filterChannel === c ? 'bg-white/[0.08] text-white/70' : 'text-white/25 hover:text-white/45'}`}>
                {c === 'all' ? 'All' : c === 'in_app' ? 'In-App' : c.toUpperCase()}
              </button>
            ))}
          </div>
          {perms.canBroadcastUpdates && (
            <button
              onClick={() => setShowCompose(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-[#F59E0B] text-[10px] font-semibold hover:bg-[#F59E0B]/20 transition-all"
            >
              <Send className="w-3 h-3" />
              Broadcast
            </button>
          )}
        </div>
      </div>

      {/* Compose Panel */}
      {perms.canBroadcastUpdates && showCompose && (
        <div className="bg-[#0D0E11] border border-[#F59E0B]/15 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-[#F59E0B]/60 uppercase tracking-wider">New Broadcast</p>
            <button onClick={() => setShowCompose(false)}><X className="w-3.5 h-3.5 text-white/25 hover:text-white/50" /></button>
          </div>

          {/* Row 1: scope + priority + title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Recipient Scope</p>
              <select value={compose.scope} onChange={e => setCompose(p => ({ ...p, scope: e.target.value, targetArtistIds: [] }))}
                className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/60 outline-none">
                <option value="full_roster">Full Roster</option>
                <option value="by_artist">By Artist</option>
                <option value="by_label">By Label</option>
                <option value="internal_team">Internal Team Only</option>
              </select>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Priority</p>
              <select value={compose.priority} onChange={e => setCompose(p => ({ ...p, priority: e.target.value as UpdatePriority }))}
                className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/60 outline-none">
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Title</p>
              <input value={compose.title} onChange={e => setCompose(p => ({ ...p, title: e.target.value }))}
                placeholder="Update title..."
                className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-3 py-2 text-[11px] text-white/60 outline-none placeholder:text-white/20 focus:border-[#F59E0B]/30" />
            </div>
          </div>

          {/* Artist picker (only when by_artist) */}
          {compose.scope === 'by_artist' && (
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Select Artists
              </p>
              <div className="flex flex-wrap gap-2">
                {SIGNED_ARTISTS.map(a => (
                  <button key={a.id}
                    onClick={() => toggleArtist(a.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all ${
                      compose.targetArtistIds.includes(a.id)
                        ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'border-white/[0.07] text-white/30 hover:text-white/50 hover:border-white/[0.12]'
                    }`}>
                    {compose.targetArtistIds.includes(a.id) && <Check className="w-2.5 h-2.5" />}
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Message</p>
            <textarea value={compose.body} onChange={e => setCompose(p => ({ ...p, body: e.target.value }))}
              placeholder="Write your update message..."
              rows={3}
              className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-3 py-3 text-[12px] text-white/60 outline-none resize-none placeholder:text-white/20 focus:border-[#F59E0B]/30" />
          </div>

          {/* Channels */}
          <div>
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-2">Notification Channels</p>
            <div className="flex items-center gap-3">
              {(['in_app', 'email', 'sms'] as const).map(ch => {
                const m = CHANNEL_META[ch];
                const on = compose.channels.includes(ch);
                const Icon = ch === 'in_app' ? Bell : ch === 'email' ? Mail : MessageSquare;
                return (
                  <button key={ch} onClick={() => toggleChannel(ch)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-mono transition-all ${
                      on ? 'border-opacity-40 bg-opacity-10 font-semibold' : 'border-white/[0.07] text-white/30 hover:text-white/50'
                    }`}
                    style={on ? { borderColor: `${m.color}50`, backgroundColor: `${m.color}12`, color: m.color } : {}}>
                    <Icon className="w-3 h-3" />
                    {m.label}
                    {ch === 'sms' && <span className="text-[7px] font-mono opacity-60 ml-0.5">(placeholder)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button onClick={() => { setCompose(BLANK_COMPOSE); setShowCompose(false); }}
              className="px-4 py-2 rounded-lg text-[11px] text-white/30 hover:text-white/50 transition-colors">
              Cancel
            </button>
            <button onClick={publishBroadcast}
              disabled={!compose.title || !compose.body || compose.channels.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-semibold hover:bg-[#F59E0B]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-3 h-3" />
              Publish Update
            </button>
          </div>
        </div>
      )}

      {/* Updates list */}
      <div className="space-y-3">
        {visibleUpdates.length === 0 && (
          <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl p-10 text-center">
            <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-[13px] text-white/30">No updates in this category</p>
          </div>
        )}

        {visibleUpdates.map(update => {
          const pm = PRIORITY_META[update.priority];
          const targetArtists = update.targetArtistIds
            ? SIGNED_ARTISTS.filter(a => update.targetArtistIds!.includes(a.id))
            : [];
          const inAppDelivery = update.deliveries?.find(d => d.channel === 'in_app');
          const isRead = inAppDelivery?.status === 'read';
          const isExpanded = expandedId === update.id;
          const delivSummary = getDeliverySummary(update);
          const isNew = sentFlash === update.id;

          return (
            <div key={update.id}
              className={`bg-[#0D0E11] border rounded-xl overflow-hidden transition-all ${
                isNew ? 'border-[#F59E0B]/40' : isRead ? 'border-white/[0.06]' : 'border-white/[0.10]'
              }`}>

              {/* Main row */}
              <div
                className={`p-5 cursor-pointer hover:bg-white/[0.015] transition-colors ${!isRead ? 'border-l-2' : ''}`}
                style={!isRead ? { borderLeftColor: pm.color } : {}}
                onClick={() => setExpandedId(isExpanded ? null : update.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">

                    {/* Unread dot */}
                    {!isRead && (
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: pm.color }} />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${pm.bg} ${pm.border}`}
                          style={{ color: pm.color }}>
                          {pm.label}
                        </span>
                        <p className={`text-[14px] font-semibold truncate ${isRead ? 'text-white/55' : 'text-white/90'}`}>
                          {update.title}
                        </p>
                      </div>

                      <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2">{update.body}</p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="text-[9px] font-mono text-white/25">{update.author}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[9px] font-mono text-white/20">{timeAgo(update.createdAt)}</span>
                        <span className="text-white/10">·</span>
                        <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]">
                          <Layers className="w-2.5 h-2.5" />
                          {SCOPE_LABELS[update.scope] ?? update.scope}
                        </span>

                        {/* Channel badges */}
                        {update.channels.map(ch => {
                          const cm = CHANNEL_META[ch];
                          const Icon = ch === 'in_app' ? Bell : ch === 'email' ? Mail : MessageSquare;
                          const delivery = update.deliveries?.find(d => d.channel === ch);
                          const ds = delivery ? DELIVERY_STATUS_META[delivery.status] : null;
                          return (
                            <span key={ch} className="flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded border"
                              style={{ color: ds?.color ?? cm.color, borderColor: `${ds?.color ?? cm.color}30`, background: `${ds?.color ?? cm.color}10` }}>
                              <Icon className="w-2.5 h-2.5" />
                              {cm.label}
                              {ds && <span className="opacity-70">· {ds.label}</span>}
                            </span>
                          );
                        })}

                        {/* Artist tags */}
                        {targetArtists.map(a => (
                          <span key={a.id} className="text-[8px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1"
                            style={{ color: a.avatarColor, background: `${a.avatarColor}12`, borderColor: `${a.avatarColor}25` }}>
                            <Tag className="w-2 h-2" />
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: delivery stats + expand */}
                  <div className="flex items-center gap-3 shrink-0">
                    {perms.canBroadcastUpdates && update.deliveries && update.deliveries.length > 0 && (
                      <div className="hidden sm:flex items-center gap-3 text-right">
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-white/50">{delivSummary.sent}</p>
                          <p className="text-[7px] font-mono text-white/20 uppercase">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-[#06B6D4]">{delivSummary.delivered}</p>
                          <p className="text-[7px] font-mono text-white/20 uppercase">Dlvrd</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-[#10B981]">{delivSummary.read}</p>
                          <p className="text-[7px] font-mono text-white/20 uppercase">Read</p>
                        </div>
                      </div>
                    )}
                    <button className="text-white/20 hover:text-white/50 transition-colors ml-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded delivery detail */}
              {isExpanded && (
                <div className="border-t border-white/[0.05] px-5 py-4 bg-black/20 space-y-4">

                  {/* Full message */}
                  <div>
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Full Message</p>
                    <p className="text-[12px] text-white/55 leading-relaxed">{update.body}</p>
                  </div>

                  {/* Delivery breakdown */}
                  {update.deliveries && update.deliveries.length > 0 && (
                    <div>
                      <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-2">Delivery Status</p>
                      <div className="space-y-2">
                        {update.deliveries.map((d, i) => {
                          const cm = CHANNEL_META[d.channel];
                          const ds = DELIVERY_STATUS_META[d.status];
                          const Icon = d.channel === 'in_app' ? Bell : d.channel === 'email' ? Mail : MessageSquare;
                          return (
                            <div key={i} className="flex items-center gap-4 bg-black/20 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 w-20 shrink-0">
                                <Icon className="w-3 h-3" style={{ color: cm.color }} />
                                <span className="text-[10px] font-mono" style={{ color: cm.color }}>{cm.label}</span>
                              </div>
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border w-20 shrink-0"
                                style={{ borderColor: `${ds.color}30`, background: `${ds.color}10` }}>
                                <div className="w-1 h-1 rounded-full" style={{ background: ds.color }} />
                                <span className="text-[9px] font-mono" style={{ color: ds.color }}>{ds.label}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[9px] font-mono text-white/25">
                                {d.sentAt && <span>Sent {fmtTime(d.sentAt)}</span>}
                                {d.deliveredAt && <span>· Delivered {fmtTime(d.deliveredAt)}</span>}
                                {d.readAt && <span>· Read {fmtTime(d.readAt)}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mark as read / actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/20">
                      <span>Published {update.publishedAt ? new Date(update.publishedAt).toLocaleDateString() : '—'}</span>
                      <span>·</span>
                      <span>{update.author} · {update.authorRole.replace(/_/g, ' ')}</span>
                    </div>
                    {!isRead && (
                      <button
                        onClick={e => { e.stopPropagation(); markRead(update.id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#10B981]/25 bg-[#10B981]/10 text-[#10B981] text-[9px] font-mono hover:bg-[#10B981]/15 transition-colors">
                        <Check className="w-3 h-3" /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
