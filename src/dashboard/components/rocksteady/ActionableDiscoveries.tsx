import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, ExternalLink, Music, AtSign, ChevronRight,
  CheckCircle, X, Star, Clock, Shield, Zap, MapPin, Link, Mail,
  Target,
} from 'lucide-react';

interface DiscoveryItem {
  id: string;
  name: string;
  market: string;
  genre: string;
  signalType: string;
  status: 'SIGN' | 'WATCH' | 'BREAKING';
  confidence: number;
  aiScouts: string[];
  humanCoSigns: string[];
  contactPoint: string;
  contactEmail?: string;
  socialLink: string;
  streamingLink: string;
  linktreeLink?: string;
  infoPreview: string;
  opportunityWindow: string;
  discoveredAgo: string;
  contactConfidence?: number;
  responseLikelihood?: number;
  responseRisk?: 'Low' | 'Medium' | 'High';
  dealReadinessScore?: number;
}

const DISCOVERIES: DiscoveryItem[] = [
  {
    id: 'D-002',
    name: 'Lamb',
    market: 'Venice Beach, USA',
    genre: 'Jersey Club-Indie / Electronic Pop',
    signalType: 'High-value co-sign cluster',
    status: 'SIGN',
    confidence: 91,
    aiScouts: ['Paragon', 'Nova', 'Rift'],
    humanCoSigns: ['Randy Jackson', 'Latie'],
    contactPoint: 'Management — direct email confirmed',
    contactEmail: 'unitcmanagement@gmail.com',
    socialLink: 'tiktok.com/@lamb.wav',
    streamingLink: 'open.spotify.com/artist/lamb',
    linktreeLink: 'link.me/lamb.wavv',
    infoPreview: 'Drake, SZA, Russ co-signs detected. Pre-viral window open. Management reachable / direct digital funnel active.',
    opportunityWindow: '14-day window',
    discoveredAgo: '5 days ago',
    contactConfidence: 94,
    responseLikelihood: 72,
    responseRisk: 'Low',
    dealReadinessScore: 91,
  },
  {
    id: 'D-001',
    name: 'Zaylevelten',
    market: 'Nigeria',
    genre: 'Afro-fusion / Alté Rap',
    signalType: 'Streaming velocity spike',
    status: 'SIGN',
    confidence: 94,
    aiScouts: ['Paragon', 'Nova', 'Prism', 'Flare', 'Rift'],
    humanCoSigns: ['Randy Jackson', 'Paula Moore', 'Latie'],
    contactPoint: 'Via management — Instagram DM',
    socialLink: 'instagram.com/zaylevelten',
    streamingLink: 'open.spotify.com/artist/zaylevelten',
    infoPreview: '+2,071% Spotify growth post Fresh Finds Africa placement. Unsigned. 724K monthly listeners.',
    opportunityWindow: '30-day window',
    discoveredAgo: '3 days ago',
    contactConfidence: 78,
    responseLikelihood: 65,
    responseRisk: 'Medium',
    dealReadinessScore: 100,
  },
  {
    id: 'D-003',
    name: 'Ayra Jae',
    market: 'Accra, Ghana',
    genre: 'Afrobeats / Contemporary R&B',
    signalType: 'Emerging market breakout',
    status: 'SIGN',
    confidence: 88,
    aiScouts: ['Paragon', 'Prism', 'Flare'],
    humanCoSigns: ['Latie'],
    contactPoint: 'Via management — WhatsApp / email in bio',
    socialLink: 'instagram.com/ayrajae',
    streamingLink: 'open.spotify.com/artist/ayrajae',
    infoPreview: '+1,100% in 90 days. Diaspora signal building in UK and Canada. Unsigned.',
    opportunityWindow: '45-day window',
    discoveredAgo: '1 week ago',
    dealReadinessScore: 86,
  },
  {
    id: 'D-004',
    name: 'Mon Rovia',
    market: 'Liberia / USA',
    genre: 'Afro-Appalachian Folk / Indie-Folk',
    signalType: 'Touring momentum',
    status: 'WATCH',
    confidence: 91,
    aiScouts: ['Paragon', 'Nexus', 'Nova'],
    humanCoSigns: ['Randy Jackson', 'Paula Moore'],
    contactPoint: 'Nettwerk A&R — licensing inquiry',
    socialLink: 'instagram.com/monrovia',
    streamingLink: 'open.spotify.com/artist/monrovia',
    infoPreview: '2.4M monthly listeners. Bloodline album touring. Nettwerk exclusive license — monitor for window.',
    opportunityWindow: 'Monitor Q3 contract',
    discoveredAgo: '2 weeks ago',
    dealReadinessScore: 74,
  },
  {
    id: 'D-005',
    name: 'Mako Sol',
    market: 'Atlanta, GA',
    genre: 'Afrobeats / R&B',
    signalType: 'Streaming acceleration',
    status: 'BREAKING',
    confidence: 89,
    aiScouts: ['Paragon', 'Flare', 'Rift', 'Nova'],
    humanCoSigns: ['Latie', 'Paula Moore'],
    contactPoint: 'Indie deal expires Q3 — direct approach recommended',
    socialLink: 'instagram.com/makosol',
    streamingLink: 'open.spotify.com/artist/makosol',
    infoPreview: '+180% streaming MoM. Three editorial playlists added. Deal expires Q3 — active shopping.',
    opportunityWindow: 'Q3 contract expiry',
    discoveredAgo: '3 weeks ago',
    dealReadinessScore: 82,
  },
];

const STATUS_STYLE = {
  SIGN:     { pill: 'bg-[#10B981]/12 text-[#10B981] border-[#10B981]/25',  dot: '#10B981',  glow: 'rgba(16,185,129,0.12)'  },
  WATCH:    { pill: 'bg-[#F59E0B]/12 text-[#F59E0B] border-[#F59E0B]/25',  dot: '#F59E0B',  glow: 'rgba(245,158,11,0.10)'  },
  BREAKING: { pill: 'bg-[#EF4444]/12 text-[#EF4444] border-[#EF4444]/25',  dot: '#EF4444',  glow: 'rgba(239,68,68,0.12)'   },
};

function getDRSTier(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 85) return { label: 'High Priority', color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25' };
  if (score >= 70) return { label: 'Strong Opportunity', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25' };
  if (score >= 50) return { label: 'Developing', color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25' };
  return { label: 'Early', color: '#6B7280', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]' };
}

function CoSignModal({ item, onClose }: { item: DiscoveryItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0C0D10] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] bg-[#0A0B0E]">
          <div>
            <p className="text-[13px] font-bold text-white">{item.name} — Co-sign Detail</p>
            <p className="text-[9.5px] text-white/35 font-mono mt-0.5">Discovery validation intelligence</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[#EF4444]/12 border border-[#EF4444]/20 flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-[#EF4444]" />
              </div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">AI Scout Signals</p>
              <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                {item.aiScouts.length} scouts
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.aiScouts.map(scout => (
                <span key={scout} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#EF4444]/[0.07] text-[#EF4444]/80 border border-[#EF4444]/20">
                  {scout}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-[#10B981]/12 border border-[#10B981]/20 flex items-center justify-center">
                <Users className="w-2.5 h-2.5 text-[#10B981]" />
              </div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Human Co-Signs</p>
              <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                {item.humanCoSigns.length} team
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.humanCoSigns.map(name => (
                <span key={name} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#10B981]/[0.06] text-[#10B981]/75 border border-[#10B981]/18">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-1">Confidence</p>
                <p className="text-[20px] font-bold" style={{ color: item.confidence >= 90 ? '#10B981' : item.confidence >= 80 ? '#F59E0B' : '#06B6D4' }}>
                  {item.confidence}%
                </p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-1">Window</p>
                <p className="text-[12px] font-semibold text-white/75">{item.opportunityWindow}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-1">Surfaced</p>
                <p className="text-[12px] font-semibold text-white/75">{item.discoveredAgo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActionableDiscoveries() {
  const navigate = useNavigate();
  const [coSignCounts, setCoSignCounts] = useState<Record<string, number>>({});
  const [coSignedByMe, setCoSignedByMe] = useState<Set<string>>(new Set());
  const [modalItem, setModalItem] = useState<DiscoveryItem | null>(null);

  function handleCoSign(id: string) {
    if (coSignedByMe.has(id)) return;
    setCoSignedByMe(prev => new Set([...prev, id]));
    setCoSignCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      {modalItem && <CoSignModal item={modalItem} onClose={() => setModalItem(null)} />}

      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-[3px] h-4 rounded-full bg-[#EF4444]" />
        <span className="text-[13px] font-bold text-white/90">Discovery Intelligence</span>
        <span className="text-[9px] font-mono text-white/25 tracking-widest">// ACTIONABLE OPPORTUNITIES</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[8px] font-mono text-white/20 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05]">
            {DISCOVERIES.length} active
          </span>
          <button onClick={() => navigate('/dashboard/rocksteady/discoveries')}
            className="flex items-center gap-1 text-[10px] font-mono text-[#EF4444]/60 hover:text-[#EF4444] transition-colors">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {DISCOVERIES.map(item => {
          const st = STATUS_STYLE[item.status];
          const totalHuman = item.humanCoSigns.length + (coSignCounts[item.id] || 0);
          const myCoSigned = coSignedByMe.has(item.id);
          const confColor = item.confidence >= 90 ? '#10B981' : item.confidence >= 80 ? '#F59E0B' : '#06B6D4';
          const drs = item.dealReadinessScore !== undefined ? getDRSTier(item.dealReadinessScore) : null;

          return (
            <div key={item.id}
              className="px-5 py-4 hover:bg-white/[0.018] transition-colors"
              style={{ borderLeft: `2px solid ${st.dot}18` }}>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: `${st.dot}12`, borderColor: `${st.dot}25` }}>
                  <span className="text-[13px] font-bold" style={{ color: st.dot }}>{item.name.charAt(0)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[14px] font-bold text-white/90">{item.name}</span>
                    <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${st.pill}`}>{item.status}</span>
                    {item.status === 'BREAKING' && (
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: st.dot }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/35 mb-1.5">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span>{item.market}</span>
                    <span className="text-white/18">·</span>
                    <span className="font-mono text-white/30">{item.genre}</span>
                  </div>
                  <p className="text-[11.5px] text-white/55 leading-relaxed mb-2">{item.infoPreview}</p>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/35">
                      <Zap className="w-2 h-2 inline mr-1 -mt-px" />{item.signalType}
                    </span>
                    <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/35">
                      <Clock className="w-2 h-2 inline mr-1 -mt-px" />{item.opportunityWindow}
                    </span>
                    <span className="text-[8.5px] font-mono px-2 py-0.5 rounded text-white/28" style={{ background: `${confColor}10`, border: `1px solid ${confColor}20`, color: confColor }}>
                      {item.confidence}% conf.
                    </span>
                    {drs && item.dealReadinessScore !== undefined && (
                      <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${drs.bg} ${drs.border}`} style={{ color: drs.color }}>
                        <Target className="w-2 h-2 inline -mt-px" />
                        {item.dealReadinessScore} · {drs.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setModalItem(item)}
                      className="flex items-center gap-1.5 text-[9.5px] font-mono text-white/35 hover:text-white/60 transition-colors group">
                      <Shield className="w-3 h-3 shrink-0 text-[#EF4444]/50 group-hover:text-[#EF4444]" />
                      <span className="text-[#EF4444]/60 group-hover:text-[#EF4444] transition-colors">{item.aiScouts.length} AI scouts</span>
                    </button>
                    <button
                      onClick={() => setModalItem(item)}
                      className="flex items-center gap-1.5 text-[9.5px] font-mono text-white/35 hover:text-white/60 transition-colors group">
                      <Users className="w-3 h-3 shrink-0 text-[#10B981]/50 group-hover:text-[#10B981]" />
                      <span className="text-[#10B981]/60 group-hover:text-[#10B981] transition-colors">{totalHuman} A&R co-signed</span>
                    </button>
                    <span className="text-[8.5px] font-mono text-white/20">
                      <Clock className="w-2.5 h-2.5 inline mr-1 -mt-px opacity-50" />{item.discoveredAgo}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <a href={`https://${item.socialLink}`} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-[8.5px] font-mono px-2 py-1 rounded-lg border text-white/28 border-white/[0.07] hover:text-[#06B6D4] hover:border-[#06B6D4]/25 transition-all"
                      title={`Social: ${item.socialLink}`}>
                      <AtSign className="w-2.5 h-2.5" />
                    </a>
                    <a href={`https://${item.streamingLink}`} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-[8.5px] font-mono px-2 py-1 rounded-lg border text-white/28 border-white/[0.07] hover:text-[#10B981] hover:border-[#10B981]/25 transition-all"
                      title={`Streaming: ${item.streamingLink}`}>
                      <Music className="w-2.5 h-2.5" />
                    </a>
                    {item.linktreeLink && (
                      <a href={`https://${item.linktreeLink}`} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-[8.5px] font-mono px-2 py-1 rounded-lg border text-white/28 border-white/[0.07] hover:text-[#F59E0B] hover:border-[#F59E0B]/25 transition-all"
                        title={`All links: ${item.linktreeLink}`}>
                        <Link className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleCoSign(item.id)}
                    disabled={myCoSigned}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9.5px] font-semibold border transition-all ${
                      myCoSigned
                        ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25 cursor-default'
                        : 'bg-white/[0.03] text-white/40 border-white/[0.08] hover:bg-[#10B981]/[0.08] hover:text-[#10B981] hover:border-[#10B981]/22 cursor-pointer'
                    }`}
                    title={myCoSigned ? 'You co-signed this discovery' : 'Add your co-sign'}>
                    {myCoSigned
                      ? <><CheckCircle className="w-3 h-3" /> Co-signed</>
                      : <><Star className="w-3 h-3" /> Co-sign</>
                    }
                  </button>

                  <div className="text-right max-w-[160px] space-y-1">
                    <p className="text-[8.5px] font-mono text-white/35 leading-snug">
                      {item.contactPoint}
                    </p>
                    {item.contactEmail && (
                      <a href={`mailto:${item.contactEmail}`}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-[8px] font-mono text-[#06B6D4]/55 hover:text-[#06B6D4] transition-colors justify-end"
                        title="Management Contact">
                        <Mail className="w-2 h-2 shrink-0" />
                        <span className="truncate">{item.contactEmail}</span>
                      </a>
                    )}
                    {item.contactConfidence !== undefined && (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[7.5px] font-mono text-white/22">Contact: {item.contactConfidence}%</span>
                        {item.responseRisk && (
                          <span className={`text-[7px] font-mono px-1 py-0.5 rounded border ${
                            item.responseRisk === 'Low' ? 'bg-[#10B981]/08 text-[#10B981]/60 border-[#10B981]/15' :
                            item.responseRisk === 'Medium' ? 'bg-[#F59E0B]/08 text-[#F59E0B]/60 border-[#F59E0B]/15' :
                            'bg-[#EF4444]/08 text-[#EF4444]/60 border-[#EF4444]/15'
                          }`}>{item.responseRisk} risk</span>
                        )}
                      </div>
                    )}
                    {drs && item.dealReadinessScore !== undefined && (
                      <div className="pt-1.5 border-t border-white/[0.04] space-y-1">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Target className="w-2.5 h-2.5 shrink-0" style={{ color: drs.color }} />
                          <span className="text-[8px] font-mono" style={{ color: drs.color }}>
                            Deal Readiness: {item.dealReadinessScore}
                          </span>
                        </div>
                        {item.dealReadinessScore >= 85 && (
                          <p className="text-[7px] font-mono text-[#EF4444]/70 text-right">Act Now</p>
                        )}
                        {item.dealReadinessScore >= 70 && item.dealReadinessScore < 85 && (
                          <p className="text-[7px] font-mono text-[#F59E0B]/60 text-right">Engage</p>
                        )}
                        {item.dealReadinessScore < 70 && (
                          <p className="text-[7px] font-mono text-white/25 text-right">Monitor</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
