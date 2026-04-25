import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserMinus, Clock, CheckCircle, ShieldOff, ArrowUpRight,
  RefreshCw, AlertTriangle, Music, MoreHorizontal,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useCatalogClient } from '../../context/CatalogClientContext';
import {
  fetchCatalogDroppedQueue,
  reinstateClient,
  initCatalogDropState,
  type CatalogLifecycleEvent,
} from '../../data/catalogDropService';
import { ALL_CATALOG_CLIENTS, type CatalogClientRow } from './COSRoster';

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function ExitSteps() {
  const steps = [
    { label: 'Initiated',  done: true },
    { label: 'Contracts',  done: false },
    { label: 'Financials', done: false },
    { label: 'Complete',   done: false },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '2px 6px', borderRadius: 4,
            background: s.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.done ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            {s.done
              ? <CheckCircle size={8} color="#10B981" />
              : <Clock size={8} color="rgba(255,255,255,0.2)" />
            }
            <span style={{ fontSize: 8, fontFamily: 'monospace', color: s.done ? '#10B981' : 'rgba(255,255,255,0.2)' }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 8, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function DroppedCard({
  record,
  client,
  onViewProfile,
  onReinstate,
}: {
  record: CatalogLifecycleEvent;
  client: CatalogClientRow | undefined;
  onViewProfile: (id: string) => void;
  onReinstate: (id: string, name: string) => void;
}) {
  const [reinstating, setReinstating] = useState(false);

  async function handleReinstate() {
    setReinstating(true);
    onReinstate(record.client_id, record.client_name);
    setReinstating(false);
  }

  return (
    <div style={{
      background: '#0B0D10',
      border: '1px solid rgba(239,68,68,0.15)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.4),transparent)' }} />

      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserMinus size={16} color="#EF4444" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.75)' }}>{record.client_name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '2px 5px', borderRadius: 3, color: '#EF4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)' }}>DROPPED</span>
              </div>
              {client && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                  {client.genre} · {client.releases} releases · {client.streams} streams
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => onViewProfile(record.client_id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                color: '#F59E0B', fontSize: 11, fontWeight: 600,
              }}
            >
              <ShieldOff size={11} /> Locked Profile
            </button>
            <button
              onClick={handleReinstate}
              disabled={reinstating}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 8, cursor: reinstating ? 'wait' : 'pointer',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                color: '#10B981', fontSize: 11, fontWeight: 600,
                opacity: reinstating ? 0.7 : 1,
              }}
            >
              {reinstating
                ? <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Reinstating...</>
                : <><RefreshCw size={11} /> Reinstate</>
              }
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            <Clock size={10} />
            <span>Dropped {fmtDate(record.initiated_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            <ShieldOff size={10} />
            <span>By {record.initiated_by}</span>
          </div>
          {client && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                <Music size={10} />
                <span>{client.catalogValue} catalog value</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                <AlertTriangle size={10} />
                <span>Client since {client.clientSince}</span>
              </div>
            </>
          )}
        </div>

        {record.notes && (
          <div style={{ marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>REASON: </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{record.notes}</span>
          </div>
        )}

        <ExitSteps />
      </div>
    </div>
  );
}

export default function COSDroppedQueue() {
  const navigate = useNavigate();
  const { activeClient, switchClient } = useCatalogClient();

  const [dropped, setDropped] = useState<CatalogLifecycleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    await initCatalogDropState();
    const items = await fetchCatalogDroppedQueue();
    setDropped(items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleViewProfile(clientId: string) {
    switchClient(clientId);
    navigate('/catalog/app/overview');
  }

  const handleReinstate = useCallback(async (clientId: string, _name: string) => {
    await reinstateClient(clientId, 'Admin');
    setDropped(prev => prev.filter(r => r.client_id !== clientId));
  }, []);

  return (
    <div className="min-h-screen bg-[#07080A]">
      <CatalogPageHeader
        icon={UserMinus}
        title="Dropped Queue"
        subtitle="Exited catalog clients · reinstatement controls · admin only"
        accentColor="#EF4444"
        badge="ADMIN"
      />

      <div style={{ padding: '20px 18px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 18px', textAlign: 'center' as const }}>
            <RefreshCw size={20} color="rgba(255,255,255,0.2)" style={{ animation: 'spin 1s linear infinite', marginBottom: 10 }} />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Loading dropped queue...</div>
          </div>
        ) : dropped.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 18px', textAlign: 'center' as const }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <CheckCircle size={20} color="#10B981" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No Dropped Clients</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>All catalog clients are currently active.</div>
            <button
              onClick={() => navigate('/catalog/app/roster')}
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontSize: 11, fontWeight: 600 }}
            >
              <ArrowUpRight size={11} /> Back to Roster
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                {dropped.length} dropped client{dropped.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={load}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                >
                  <RefreshCw size={10} /> Refresh
                </button>
                <button
                  onClick={() => navigate('/catalog/app/roster')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                >
                  <ArrowUpRight size={10} /> Back to Roster
                </button>
              </div>
            </div>
            {dropped.map(record => {
              const client = ALL_CATALOG_CLIENTS.find(c => c.id === record.client_id);
              return (
                <DroppedCard
                  key={record.client_id}
                  record={record}
                  client={client}
                  onViewProfile={handleViewProfile}
                  onReinstate={handleReinstate}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
