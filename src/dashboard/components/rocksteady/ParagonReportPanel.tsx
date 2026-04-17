import { useState } from 'react';
import { X, FileText, TrendingUp, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface ReportArtist {
  name: string;
  genre: string;
  monthlyListeners: string;
  labelStatus: string;
  arScore: number;
  location: string;
  note?: string;
}

const DAILY_REPORT_ARTISTS: ReportArtist[] = [
  { name: 'Zaylevelten',   genre: 'Afro-fusion / Alté Rap', monthlyListeners: '724K (+2,071%)', labelStatus: 'Unsigned',           arScore: 87, location: 'Nigeria',       note: 'TOP PICK — Immediate action recommended' },
  { name: 'Mon Rovia',     genre: 'Indie Folk',              monthlyListeners: '2.4M',           labelStatus: 'Unsigned',           arScore: 82, location: 'USA / Liberia', note: 'Touring, viral momentum' },
  { name: 'Gigi Perez',    genre: 'Pop',                     monthlyListeners: '6.2M (1B total)', labelStatus: 'Indie / Available',  arScore: 91, location: 'Global',        note: 'Pipeline benchmark — 1B streams confirmed' },
  { name: 'Lamb',          genre: 'Jersey Club / Pop',       monthlyListeners: '100K+',          labelStatus: 'Unsigned',           arScore: 79, location: 'Los Angeles',   note: 'Drake, SZA, Russ co-signs' },
  { name: 'Sung Holly',    genre: 'Bedroom Pop',             monthlyListeners: '48K',            labelStatus: 'Unsigned',           arScore: 72, location: 'Dallas, TX',    note: 'YouTube growth, developing' },
  { name: '2hollis',       genre: 'Alternative',             monthlyListeners: '240K',           labelStatus: 'Indie',              arScore: 68, location: 'Global',        note: 'TikTok-to-chart pipeline' },
  { name: 'Bella Kay',     genre: 'Pop',                     monthlyListeners: '180K',           labelStatus: 'Indie',              arScore: 65, location: 'Global',        note: 'TikTok pipeline validation' },
  { name: 'Makaio Huizar', genre: 'Pop',                     monthlyListeners: '22K',            labelStatus: 'Unsigned',           arScore: 63, location: 'Arizona',       note: 'Pre-EP, watch for release' },
];

const LA_ARCHETYPE_ARTISTS: ReportArtist[] = [
  { name: 'Nessa Barrett', genre: 'Pop / Alt',    monthlyListeners: '380K', labelStatus: 'Unsigned — High Priority', arScore: 88, location: 'Los Angeles', note: 'Multiple breakout indicators active' },
  { name: 'Anneth',        genre: 'Pop',          monthlyListeners: '290K', labelStatus: 'Unsigned (US)',            arScore: 86, location: 'Los Angeles', note: 'International crossover potential' },
  { name: 'Chloe Tang',    genre: 'Pop',          monthlyListeners: '95K',  labelStatus: 'Unsigned',                 arScore: 84, location: 'Los Angeles', note: 'TikTok 2.8M — accelerating' },
  { name: 'Maya Chen',     genre: 'Producer/Pop', monthlyListeners: '55K',  labelStatus: 'Unsigned',                 arScore: 83, location: 'Los Angeles', note: 'Producer, rising profile' },
];

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? '#EF4444' : score >= 75 ? '#F59E0B' : '#06B6D4';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '52px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color, minWidth: '24px' }}>{score}</span>
    </div>
  );
}

function ArtistRow({ artist, index }: { artist: ReportArtist; index: number }) {
  const isTopPick = artist.arScore >= 85;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '20px 1fr 80px 120px 90px 70px',
      gap: '12px',
      padding: '10px 16px',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: isTopPick ? 'rgba(239,68,68,0.02)' : 'transparent',
    }}>
      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: index === 0 ? '#EF4444' : index < 3 ? '#F59E0B' : 'rgba(255,255,255,0.2)', fontWeight: 700 }}>
        {index + 1}
      </span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{artist.name}</span>
          {index === 0 && <Star style={{ width: '10px', height: '10px', color: '#F59E0B', fill: '#F59E0B', flexShrink: 0 }} />}
        </div>
        {artist.note && (
          <span style={{ fontSize: '9.5px', color: isTopPick ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>
            {artist.note}
          </span>
        )}
      </div>
      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>{artist.genre}</span>
      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{artist.monthlyListeners}</span>
      <span style={{
        fontSize: '8.5px',
        fontFamily: 'monospace',
        padding: '2px 6px',
        borderRadius: '4px',
        background: artist.labelStatus === 'Unsigned' || artist.labelStatus.includes('Unsigned') ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${artist.labelStatus === 'Unsigned' || artist.labelStatus.includes('Unsigned') ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
        color: artist.labelStatus === 'Unsigned' || artist.labelStatus.includes('Unsigned') ? 'rgba(16,185,129,0.8)' : 'rgba(255,255,255,0.35)',
      }}>
        {artist.labelStatus}
      </span>
      <ScoreBar score={artist.arScore} />
    </div>
  );
}

export function ParagonReportPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'daily' | 'la'>('daily');
  const [laExpanded, setLaExpanded] = useState(true);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '88vh',
          background: '#0A0B0F',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#080910', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText style={{ width: '13px', height: '13px', color: '#EF4444' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Paragon Daily Report</h2>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Generated by Paragon A&R Scout</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>Daily Trending Artists — April 9, 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(239,68,68,0.6)', padding: '2px 8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                  LIVE INTELLIGENCE
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '14px' }}>
            {([['daily', 'Daily Trending Report'], ['la', 'Paragon Archetype Intelligence']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  border: `1px solid ${activeTab === key ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  background: activeTab === key ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: activeTab === key ? '#EF4444' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'daily' ? (
            <div>
              {/* Top Pick Feature */}
              <div style={{ margin: '16px', padding: '18px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Star style={{ width: '12px', height: '12px', color: '#EF4444', fill: '#EF4444' }} />
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(239,68,68,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Top Pick of the Day</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>Zaylevelten</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>Afro-fusion / Alté Rap</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin style={{ width: '9px', height: '9px', color: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Nigeria</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: '10px' }}>
                      Fastest-growing unsigned Afro-fusion act with +2,071% Spotify growth after Fresh Finds Africa placement.
                      Audience is 86% age 18–29 with expanding international reach.
                    </p>
                    <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '7px' }}>
                      <p style={{ fontSize: '9.5px', fontFamily: 'monospace', color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '3px' }}>Recommended Action</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Initiate contact immediately. 30-day window before major label engagement.</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', flexShrink: 0 }}>
                    <p style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>A&R Score</p>
                    <p style={{ fontSize: '36px', fontWeight: 700, color: '#EF4444', lineHeight: 1 }}>87</p>
                    <TrendingUp style={{ width: '14px', height: '14px', color: 'rgba(239,68,68,0.5)', margin: '4px auto 0' }} />
                  </div>
                </div>
              </div>

              {/* Artist table */}
              <div style={{ margin: '0 16px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 80px 120px 90px 70px', gap: '12px', padding: '8px 16px', marginBottom: '2px' }}>
                  {['#', 'Artist', 'Genre', 'Monthly', 'Label Status', 'Score'].map(h => (
                    <span key={h} style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</span>
                  ))}
                </div>
                <div style={{ background: '#0D0E14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                  {DAILY_REPORT_ARTISTS.map((artist, i) => (
                    <ArtistRow key={artist.name} artist={artist} index={i} />
                  ))}
                </div>
                <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.15)', marginTop: '10px', textAlign: 'right' }}>
                  Reported by Paragon A&R Scout · April 9, 2026
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setLaExpanded(p => !p)}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>LA Emerging Talent — Archetype Scan</p>
                    <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Los Angeles market · Paragon archetype pattern matching active</p>
                  </div>
                  {laExpanded
                    ? <ChevronUp style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.3)' }} />
                    : <ChevronDown style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.3)' }} />
                  }
                </div>

                {laExpanded && (
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '14px' }}>
                      Paragon archetype intelligence scan identified 4 unsigned LA-based artists matching
                      high-conversion breakout patterns. Priority ranking based on score, label status, and momentum signals.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 80px 120px 90px 70px', gap: '12px', padding: '6px 14px', marginBottom: '4px' }}>
                      {['#', 'Artist', 'Genre', 'Monthly', 'Label Status', 'Score'].map(h => (
                        <span key={h} style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</span>
                      ))}
                    </div>
                    <div style={{ background: '#0D0E14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                      {LA_ARCHETYPE_ARTISTS.map((artist, i) => (
                        <ArtistRow key={artist.name} artist={artist} index={i} />
                      ))}
                    </div>

                    <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '9.5px', fontFamily: 'monospace', color: 'rgba(245,158,11,0.6)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px' }}>Intelligence Note</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                        All four artists match Paragon archetype models for rapid breakout. Nessa Barrett is flagged as highest priority — unsigned, multiple velocity indicators active simultaneously.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.15)', textAlign: 'right' }}>
                Paragon Archetype Intelligence · April 9, 2026
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
