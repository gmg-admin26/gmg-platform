import { useMemo, useState } from 'react';
import { auditRoster, NEBULA_INTEGRATION_MAP } from '../data/dataQuality';
import type { ArtistDataAudit } from '../data/dataQuality';
import type { DataFieldGroup } from '../data/schema';

const GROUP_LABELS: Record<DataFieldGroup, string> = {
  identity:  'Identity',
  streaming: 'Streaming',
  social:    'Social',
  contact:   'Contact',
  financial: 'Financial',
  release:   'Release',
  campaign:  'Campaign',
  internal:  'Internal',
};

const STATUS_STYLES = {
  present:        { dot: '#10B981', label: 'Present',        bg: 'rgba(16,185,129,0.1)', text: '#10B981' },
  missing:        { dot: '#EF4444', label: 'Missing',        bg: 'rgba(239,68,68,0.1)',  text: '#EF4444' },
  pending_nebula: { dot: '#F59E0B', label: 'Pending Nebula', bg: 'rgba(245,158,11,0.1)', text: '#F59E0B' },
  stale:          { dot: '#6B7280', label: 'Stale',          bg: 'rgba(107,114,128,0.1)',text: '#6B7280' },
  needs_review:   { dot: '#06B6D4', label: 'Needs Review',   bg: 'rgba(6,182,212,0.1)',  text: '#06B6D4' },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, width: 28, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

function ArtistAuditRow({ audit, onClick, selected }: {
  audit: ArtistDataAudit;
  onClick: () => void;
  selected: boolean;
}) {
  const score = audit.dataQualityScore;
  const scoreColor = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        marginBottom: 4,
        cursor: 'pointer',
        background: selected ? 'rgba(16,185,129,0.08)' : 'transparent',
        border: `1px solid ${selected ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB' }}>{audit.artistName}</span>
          <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 8 }}>{audit.artistId}</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor }}>{score}</span>
      </div>
      <ScoreBar score={score} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {audit.missingCount > 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontWeight: 600 }}>
            {audit.missingCount} missing
          </span>
        )}
        {audit.pendingNebulaCount > 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontWeight: 600 }}>
            {audit.pendingNebulaCount} nebula
          </span>
        )}
        {audit.missingRequired.length > 0 && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,68,68,0.2)', color: '#EF4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.4)' }}>
            {audit.missingRequired.length} required
          </span>
        )}
      </div>
    </div>
  );
}

export default function DataQualityAudit() {
  const audit = useMemo(() => auditRoster(), []);
  const [selectedId, setSelectedId] = useState<string | null>(audit.artists[0]?.artistId ?? null);
  const [filterGroup, setFilterGroup] = useState<DataFieldGroup | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'missing' | 'pending_nebula'>('all');
  const [tab, setTab] = useState<'roster' | 'nebula' | 'summary'>('summary');

  const selected = useMemo(
    () => audit.artists.find(a => a.artistId === selectedId) ?? null,
    [audit, selectedId]
  );

  const filteredFields = useMemo(() => {
    if (!selected) return [];
    return selected.fields.filter(f => {
      if (filterGroup !== 'all' && f.group !== filterGroup) return false;
      if (filterStatus !== 'all' && f.status !== filterStatus) return false;
      return true;
    });
  }, [selected, filterGroup, filterStatus]);

  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', background: '#0A0A0F', color: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase' }}>
            Data Quality Audit
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB', margin: 0 }}>
          Artist OS — System Data Layer
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
          Roster audit · Missing field analysis · Nebula integration map
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Artists',          value: audit.totalArtists,              color: '#F9FAFB' },
          { label: 'Avg Quality Score',       value: `${audit.averageQualityScore}%`, color: audit.averageQualityScore >= 60 ? '#10B981' : '#F59E0B' },
          { label: 'High Quality (70+)',      value: audit.highQuality,               color: '#10B981' },
          { label: 'Medium Quality (40–69)',  value: audit.mediumQuality,             color: '#F59E0B' },
          { label: 'Low Quality (<40)',       value: audit.lowQuality,                color: '#EF4444' },
          { label: 'Missing Required Fields', value: audit.artistsWithMissingRequired, color: '#EF4444' },
        ].map(card => (
          <div key={card.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
        {(['summary', 'roster', 'nebula'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #10B981' : '2px solid transparent',
              color: tab === t ? '#10B981' : '#6B7280',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s ease',
              marginBottom: -1,
            }}
          >
            {t === 'nebula' ? 'Nebula Integration Map' : t === 'roster' ? 'Per-Artist Audit' : 'Field Coverage'}
          </button>
        ))}
      </div>

      {/* Summary tab */}
      {tab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Missing fields leaderboard */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 16, marginTop: 0 }}>
              Fields Missing Most Across Roster
            </h3>
            {audit.fieldsMissingMost.map(f => (
              <div key={f.fieldLabel} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: '#F9FAFB' }}>{f.fieldLabel}</span>
                    {f.nebulaSource && (
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontWeight: 700 }}>NEBULA</span>
                    )}
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{
                      width: `${(f.missingCount / audit.totalArtists) * 100}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: f.nebulaSource ? '#F59E0B' : '#EF4444',
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: f.nebulaSource ? '#F59E0B' : '#EF4444', width: 28, textAlign: 'right' }}>
                  {f.missingCount}
                </span>
              </div>
            ))}
          </div>

          {/* Tier breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 16, marginTop: 0 }}>
              Quality Score by Tier
            </h3>
            {Object.entries(audit.byTier).map(([tier, data]) => (
              <div key={tier} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#D1D5DB' }}>{tier}</span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{data.count} artists</span>
                </div>
                <ScoreBar score={data.avgScore} />
              </div>
            ))}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>Global Counters</div>
              {[
                { label: 'Total missing fields',   val: audit.totalMissingFields,   color: '#EF4444' },
                { label: 'Pending Nebula sync',     val: audit.totalPendingNebula,   color: '#F59E0B' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Per-artist audit tab */}
      {tab === 'roster' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          {/* Artist list */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, overflowY: 'auto', maxHeight: 600 }}>
            {audit.artists
              .slice()
              .sort((a, b) => a.dataQualityScore - b.dataQualityScore)
              .map(a => (
                <ArtistAuditRow
                  key={a.artistId}
                  audit={a}
                  onClick={() => setSelectedId(a.artistId)}
                  selected={a.artistId === selectedId}
                />
              ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F9FAFB', margin: 0 }}>{selected.artistName}</h2>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{selected.tier} · {selected.status}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: selected.dataQualityScore >= 70 ? '#10B981' : selected.dataQualityScore >= 40 ? '#F59E0B' : '#EF4444' }}>
                    {selected.dataQualityScore}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>Quality Score</div>
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <select
                  value={filterGroup}
                  onChange={e => setFilterGroup(e.target.value as DataFieldGroup | 'all')}
                  style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', borderRadius: 6, fontSize: 12 }}
                >
                  <option value="all">All Groups</option>
                  {(Object.keys(GROUP_LABELS) as DataFieldGroup[]).map(g => (
                    <option key={g} value={g}>{GROUP_LABELS[g]}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
                  style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#D1D5DB', borderRadius: 6, fontSize: 12 }}
                >
                  <option value="all">All Statuses</option>
                  <option value="missing">Missing Only</option>
                  <option value="pending_nebula">Pending Nebula</option>
                </select>
              </div>

              {/* Missing required */}
              {selected.missingRequired.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>REQUIRED FIELDS MISSING</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.missingRequired.map(f => (
                      <span key={f} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Field table */}
              <div style={{ overflowY: 'auto', maxHeight: 380 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Field', 'Group', 'Status', 'Source', 'Weight'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFields.map(f => {
                      const s = STATUS_STYLES[f.status];
                      return (
                        <tr key={f.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '7px 10px', fontSize: 12, color: '#D1D5DB' }}>
                            {f.label}
                            {f.required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
                          </td>
                          <td style={{ padding: '7px 10px', fontSize: 11, color: '#9CA3AF' }}>{GROUP_LABELS[f.group]}</td>
                          <td style={{ padding: '7px 10px' }}>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.text, fontWeight: 600 }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '7px 10px' }}>
                            {f.nebulaSource ? (
                              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontWeight: 700 }}>NEBULA</span>
                            ) : (
                              <span style={{ fontSize: 10, color: '#6B7280' }}>Manual</span>
                            )}
                          </td>
                          <td style={{ padding: '7px 10px', fontSize: 12, color: '#6B7280' }}>{f.weight}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nebula integration map tab */}
      {tab === 'nebula' && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(245,158,11,0.04)' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#F59E0B', fontWeight: 700, marginBottom: 4 }}>NEBULA INTEGRATION MAP</div>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
              These fields are sourced from the Nebula data platform. Until Nebula is connected, they display "Pending sync"
              and are derived locally where possible.
            </p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Field', 'Group', 'Nebula Endpoint', 'Sync Frequency', 'Priority', 'Missing Across Roster', 'Notes'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: '#6B7280', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEBULA_INTEGRATION_MAP.map(f => {
                const priorityColor = { critical: '#EF4444', high: '#F59E0B', medium: '#06B6D4', low: '#10B981' }[f.priority];
                return (
                  <tr key={f.field} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: '#F9FAFB', fontWeight: 600 }}>{f.label}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#9CA3AF' }}>{GROUP_LABELS[f.group]}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: 11, color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '2px 6px', borderRadius: 4 }}>{f.nebulaEndpoint}</code>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#D1D5DB' }}>{f.syncFrequency}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: `${priorityColor}18`, color: priorityColor, fontWeight: 700, textTransform: 'uppercase' }}>
                        {f.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(() => {
                        const auditEntry = audit.nebulaFields.find(nf => nf.key === f.field);
                        const count = auditEntry?.missingAcrossRoster ?? 0;
                        const pct = Math.round((count / audit.totalArtists) * 100);
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: count > 0 ? '#F59E0B' : '#10B981', width: 28 }}>{count}</span>
                            <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: count > 0 ? '#F59E0B' : '#10B981', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 10, color: '#6B7280' }}>{pct}%</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#6B7280', maxWidth: 200 }}>{f.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
