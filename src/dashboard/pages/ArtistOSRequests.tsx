import { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Search, RefreshCw, ChevronDown, X, CheckCircle, Clock, AlertCircle, ArrowRight, User, Building2, Shield, CheckSquare, Lock } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskWidget from '../components/tasks/TaskWidget';
import { useAuth } from '../../auth/AuthContext';
import { useRole } from '../../auth/RoleContext';
import { useActiveArtist } from '../hooks/useActiveArtist';
import {
  fetchRequestsByArtistIds,
  fetchRequestsByArtistId,
  fetchRequestsByLabel,
  fetchAllRequests,
  updateRequestStatus,
  type ArtistOSRequest,
  type RequestStatus,
  REQUEST_STATUS_META,
  PRIORITY_META,
} from '../data/requestsService';
import { SIGNED_ARTISTS } from '../data/artistRosterData';
import RequestModal from '../components/artistOS/RequestModal';
import type { SignedArtist } from '../data/artistRosterData';

const STATUS_ORDER: RequestStatus[] = ['submitted', 'in_review', 'approved', 'in_progress', 'completed', 'rejected'];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const m = REQUEST_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider border ${m.bg} ${m.border}`}
      style={{ color: m.color }}>
      {m.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const m = PRIORITY_META[priority as keyof typeof PRIORITY_META];
  if (!m) return null;
  return <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: m.color }} />;
}

interface AdminStatusDropdownProps {
  request: ArtistOSRequest;
  onUpdate: (id: string, status: RequestStatus) => void;
}

function AdminStatusDropdown({ request, onUpdate }: AdminStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSelect(status: RequestStatus) {
    setOpen(false);
    setSaving(true);
    await onUpdate(request.id, status);
    setSaving(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={saving}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors text-[10px] text-white/50 disabled:opacity-40"
      >
        {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
        <span>Change Status</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-20 bg-[#0D0E11] border border-white/[0.10] rounded-xl shadow-2xl overflow-hidden min-w-[160px]">
          {STATUS_ORDER.map(s => {
            const m = REQUEST_STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={`w-full text-left px-3 py-2 text-[11px] flex items-center gap-2 hover:bg-white/[0.05] transition-colors ${request.status === s ? 'opacity-40 cursor-default' : ''}`}
                style={{ color: m.color }}
                disabled={request.status === s}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                {m.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ArtistOSRequests() {
  const { auth } = useAuth();
  const { roleState } = useRole();
  const { openSubmit } = useTasks();
  const role = roleState.role;
  const email = auth.email ?? '';
  const labelId = roleState.user?.labelId;

  const myArtistIds: string[] = roleState.user?.artistIds ?? [];

  const accessibleArtists: SignedArtist[] = SIGNED_ARTISTS.filter(a => myArtistIds.includes(a.id));

  const isArtistRole = role === 'artist_manager';
  const isAdminRole = role === 'admin_team';
  const isLabelRole = role === 'label_partner';

  // In the single-artist Artist OS view, useActiveArtist() always resolves
  // the primary (first) artist for this user. For artist_manager role this page
  // is always artist-scoped — never show the picker, always bind to activeArtist.
  const activeArtist = useActiveArtist();
  const isSingleArtist = isArtistRole && activeArtist !== null;
  const singleArtist: SignedArtist | null = isSingleArtist ? activeArtist : null;

  const [requests, setRequests] = useState<ArtistOSRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [search, setSearch] = useState('');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<SignedArtist | null>(null);
  const [artistPickerOpen, setArtistPickerOpen] = useState(false);
  const [artistSearch, setArtistSearch] = useState('');

  const filteredPickerArtists = artistSearch.trim()
    ? accessibleArtists.filter(a =>
        a.name.toLowerCase().includes(artistSearch.toLowerCase()) ||
        a.genre.toLowerCase().includes(artistSearch.toLowerCase()) ||
        a.tier.toLowerCase().includes(artistSearch.toLowerCase())
      )
    : accessibleArtists;

  const load = useCallback(async () => {
    setLoading(true);
    let data: ArtistOSRequest[] = [];

    if (isAdminRole) {
      data = await fetchAllRequests();
      if (myArtistIds.length > 0) {
        data = data.filter(r => myArtistIds.includes(r.artist_id));
      }
    } else if (isLabelRole && labelId) {
      data = await fetchRequestsByLabel(labelId);
    } else if (isArtistRole) {
      if (isSingleArtist && singleArtist) {
        data = await fetchRequestsByArtistId(singleArtist.id);
      } else if (myArtistIds.length > 0) {
        data = await fetchRequestsByArtistIds(myArtistIds);
      }
    }

    setRequests(data);
    setLoading(false);
  }, [role, labelId, myArtistIds, isAdminRole, isLabelRole, isArtistRole, isSingleArtist, singleArtist]);

  useEffect(() => { load(); }, [load]);

  function handleNewRequest() {
    if (isSingleArtist && singleArtist) {
      setSelectedArtist(singleArtist);
      setRequestModalOpen(true);
    } else if (isArtistRole && accessibleArtists.length > 1) {
      setArtistPickerOpen(true);
    } else if (isAdminRole) {
      setArtistPickerOpen(true);
    }
  }

  async function handleStatusUpdate(id: string, status: RequestStatus) {
    await updateRequestStatus(id, status);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r));
  }

  const filtered = requests.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.artist_name.toLowerCase().includes(q) && !r.request_type.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all: requests.length,
    submitted: requests.filter(r => r.status === 'submitted').length,
    in_review: requests.filter(r => r.status === 'in_review').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const roleIcon = isAdminRole ? Shield : isLabelRole ? Building2 : User;
  const RoleIcon = roleIcon;

  const canSubmitRequest = isArtistRole || isAdminRole;

  function headerSubtitle() {
    if (isAdminRole) return 'View, assign, and manage all incoming requests across the roster.';
    if (isLabelRole) return 'Track requests submitted for artists on your label roster.';
    if (isSingleArtist && singleArtist) return `Submit and track requests for ${singleArtist.name}.`;
    return 'Submit and track marketing, campaign, and support requests for your artists.';
  }

  function headerContext() {
    if (isAdminRole) return 'All Requests — Admin View';
    if (isLabelRole) return 'Label Requests — Roster View';
    if (isSingleArtist && singleArtist) return `${singleArtist.name} — Artist View`;
    return 'Requests — Manager View';
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleIcon className="w-3.5 h-3.5 text-white/25" />
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
              {headerContext()}
            </span>
            {isSingleArtist && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20">
                <Lock className="w-2.5 h-2.5 text-[#10B981]/70" />
                <span className="text-[8px] font-mono text-[#10B981]/70 uppercase tracking-wider">Artist Scoped</span>
              </span>
            )}
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Requests</h1>
          <p className="text-[12px] text-white/35 mt-0.5">{headerSubtitle()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openSubmit('artist_os')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-[12px] font-semibold hover:bg-[#10B981]/16 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Submit Task
          </button>
          {canSubmitRequest && (
            <button
              onClick={handleNewRequest}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06B6D4]/16 border border-[#06B6D4]/35 text-[#06B6D4] text-[12px] font-semibold hover:bg-[#06B6D4]/24 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Request
            </button>
          )}
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {(['submitted', 'in_review', 'in_progress', 'approved', 'completed', 'rejected'] as RequestStatus[]).map(s => {
          const m = REQUEST_STATUS_META[s];
          const n = counts[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`p-3 rounded-xl border text-left transition-all ${filterStatus === s ? '' : 'bg-white/[0.025] border-white/[0.06] hover:border-white/[0.12]'}`}
              style={filterStatus === s ? { background: `${m.color}12`, borderColor: `${m.color}30` } : {}}
            >
              <p className="text-[18px] font-bold" style={{ color: filterStatus === s ? m.color : n > 0 ? '#fff' : '#ffffff40' }}>{n}</p>
              <p className="text-[8px] font-mono uppercase tracking-wider mt-0.5" style={{ color: m.color, opacity: 0.7 }}>{m.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[12px] text-white/70 placeholder-white/20 outline-none focus:border-white/[0.15] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-white/25" />
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${
                filterPriority === p
                  ? 'bg-white/[0.10] border-white/[0.18] text-white'
                  : 'bg-white/[0.025] border-white/[0.06] text-white/35 hover:text-white/55'
              }`}
            >
              {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-[10px] text-white/40 transition-colors">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Task Widget */}
      <TaskWidget system="artist_os" accent="#10B981" maxItems={4} />

      {/* Requests list */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-5 h-5 text-white/20 animate-spin mx-auto mb-3" />
          <p className="text-[12px] text-white/25">Loading requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-[13px] font-semibold text-white/30">No requests found</p>
          <p className="text-[11px] text-white/15 mt-1">
            {requests.length === 0 ? 'No requests have been submitted yet.' : 'Try adjusting your filters.'}
          </p>
          {requests.length === 0 && canSubmitRequest && (
            <button
              onClick={handleNewRequest}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06B6D4]/14 border border-[#06B6D4]/30 text-[#06B6D4] text-[11px] font-semibold hover:bg-[#06B6D4]/22 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit First Request
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => {
            const priorityMeta = PRIORITY_META[r.priority as keyof typeof PRIORITY_META];
            return (
              <div key={r.id} className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-4 hover:border-white/[0.12] transition-all group">
                <div className="flex items-start gap-4">

                  {/* Priority indicator */}
                  <div className="mt-0.5 w-1 self-stretch rounded-full shrink-0" style={{ background: priorityMeta?.color ?? '#6B7280', opacity: 0.5 }} />

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[12px] font-semibold text-white/80">{r.request_type}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-[11px] text-white/45 font-medium">{r.artist_name}</span>
                      {r.label_id && (
                        <>
                          <span className="text-white/20">·</span>
                          <span className="text-[9px] font-mono text-white/25">{r.label_id}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 mb-2">{r.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={r.status} />
                      <span className="flex items-center gap-1 text-[9px] font-mono text-white/25">
                        <PriorityDot priority={r.priority} />
                        {r.priority} priority
                      </span>
                      {r.budget_range && (
                        <span className="text-[9px] font-mono text-white/25">{r.budget_range}</span>
                      )}
                      <span className="text-[9px] font-mono text-white/20">timeline: {r.desired_timeline}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[9px] font-mono text-white/20">{timeAgo(r.created_at)}</span>
                    <span className="text-[9px] font-mono text-white/20">{r.submitted_by_email}</span>
                    {r.assigned_to && (
                      <span className="text-[9px] font-mono text-[#10B981]/60">assigned: {r.assigned_to}</span>
                    )}
                    {isAdminRole && (
                      <AdminStatusDropdown request={r} onUpdate={handleStatusUpdate} />
                    )}
                  </div>
                </div>

                {/* Admin notes */}
                {r.admin_notes && (
                  <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-[#F59E0B]/60 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/35 leading-relaxed">{r.admin_notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/*
        Artist picker modal.
        Shown ONLY for:
          - admin_team users
          - artist_manager users with more than 1 accessible artist (manager role)
        NEVER shown for:
          - single-artist users (auto-bound at request creation)
          - label_partner users (label-scoped, no artist picker needed)
        The picker list is ALWAYS sourced from accessibleArtists (user's permitted
        artist IDs only) — never from the global SIGNED_ARTISTS list directly.
      */}
      {artistPickerOpen && !isSingleArtist && (isAdminRole || (isArtistRole && accessibleArtists.length > 1)) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) { setArtistPickerOpen(false); setArtistSearch(''); } }}
        >
          <div className="bg-[#0D0E11] border border-white/[0.10] rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ maxHeight: 'min(540px, 90vh)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
              <div>
                <h2 className="text-[14px] font-bold text-white">Select Artist</h2>
                <p className="text-[10px] text-white/30 mt-0.5">
                  {isAdminRole
                    ? 'Choose which artist this request is for'
                    : 'Choose one of your managed artists'}
                </p>
              </div>
              <button
                onClick={() => { setArtistPickerOpen(false); setArtistSearch(''); }}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            <div className="px-4 pt-3 pb-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus-within:border-[#06B6D4]/35 transition-colors">
                <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
                <input
                  autoFocus
                  value={artistSearch}
                  onChange={e => setArtistSearch(e.target.value)}
                  placeholder="Search by name, genre, or tier..."
                  className="flex-1 bg-transparent border-none outline-none text-[12px] text-white/70 placeholder-white/20"
                />
                {artistSearch && (
                  <button onClick={() => setArtistSearch('')} className="shrink-0 text-white/25 hover:text-white/55 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-[9px] font-mono text-white/20 mt-1.5 px-1">
                {filteredPickerArtists.length} of {accessibleArtists.length} artists
              </p>
            </div>

            <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-2">
              {accessibleArtists.length === 0 ? (
                <p className="text-[12px] text-white/30 py-6 text-center">No artists available.</p>
              ) : filteredPickerArtists.length === 0 ? (
                <p className="text-[12px] text-white/30 py-6 text-center">No artists match "{artistSearch}"</p>
              ) : (
                filteredPickerArtists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => {
                      setSelectedArtist(artist);
                      setArtistPickerOpen(false);
                      setArtistSearch('');
                      setRequestModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
                      style={{ background: `${artist.avatarColor}20`, borderColor: `${artist.avatarColor}35` }}>
                      <span className="text-[9px] font-bold" style={{ color: artist.avatarColor }}>{artist.avatarInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors truncate">{artist.name}</p>
                      <p className="text-[9px] text-white/30 font-mono truncate">{artist.genre.split(' · ')[0]} · {artist.tier}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request modal */}
      {requestModalOpen && selectedArtist && (
        <RequestModal
          artist={selectedArtist}
          submittedByEmail={email}
          submittedByRole={role ?? 'artist_manager'}
          labelId={labelId}
          onClose={() => { setRequestModalOpen(false); setSelectedArtist(null); }}
          onSuccess={() => { setRequestModalOpen(false); setSelectedArtist(null); load(); }}
        />
      )}
    </div>
  );
}
