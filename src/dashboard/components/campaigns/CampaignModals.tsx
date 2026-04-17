import { useState } from 'react';
import {
  X, Zap, ChevronRight, CheckCircle, Calendar, Upload,
  Send, Save, Clock, Globe, Megaphone, Music,
} from 'lucide-react';

const ARTIST = 'All American Rejects';
const LABEL = 'SPIN Records';

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = {
  fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)',
  textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6,
};
const g2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

function ModalShell({ title, sub, Icon, iconColor, children, onClose }: {
  title: string; sub: string; Icon: React.ElementType; iconColor: string;
  children: React.ReactNode; onClose: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div style={{ width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '30px 34px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
          <X size={14} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${iconColor}15`, border: `1px solid ${iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={16} color={iconColor} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{title}</h2>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{ARTIST} · {LABEL} · {sub}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

const CAMPAIGN_PRESETS = [
  { id: 'blow', name: 'Blow This Song Up', desc: 'Momentum campaign across TikTok, IG Reels, Spotify save behavior, and creator seeding', channels: 'TikTok · Instagram · Spotify', lift: '+35% streams in 14 days', time: '48h activation', color: '#EF4444' },
  { id: 'geo', name: 'Geo Breakout Push', desc: 'Focus ad and content spend around fastest-growing city clusters — Brazil + Mexico City active', channels: 'Meta · TikTok · Local Creator', lift: '+44% in target markets', time: '72h activation', color: '#06B6D4' },
  { id: 'presave', name: 'Pre-Save Conversion Sprint', desc: 'Increase saves before release using short-form sequences, story campaigns, and fan DM flows', channels: 'Spotify · IG Stories · TikTok', lift: '+28% save conversion', time: '24h activation', color: '#10B981' },
  { id: 'release', name: 'Release Week Domination', desc: 'Multi-day release burst across DSP, creator, and social — full stack activation', channels: 'All Channels', lift: 'Max velocity on release', time: '5-day plan', color: '#F59E0B' },
  { id: 'catalog', name: 'Reignite Catalog', desc: 'Push older songs into new short-form content cycles and nostalgia playlist targeting', channels: 'TikTok · Spotify · IG Reels', lift: '+18% catalog streams', time: '48h activation', color: '#EC4899' },
  { id: 'engage', name: 'Fan Engagement Surge', desc: 'Comment prompts, fan reply workflows, community reactivation, DM content prompts', channels: 'Instagram · TikTok · Community', lift: '+62% engagement rate', time: '24h activation', color: '#3B82F6' },
];

export function BlowUpModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState('blow');
  const preset = CAMPAIGN_PRESETS.find(p => p.id === selected) ?? CAMPAIGN_PRESETS[0];

  return (
    <ModalShell title="Blow This Song Up" sub="Campaign Preset Activation" Icon={Zap} iconColor="#EF4444" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {CAMPAIGN_PRESETS.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{ padding: '13px 14px', borderRadius: 12, cursor: 'pointer', border: `1px solid ${selected === p.id ? `${p.color}40` : 'rgba(255,255,255,0.07)'}`, background: selected === p.id ? `${p.color}0A` : 'rgba(255,255,255,0.02)', transition: 'all 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: selected === p.id ? p.color : 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: selected === p.id ? '#fff' : 'rgba(255,255,255,0.55)' }}>{p.name}</span>
            </div>
            <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{p.channels}</p>
          </div>
        ))}
      </div>

      <div style={{ background: `${preset.color}06`, border: `1px solid ${preset.color}20`, borderRadius: 14, padding: '16px 18px', marginBottom: 18 }}>
        <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: '#fff' }}>{preset.name}</p>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{preset.desc}</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Expected Lift', value: preset.lift, color: '#10B981' },
            { label: 'Time to Activate', value: preset.time, color: '#06B6D4' },
            { label: 'Channels', value: preset.channels, color: 'rgba(255,255,255,0.5)' },
          ].map(item => (
            <div key={item.label}>
              <p style={{ margin: '0 0 2px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Target Release / Song</label>
          <select style={{ ...inp, cursor: 'pointer' }}>
            <option>Flagpole Sitta — Active</option>
            <option>Move Along (Deluxe Edition) — Upcoming</option>
            <option>Untitled Summer Single — In Production</option>
          </select>
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Budget</label>
            <input style={inp} placeholder="e.g. $5,000" defaultValue="$8,000" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Start Date</label>
            <input style={inp} type="date" />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Focus Markets</label>
          <input style={inp} placeholder="e.g. US, Brazil, Mexico — leave blank for all" defaultValue="US, Brazil, Mexico City" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Notes to Rep</label>
          <textarea style={{ ...inp, minHeight: 70, resize: 'vertical', lineHeight: 1.6 }} placeholder="Any context, priorities, or specific asks..." />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Save Draft</button>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontWeight: 700 }}>Queue With Reps</button>
        <button onClick={onClose} style={{ flex: 2, fontSize: 13, padding: '11px', borderRadius: 10, cursor: 'pointer', background: `${preset.color}18`, border: `1px solid ${preset.color}40`, color: preset.color, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Zap size={13} /> Launch Now
        </button>
      </div>
    </ModalShell>
  );
}

export function SchedulePostModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <ModalShell title="Post Scheduled" sub="Content Queue" Icon={Calendar} iconColor="#10B981" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={24} color="#10B981" />
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#fff' }}>Post scheduled and routed into Artist OS content queue.</p>
        <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Your rep will be notified. Review before it goes live if rep review was toggled on.</p>
        <button onClick={onClose} style={{ fontSize: 12, padding: '10px 24px', borderRadius: 10, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontWeight: 700 }}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Schedule a Post" sub="Content Scheduler" Icon={Calendar} iconColor="#06B6D4" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Platform</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>TikTok</option><option>Instagram</option><option>YouTube</option>
              <option>Spotify Canvas</option><option>Multi-Platform</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Post Type</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>Short Video</option><option>Story</option><option>Feed Post</option>
              <option>Reel</option><option>Audio Push</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Caption / Prompt</label>
          <textarea style={{ ...inp, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }} placeholder="Write caption or provide direction for the rep..." />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Asset Link (Dropbox / Drive / DISCO)</label>
          <input style={inp} placeholder="Link to video, photo, or audio file" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Call to Action</label>
          <input style={inp} placeholder="e.g. Pre-save the album, stream now, follow for updates" />
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Date</label>
            <input style={inp} type="date" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Time</label>
            <input style={inp} type="time" defaultValue="10:00" />
          </div>
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Market Targeting</label>
            <input style={inp} placeholder="e.g. US, Brazil, Global" defaultValue="Global" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Objective</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>Push Active Single</option><option>Drive Pre-Save</option>
              <option>Announce Release</option><option>Fan Engagement</option>
              <option>Creator Seed</option><option>Catalog Reactivation</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Rep review before posting' },
            { label: 'Turn into campaign sequence' },
            { label: 'Reuse for story cutdown' },
            { label: 'Boost if performance spikes' },
          ].map(opt => (
            <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '10px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Cancel</button>
        <button onClick={() => setSubmitted(true)} style={{ flex: 2, fontSize: 12, padding: '10px', borderRadius: 10, cursor: 'pointer', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.35)', color: '#06B6D4', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Calendar size={12} /> Schedule Post
        </button>
      </div>
    </ModalShell>
  );
}

export function ContentToRepsModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <ModalShell title="Content Delivered" sub="Rep Routing" Icon={Send} iconColor="#10B981" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={24} color="#10B981" />
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#fff' }}>Content routed to Artist OS reps.</p>
        <p style={{ margin: '0 0 24px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Drop assets once. Artist OS routes them to the right rep workflows.</p>
        <button onClick={onClose} style={{ fontSize: 12, padding: '10px 24px', borderRadius: 10, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontWeight: 700 }}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Send Content to Reps" sub="Asset Delivery" Icon={Upload} iconColor="#10B981" onClose={onClose}>
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>Drop assets once. Artist OS routes them to the right rep workflows.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Asset Link (Dropbox / Google Drive / DISCO)</label>
          <input style={inp} placeholder="Paste link to your content folder or file" />
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Content Type</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>Short Video / Clip</option><option>Social Video</option>
              <option>Photo Set</option><option>Cover Art</option><option>Teaser</option>
              <option>Live Footage</option><option>Behind the Scenes</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Platform Target</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>TikTok</option><option>Instagram</option><option>YouTube</option>
              <option>Spotify Canvas</option><option>Multi-Platform</option>
            </select>
          </div>
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Objective</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>Fan Engagement</option><option>Pre-Save Push</option>
              <option>Song Push</option><option>Creator Support</option><option>Awareness</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Due Date</label>
            <input style={inp} type="date" />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Attach to Release (optional)</label>
          <select style={{ ...inp, cursor: 'pointer' }}>
            <option value="">Not attached to a release</option>
            <option>Flagpole Sitta</option>
            <option>Move Along (Deluxe Edition)</option>
            <option>Untitled Summer Single</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Notes to Reps</label>
          <textarea style={{ ...inp, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }} placeholder="Context, urgency, how you want this used..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '10px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Save Draft</button>
        <button onClick={() => setSubmitted(true)} style={{ flex: 2, fontSize: 12, padding: '10px', borderRadius: 10, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Send size={12} /> Send to Reps
        </button>
      </div>
    </ModalShell>
  );
}

export function EngageModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState('');

  const actions = [
    { id: 'reply', title: 'Reply to Fans Faster', desc: 'Surface top fan comments and threads. Artist OS builds reply prompts and routes to your team.', effect: '+43% comment reply rate', color: '#06B6D4' },
    { id: 'reactivate', title: 'Reactivate Dormant Fans', desc: 'Identify fans who engaged 30+ days ago. Trigger personalized re-engagement content sequence.', effect: 'Recover 15–20% lapsed fans', color: '#10B981' },
    { id: 'comment', title: 'Run Comment Prompt Campaign', desc: 'Release conversation starters that drive comments, shares, and algorithmic reach.', effect: '+2.8x post engagement', color: '#F59E0B' },
    { id: 'content', title: 'Turn Top Comments Into Content', desc: 'Identify best fan responses and build creator content around them.', effect: 'Authentic UGC velocity', color: '#EC4899' },
    { id: 'story', title: 'Launch Story Q&A Push', desc: 'Story Q&A sequences that surface fan questions and build artist-fan closeness.', effect: '+55% story interaction', color: '#EF4444' },
    { id: 'thanks', title: 'Build Fan Thank-You Sequence', desc: 'Automated personalised thank-you content for top fans and milestone celebrates.', effect: 'Top fan retention +38%', color: '#3B82F6' },
  ];

  return (
    <ModalShell title="Interact With Fans" sub="Fan Engagement Action Center" Icon={Megaphone} iconColor="#06B6D4" onClose={onClose}>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
        Artist OS builds prompts, surfaces top fan threads, and helps your team turn engagement into momentum.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {actions.map(a => (
          <div key={a.id} onClick={() => setSelected(selected === a.id ? '' : a.id)} style={{ padding: '14px 16px', borderRadius: 13, cursor: 'pointer', border: `1px solid ${selected === a.id ? `${a.color}40` : 'rgba(255,255,255,0.07)'}`, background: selected === a.id ? `${a.color}08` : 'rgba(255,255,255,0.01)', transition: 'all 0.15s' }}>
            <p style={{ margin: '0 0 5px', fontSize: 12, fontWeight: 700, color: selected === a.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>{a.title}</p>
            <p style={{ margin: '0 0 8px', fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{a.desc}</p>
            <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: a.color, background: `${a.color}12`, border: `1px solid ${a.color}25` }}>{a.effect}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Cancel</button>
        <button onClick={onClose} style={{ flex: 2, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: selected ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${selected ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.1)'}`, color: selected ? '#06B6D4' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
          {selected ? 'Activate This Action' : 'Select an Action First'}
        </button>
      </div>
    </ModalShell>
  );
}

export function PreSaveModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Launch Pre-Save Push" sub="Pre-Save Activation Flow" Icon={Music} iconColor="#EC4899" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Target Release</label>
          <select style={{ ...inp, cursor: 'pointer' }}>
            <option>Move Along (Deluxe Edition) — Jun 12, 2026</option>
            <option>Untitled Summer Single — Aug 2026</option>
          </select>
        </div>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Campaign Duration</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>7 days</option><option>14 days</option><option>21 days</option><option>30 days</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Budget</label>
            <input style={inp} placeholder="e.g. $3,000" defaultValue="$5,000" />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Platforms to Activate</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Spotify', 'Apple Music', 'TikTok', 'Instagram Stories', 'YouTube'].map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(236,72,153,0.15)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{p}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Focus Territories</label>
          <input style={inp} placeholder="e.g. US, UK, Brazil — leave blank for global" defaultValue="US, Brazil, Mexico, UK" />
        </div>
        <div style={{ background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 12, padding: '13px 16px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 9, fontFamily: 'monospace', color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Pre-Save Status</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <div><p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#EC4899' }}>12,400</p><p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>pre-saves</p></div>
            <div><p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#10B981' }}>+38%</p><p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>above benchmark</p></div>
            <div><p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#06B6D4' }}>63</p><p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>days to release</p></div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Queue With Reps</button>
        <button onClick={onClose} style={{ flex: 2, fontSize: 13, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(236,72,153,0.14)', border: '1px solid rgba(236,72,153,0.4)', color: '#EC4899', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Zap size={13} /> Activate Pre-Save Push
        </button>
      </div>
    </ModalShell>
  );
}

export function RequestCampaignModal({ onClose }: { onClose: () => void }) {
  const [selectedType, setSelectedType] = useState('');
  const [message, setMessage] = useState('');

  const types = [
    { id: 'song-push', label: 'Song Push', color: '#EF4444' },
    { id: 'presave', label: 'Pre-Save Push', color: '#EC4899' },
    { id: 'content', label: 'Content Run', color: '#10B981' },
    { id: 'fan-engage', label: 'Fan Engagement', color: '#06B6D4' },
    { id: 'geo', label: 'Geo Campaign', color: '#F59E0B' },
    { id: 'dsp', label: 'DSP Support', color: '#1DB954' },
    { id: 'creator', label: 'Creator Push', color: '#FF6B35' },
    { id: 'merch', label: 'Merch Push', color: '#8B5CF6' },
    { id: 'release-week', label: 'Release Week Plan', color: '#3B82F6' },
    { id: 'strategy', label: 'Strategy Session', color: '#6B7280' },
  ];

  return (
    <ModalShell title="Campaign Request" sub="Submit to Artist OS Reps" Icon={Megaphone} iconColor="#06B6D4" onClose={onClose}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '13px 16px', marginBottom: 18 }}>
        <p style={{ margin: '0 0 8px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Financial Context</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'YTD Revenue', v: '$186K', c: '#10B981' },
            { label: 'Active Budget', v: '$31.5K', c: '#EF4444' },
            { label: 'Spent', v: '$11.3K', c: '#F59E0B' },
            { label: 'Est. Return', v: '$98K', c: '#10B981' },
          ].map(i => (
            <div key={i.label}><p style={{ margin: '0 0 2px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{i.label}</p><p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: i.c }}>{i.v}</p></div>
          ))}
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Request Type</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        {types.map(t => (
          <div key={t.id} onClick={() => setSelectedType(t.id)} style={{ padding: '10px 14px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${selectedType === t.id ? `${t.color}40` : 'rgba(255,255,255,0.07)'}`, background: selectedType === t.id ? `${t.color}0A` : 'rgba(255,255,255,0.02)', transition: 'all 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedType === t.id ? t.color : 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: selectedType === t.id ? '#fff' : 'rgba(255,255,255,0.55)' }}>{t.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        <div style={g2}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Related Release (optional)</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Not release-specific</option>
              <option>Move Along (Deluxe Edition)</option>
              <option>Flagpole Sitta</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lbl}>Priority</label>
            <select style={{ ...inp, cursor: 'pointer' }}>
              <option>Urgent</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={lbl}>Message for Reps</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} style={{ ...inp, minHeight: 90, resize: 'vertical', lineHeight: 1.5 }} placeholder="Describe what you need and any context..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '10px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
          <Save size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Save Draft
        </button>
        <button onClick={onClose} style={{ flex: 2, fontSize: 12, padding: '10px 20px', borderRadius: 9, cursor: 'pointer', background: 'rgba(6,182,212,0.14)', border: '1px solid rgba(6,182,212,0.35)', color: '#06B6D4', fontWeight: 700 }}>
          <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Submit Campaign Request
        </button>
      </div>
    </ModalShell>
  );
}

export function MarketDetailModal({ market, onClose }: { market: FanMarket; onClose: () => void }) {
  return (
    <ModalShell title={market.name} sub="Market Intelligence" Icon={Globe} iconColor="#06B6D4" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Listeners', value: market.listeners, color: '#06B6D4' },
          { label: 'Growth', value: market.growth, color: '#10B981' },
          { label: 'Engagement', value: market.engagement, color: '#F59E0B' },
          { label: 'Save Rate', value: market.saveRate, color: '#EC4899' },
          { label: 'Social Score', value: market.socialScore, color: '#EF4444' },
          { label: 'Campaign', value: market.campaign, color: market.campaign === 'Active' ? '#10B981' : '#6B7280' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Top Platform', value: 'Spotify / TikTok', icon: '🎵' },
          { label: 'Creator Activity', value: 'High — 200+ posts/week using AAR sounds', icon: '📱' },
          { label: 'Content Angle', value: 'Nostalgia + throwback content performs best', icon: '🎬' },
          { label: 'Suggested Action', value: 'Launch geo-targeted creator push', icon: '⚡' },
          { label: 'Assigned Rep', value: 'Paula Moore — Growth Team', icon: '👤' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 14 }}>{row.icon}</span>
            <div>
              <p style={{ margin: '0 0 1px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{row.label}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, fontSize: 11, padding: '10px', borderRadius: 9, cursor: 'pointer', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4', fontWeight: 600 }}>Build Local Content Push</button>
        <button onClick={onClose} style={{ flex: 1, fontSize: 11, padding: '10px', borderRadius: 9, cursor: 'pointer', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontWeight: 700 }}>Launch Geo Campaign</button>
      </div>
    </ModalShell>
  );
}

export interface FanMarket {
  name: string;
  type: 'country' | 'state' | 'city';
  listeners: string;
  growth: string;
  engagement: string;
  saveRate: string;
  socialScore: string;
  campaign: 'Active' | 'Scheduled' | 'None';
  trending: boolean;
}
