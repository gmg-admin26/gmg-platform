import { useState } from 'react';
import {
  FileText, Download, Copy, Send, Bookmark,
  Clock, TrendingUp, Award, Users, Globe, Radio,
  ExternalLink, Music, AtSign, Link, Mail, Shield, Target,
} from 'lucide-react';
import { PARAGON_TODAY_REPORT, type ReportArtist } from '../../data/paragonReportData';

type Range = 'Today' | '7 Days' | '14 Days' | '30 Days';
const RANGES: Range[] = ['Today', '7 Days', '14 Days', '30 Days'];

function scoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 70) return '#F59E0B';
  if (score >= 60) return '#06B6D4';
  return '#6B7280';
}

function getDRSTier(score: number): { label: string; color: string; bg: string; border: string; action: string } {
  if (score >= 85) return { label: 'High Priority', color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25', action: 'Act Now' };
  if (score >= 70) return { label: 'Strong', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25', action: 'Engage' };
  if (score >= 50) return { label: 'Developing', color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25', action: 'Monitor' };
  return { label: 'Early', color: '#6B7280', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', action: 'Watch' };
}

function labelBadgeStyle(status: string): string {
  if (status.startsWith('Unsigned')) return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
  if (status.startsWith('Major')) return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
  return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20';
}

interface Props {
  accentColor: string;
  scoutName: string;
}

export default function TodaysReport({ accentColor, scoutName }: Props) {
  const [range, setRange] = useState<Range>('Today');
  const [copied, setCopied] = useState(false);

  const r = PARAGON_TODAY_REPORT;

  function handleCopy() {
    const text = [
      `${scoutName} — ${r.subtitle}`,
      '',
      `Top Pick: ${r.topPick.artist} (A&R Score: ${r.topPick.arScore}/100)`,
      `Market: ${r.topPick.market} | Genre: ${r.topPick.genre}`,
      '',
      r.topPick.summary,
      '',
      `Audience: ${r.topPick.audienceNote}`,
      '',
      `Recommendation: ${r.topPick.recommendation}`,
      `Window: ${r.topPick.window}`,
      '',
      r.footerText,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${accentColor}28`, background: '#09090D' }}
    >
      <div
        className="px-5 py-4 border-b flex items-center gap-3 flex-wrap"
        style={{ borderColor: `${accentColor}16`, background: `${accentColor}07` }}
      >
        <div className="w-[3px] h-[18px] rounded-full shrink-0" style={{ background: accentColor }} />

        <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-wrap">
          <span className="text-[15px] font-bold text-white tracking-tight">Today's Report</span>
          <span
            className="inline-flex items-center gap-1.5 text-[8px] font-mono px-2.5 py-1 rounded-full border font-semibold tracking-[0.12em] uppercase"
            style={{ background: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}35` }}
          >
            <Radio className="w-2.5 h-2.5" />
            Live Daily Brief
          </span>
          <span className="text-[10.5px] text-white/40 font-mono hidden sm:inline">{r.subtitle}</span>
        </div>

        <div className="flex items-center p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg gap-0.5 shrink-0">
          {RANGES.map(tab => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-md transition-all whitespace-nowrap ${
                range === tab ? 'font-semibold' : 'text-white/20 hover:text-white/50'
              }`}
              style={
                range === tab
                  ? { background: `${accentColor}16`, color: accentColor, border: `1px solid ${accentColor}28` }
                  : {}
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {range !== 'Today' ? (
        <div className="py-16 text-center px-6">
          <FileText className="w-9 h-9 text-white/8 mx-auto mb-4" />
          <p className="text-[13px] text-white/25 font-mono">No archived report loaded for this window yet.</p>
          <p className="text-[11px] text-white/12 mt-1.5">Check back after the next scout sync cycle.</p>
        </div>
      ) : (
        <div className="p-5 space-y-5">

          <div
            className="rounded-xl border p-4 grid grid-cols-2 lg:grid-cols-4 gap-4"
            style={{ borderColor: `${accentColor}14`, background: `${accentColor}04` }}
          >
            {[
              { icon: FileText,   label: 'Scout',    value: scoutName },
              { icon: Clock,      label: 'Date',     value: r.date },
              { icon: Users,      label: 'Coverage', value: r.coverage },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${accentColor}12` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[8px] font-mono text-white/28 uppercase tracking-[0.14em] mb-0.5">{label}</p>
                  <p className="text-[12px] font-semibold text-white/88">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3 col-span-2 lg:col-span-1">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${accentColor}12` }}
              >
                <TrendingUp className="w-3.5 h-3.5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-[8px] font-mono text-white/18 uppercase tracking-[0.14em] mb-1.5">Metrics Covered</p>
                <div className="flex flex-wrap gap-1">
                  {r.metricsCovered.map(m => (
                    <span
                      key={m}
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/32"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-1">
            <p className="text-[12px] text-white/55 leading-relaxed">
              10 artists scored across streaming momentum, social growth, press activity, playlist placements, and label status.
            </p>
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: `${accentColor}28`, background: `${accentColor}06` }}
          >
            <div
              className="flex items-center gap-2.5 px-5 py-3.5 border-b"
              style={{ borderColor: `${accentColor}14` }}
            >
              <Award className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
              <span
                className="text-[9px] font-mono uppercase tracking-[0.18em] font-semibold"
                style={{ color: `${accentColor}B0` }}
              >
                Top Pick of the Day
              </span>
              <span
                className="ml-auto text-[8.5px] font-mono px-2.5 py-1 rounded-lg border font-semibold"
                style={{ background: `${accentColor}12`, color: accentColor, borderColor: `${accentColor}28` }}
              >
                A&R Score: {r.topPick.arScore}/100
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-5 flex-wrap">
                <div className="flex-1 min-w-[200px] space-y-3.5">

                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <h3 className="text-[22px] font-bold text-white leading-none tracking-tight">
                        {r.topPick.artist}
                      </h3>
                      <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 tracking-wider">
                        UNSIGNED
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-white/38">
                        <Globe className="w-3 h-3" />
                        {r.topPick.market}
                      </span>
                      <span className="text-white/15 text-[10px]">·</span>
                      <span className="text-[11px] text-white/28">{r.topPick.genre}</span>
                    </div>
                  </div>

                  <p
                    className="text-[13px] font-semibold italic text-white/65 leading-snug border-l-[2px] pl-3.5 py-0.5"
                    style={{ borderColor: `${accentColor}55` }}
                  >
                    "{r.topPick.headline}"
                  </p>

                  <p className="text-[12.5px] text-white/52 leading-relaxed">
                    {r.topPick.summary}
                  </p>

                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-3">
                    <p className="text-[8px] font-mono text-white/18 uppercase tracking-[0.14em] mb-1">Audience Note</p>
                    <p className="text-[11.5px] text-white/42 leading-relaxed">{r.topPick.audienceNote}</p>
                  </div>

                  <div
                    className="rounded-lg border px-3.5 py-3"
                    style={{ borderColor: `${accentColor}22`, background: `${accentColor}07` }}
                  >
                    <p
                      className="text-[8px] font-mono uppercase tracking-[0.14em] mb-1.5"
                      style={{ color: `${accentColor}65` }}
                    >
                      GMG Recommendation
                    </p>
                    <p
                      className="text-[12.5px] font-semibold leading-relaxed"
                      style={{ color: accentColor }}
                    >
                      {r.topPick.recommendation}
                    </p>
                  </div>
                </div>

                <div
                  className="shrink-0 rounded-xl border p-5 flex flex-col items-center gap-3"
                  style={{ borderColor: `${accentColor}22`, background: `${accentColor}08`, minWidth: '120px' }}
                >
                  <div
                    className="w-18 h-18 rounded-full border-[2.5px] flex items-center justify-center"
                    style={{ borderColor: accentColor, width: '72px', height: '72px' }}
                  >
                    <span className="text-[24px] font-bold tabular-nums" style={{ color: accentColor }}>
                      {r.topPick.arScore}
                    </span>
                  </div>
                  <p className="text-[8px] font-mono text-white/18 uppercase tracking-wider text-center">
                    A&R Score
                  </p>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: `${accentColor}25`, background: `${accentColor}10` }}
                  >
                    <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: `${accentColor}A0` }} />
                    <span className="text-[8px] font-mono text-center" style={{ color: `${accentColor}A0` }}>
                      {r.topPick.window}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'Export PDF',        icon: Download,  action: undefined },
              { label: copied ? 'Copied!' : 'Copy Summary', icon: Copy, action: handleCopy },
              { label: 'Send to Team',      icon: Send,      action: undefined },
              { label: 'Save to Watchlist', icon: Bookmark,  action: undefined },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-mono text-white/32 border border-white/[0.07] hover:text-white/65 hover:border-white/[0.13] hover:bg-white/[0.025] transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#08090C]">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]">
              <div className="w-[3px] h-4 rounded-full bg-[#06B6D4] shrink-0" />
              <span className="text-[12.5px] font-semibold text-white/80">Ranked Artist Chart</span>
              <span className="text-[9px] font-mono text-white/22 ml-1">
                // {r.artists.length} artists scored today
              </span>
            </div>

            <div className="hidden xl:grid grid-cols-[28px_160px_1fr_100px_52px_52px_72px_120px] px-5 py-2.5 border-b border-white/[0.04] gap-3">
              {['#', 'Artist', 'Momentum', 'Label', 'Score', 'Acc.', 'DRS', 'Entry Point'].map(h => (
                <span key={h} className="text-[8px] font-mono text-white/22 uppercase tracking-[0.12em]">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-white/[0.03]">
              {r.artists.map((artist: ReportArtist) => {
                const sc = scoreColor(artist.arScore);
                const labelText = artist.labelStatus.split('(')[0].trim();
                const labelSub = artist.labelStatus.match(/\(([^)]+)\)/)?.[1];
                const accColor = artist.accuracy >= 90 ? '#10B981' : artist.accuracy >= 80 ? '#F59E0B' : '#06B6D4';
                const drs = artist.dealReadinessScore !== undefined ? getDRSTier(artist.dealReadinessScore) : null;
                return (
                  <div
                    key={artist.rank}
                    className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors xl:grid xl:grid-cols-[28px_160px_1fr_100px_52px_52px_72px_120px] gap-3 items-start"
                  >
                    <span className="hidden xl:block text-[10px] font-mono text-white/25 pt-0.5">
                      {artist.rank}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 xl:hidden mb-0.5">
                        <span className="text-[9px] font-mono text-white/25">{artist.rank}.</span>
                        <p className="text-[12.5px] font-semibold text-white/88 truncate">{artist.name}</p>
                      </div>
                      <p className="hidden xl:block text-[12.5px] font-semibold text-white/88 truncate">
                        {artist.name}
                      </p>
                      <p className="text-[10px] text-white/38 truncate">{artist.genre}</p>
                      <p className="text-[9px] font-mono text-white/25 mt-0.5">{artist.market}</p>
                      <div className="flex items-center gap-2 mt-1.5 xl:hidden flex-wrap">
                        <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border ${labelBadgeStyle(artist.labelStatus)}`}>
                          {labelText}
                        </span>
                        <span className="text-[11px] font-bold font-mono ml-auto" style={{ color: sc }}>
                          {artist.arScore}/100
                        </span>
                      </div>
                      <div className="mt-1.5 xl:hidden">
                        <p className="text-[9px] font-mono text-white/30">
                          <AtSign className="w-2.5 h-2.5 inline mr-1 opacity-60" />
                          {artist.contactPoint}
                        </p>
                      </div>
                      <p className="text-[10.5px] text-white/38 leading-relaxed mt-1.5 xl:hidden">
                        {artist.opportunity}
                      </p>
                    </div>

                    <div className="hidden xl:block min-w-0 pr-2">
                      <p className="text-[11px] text-white/48 leading-relaxed">{artist.momentum}</p>
                      <p className="text-[10.5px] text-white/35 mt-1.5 leading-relaxed">{artist.opportunity}</p>
                    </div>

                    <div className="hidden xl:block min-w-0">
                      <span className={`text-[8.5px] font-mono px-2 py-1 rounded-lg border inline-block ${labelBadgeStyle(artist.labelStatus)}`}>
                        {labelText}
                      </span>
                      {labelSub && (
                        <p className="text-[9px] text-white/25 mt-1 font-mono truncate">{labelSub}</p>
                      )}
                    </div>

                    <div className="hidden xl:flex flex-col items-center gap-1.5 pt-0.5">
                      <span className="text-[17px] font-bold tabular-nums leading-none" style={{ color: sc }}>
                        {artist.arScore}
                      </span>
                      <div className="w-9 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${artist.arScore}%`, background: sc }} />
                      </div>
                    </div>

                    <div className="hidden xl:flex flex-col items-center gap-1.5 pt-0.5">
                      <span className="text-[14px] font-bold tabular-nums leading-none" style={{ color: accColor }}>
                        {artist.accuracy}%
                      </span>
                      <p className="text-[7.5px] font-mono text-white/20 uppercase tracking-wider">Acc.</p>
                    </div>

                    <div className="hidden xl:flex flex-col items-start gap-1.5 pt-0.5 min-w-0">
                      {drs ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Target className="w-2.5 h-2.5 shrink-0" style={{ color: drs.color }} />
                            <span className="text-[15px] font-bold tabular-nums leading-none" style={{ color: drs.color }}>
                              {artist.dealReadinessScore}
                            </span>
                          </div>
                          <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${drs.bg} ${drs.border} truncate`} style={{ color: drs.color }}>
                            {drs.action}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-white/18">—</span>
                      )}
                    </div>

                    <div className="hidden xl:block min-w-0">
                      <p className="text-[9px] font-mono text-white/38 leading-snug mb-2">
                        {artist.contactPoint}
                      </p>
                      <div className="flex flex-col gap-1 mb-2">
                        <a href={`https://${artist.socialLink}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-[8.5px] font-mono text-white/28 hover:text-[#06B6D4] transition-colors truncate group"
                          title={artist.socialLink}>
                          <AtSign className="w-2.5 h-2.5 shrink-0 group-hover:text-[#06B6D4]" />
                          <span className="truncate">Social</span>
                          <ExternalLink className="w-2 h-2 shrink-0 opacity-50" />
                        </a>
                        <a href={`https://${artist.streamingLink}`} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-[8.5px] font-mono text-white/28 hover:text-[#10B981] transition-colors truncate group"
                          title={artist.streamingLink}>
                          <Music className="w-2.5 h-2.5 shrink-0 group-hover:text-[#10B981]" />
                          <span className="truncate">Streaming</span>
                          <ExternalLink className="w-2 h-2 shrink-0 opacity-50" />
                        </a>
                        {artist.linktreeLink && (
                          <a href={`https://${artist.linktreeLink}`} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-[8.5px] font-mono text-white/28 hover:text-[#F59E0B] transition-colors truncate group"
                            title={artist.linktreeLink}>
                            <Link className="w-2.5 h-2.5 shrink-0 group-hover:text-[#F59E0B]" />
                            <span className="truncate">Linktree</span>
                            <ExternalLink className="w-2 h-2 shrink-0 opacity-50" />
                          </a>
                        )}
                        {artist.contactEmail && (
                          <a href={`mailto:${artist.contactEmail}`}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-[8.5px] font-mono text-white/28 hover:text-[#06B6D4] transition-colors truncate group"
                            title={artist.contactEmail}>
                            <Mail className="w-2.5 h-2.5 shrink-0 group-hover:text-[#06B6D4]" />
                            <span className="truncate">Email</span>
                          </a>
                        )}
                      </div>
                      {(artist.contactConfidence !== undefined || artist.responseRisk) && (
                        <div className="flex flex-col gap-1 pt-1.5 border-t border-white/[0.04]">
                          {artist.contactConfidence !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Shield className="w-2 h-2 text-white/20 shrink-0" />
                              <span className="text-[7.5px] font-mono text-white/22">Confidence</span>
                              <span className="text-[7.5px] font-mono ml-auto" style={{ color: artist.contactConfidence >= 80 ? '#10B981' : artist.contactConfidence >= 60 ? '#F59E0B' : '#EF4444' }}>
                                {artist.contactConfidence}%
                              </span>
                            </div>
                          )}
                          {artist.responseLikelihood !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[7.5px] font-mono text-white/22">Response</span>
                              <span className="text-[7.5px] font-mono ml-auto text-white/35">{artist.responseLikelihood}%</span>
                            </div>
                          )}
                          {artist.responseRisk && (
                            <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border self-start mt-0.5 ${
                              artist.responseRisk === 'Low' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                              artist.responseRisk === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                              'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                            }`}>
                              {artist.responseRisk} Risk
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-white/[0.04] bg-white/[0.008]">
              <p className="text-[10px] font-mono text-white/28">{r.footerText}</p>
              <p className="text-[9px] font-mono text-white/18 mt-0.5">{r.footerNote}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
