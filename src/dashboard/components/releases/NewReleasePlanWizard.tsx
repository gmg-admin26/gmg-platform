import { useMemo, useState } from 'react';
import {
  X, ChevronRight, ChevronLeft, Plus, Trash2, AlertTriangle, CheckCircle,
  Star, Upload, Link, Music, FileText, Users, Send, Save,
  Mic2, Disc, Tag, Globe, BarChart2, Shield, Lock, Info,
} from 'lucide-react';
import { generateAvailableDates, generateAllFutureFridays, getPlanningYear } from '../../utils/releaseDateEngine';

const ARTIST_NAME = 'All American Rejects';
const LABEL_NAME = 'SPIN Records';

const WIZARD_CONFLICTS = [
  { month: 6, day: 12, label: 'Move Along (Deluxe Edition)' },
];

// ─── Base styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '9px 12px',
  fontSize: 13,
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: '1px solid rgba(239,68,68,0.45)',
  background: 'rgba(239,68,68,0.04)',
};

const lockedInputStyle: React.CSSProperties = {
  ...inputStyle,
  opacity: 0.45,
  cursor: 'not-allowed',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: 5,
};

const helperStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: 10,
  color: 'rgba(255,255,255,0.25)',
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: 10,
  color: '#EF4444',
  lineHeight: 1.5,
};

const noteStyle: React.CSSProperties = {
  margin: '5px 0 0',
  fontSize: 10,
  color: 'rgba(255,255,255,0.22)',
  lineHeight: 1.5,
  fontStyle: 'italic',
};

const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

const sectionLabel: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: 10,
  fontFamily: 'monospace',
  color: 'rgba(255,255,255,0.25)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
};

const sectionDesc: React.CSSProperties = {
  margin: '0 0 20px',
  fontSize: 12,
  color: 'rgba(255,255,255,0.38)',
  lineHeight: 1.6,
};

const divider: React.CSSProperties = { height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0' };

const groupBox: React.CSSProperties = {
  background: 'rgba(255,255,255,0.015)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

// ─── Data ───────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  'Chill', 'Feel Good', 'Feeling Blue', 'Fitness Focus', 'Heartbreak',
  'Motivation', 'Party', 'Romance', 'Sleep', 'Energetic',
  'Happy', 'Fierce', 'Meditative', 'Romantic', 'Sad', 'Sexy',
];

const MUSIC_CULTURE_OPTIONS = [
  'African', 'Arabic', 'Asian', 'Buddhist', 'Caribbean', 'Celtic',
  'Christian', 'Hindu', 'Indigenous', 'Islamic', 'Judaic',
  'Latin', 'Sikih', 'South Asian',
];

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TrackWriter { name: string; role: 'Lyricist' | 'Composer' | 'Lyricist-Composer'; }
interface TrackProducer { name: string; }
interface Track {
  title: string; version: string; artists: string; isrc: string; assignISRC: boolean;
  explicit: 'Explicit' | 'Clean'; language: string; cLine: string; pLine: string;
  publishers: string; pro: string; genre: string; albumOnly: boolean;
  lyrics: string; tiktokStart: string; tiktokEnd: string;
  writers: TrackWriter[]; producers: TrackProducer[];
  touched: Record<string, boolean>;
}

function defaultTrack(): Track {
  return {
    title: '', version: '', artists: ARTIST_NAME, isrc: '', assignISRC: true,
    explicit: 'Clean', language: 'English', cLine: '', pLine: '',
    publishers: '', pro: '', genre: 'Pop / Rock', albumOnly: false,
    lyrics: '', tiktokStart: '', tiktokEnd: '',
    writers: [{ name: '', role: 'Lyricist-Composer' }],
    producers: [{ name: '' }],
    touched: {},
  };
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={labelStyle}>
      {children}
      {required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
    </label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <p style={helperStyle}>{children}</p>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p style={errorStyle}>{children}</p>;
}

function MultiLinkField({
  label, placeholder, values, onChange, helper,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (vals: string[]) => void;
  helper?: string;
}) {
  return (
    <div style={fieldWrap}>
      <FieldLabel>{label}</FieldLabel>
      {helper && <HelperText>{helper}</HelperText>}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gap: 7 }}>
            <input
              style={inputStyle}
              value={v}
              onChange={e => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            {values.length > 1 && (
              <button
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                title="Remove"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...values, ''])}
        style={{ alignSelf: 'flex-start', marginTop: 8, fontSize: 10, padding: '4px 11px', borderRadius: 7, cursor: 'pointer', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
      >
        <Plus size={9} /> Add another
      </button>
    </div>
  );
}

function MultiSelectChips({
  label, options, selected, onChange, required, helper,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  required?: boolean;
  helper?: string;
}) {
  function toggle(opt: string) {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  }
  return (
    <div style={fieldWrap}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {helper && <HelperText>{helper}</HelperText>}
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                fontSize: 11, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                background: active ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(6,182,212,0.45)' : 'rgba(255,255,255,0.1)'}`,
                color: active ? '#06B6D4' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
                fontWeight: active ? 700 : 400,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LockedGMGField({ label }: { label: string }) {
  return (
    <div style={fieldWrap}>
      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Lock size={8} color="rgba(255,255,255,0.18)" />
        {label}
      </label>
      <div style={{ ...lockedInputStyle, display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' as const, borderStyle: 'dashed' }}>
        <Lock size={10} color="rgba(255,255,255,0.15)" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>This will be added by GMG after submission.</span>
      </div>
    </div>
  );
}

function CheckToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <button type="button" onClick={onChange} style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${checked ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.15)'}`, background: checked ? 'rgba(6,182,212,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        {checked && <CheckCircle size={12} color="#06B6D4" />}
      </button>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
    </label>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface Props { onClose: () => void; }

export default function NewReleasePlanWizard({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Basics
  const [basics, setBasics] = useState({
    title: '', type: 'Single', priority: 'High',
    additionalArtists: '', genre: 'Pop / Rock', subgenre: '',
    objective: '', isLeadSingle: false, isNewRelease: true,
    upc: '', firstWithGMG: false,
    spotifyLinks: [''], appleMusicLinks: [''],
    createNewArtistPage: false,
  });
  const [basicsTouched, setBasicsTouched] = useState<Record<string, boolean>>({});
  function setB(k: string, v: unknown) { setBasics(p => ({ ...p, [k]: v })); }
  function touchB(k: string) { setBasicsTouched(p => ({ ...p, [k]: true })); }

  // Step 2 — Date
  const availableDates = useMemo(() => {
    const year = getPlanningYear();
    const startFrom = new Date(year, 3, 1);
    return generateAvailableDates({ conflicts: WIZARD_CONFLICTS, startFromDate: startFrom, count: 10 });
  }, []);
  const allFutureDates = useMemo(() => {
    const year = getPlanningYear();
    const startFrom = new Date(year, 3, 1);
    return generateAllFutureFridays({ conflicts: WIZARD_CONFLICTS, startFromDate: startFrom, count: 104 });
  }, []);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [showAllDates, setShowAllDates] = useState(false);
  const [allDatesSearch, setAllDatesSearch] = useState('');
  const [allDatesOpen, setAllDatesOpen] = useState(false);

  const filteredAllDates = useMemo(() => {
    const q = allDatesSearch.toLowerCase();
    return allFutureDates.filter(d =>
      d.display.toLowerCase().includes(q) || d.label.toLowerCase().includes(q)
    );
  }, [allFutureDates, allDatesSearch]);

  const isCustomDate = selectedDate && !availableDates.find(d => d.date === selectedDate);
  const selectedCustomInfo = isCustomDate ? allFutureDates.find(d => d.date === selectedDate) : null;

  function handleDateSelect(d: typeof availableDates[0]) {
    if (d.type === 'reserved') { setDateWarning('This date is reserved for another release. Choose a different date.'); return; }
    if (d.warning) setDateWarning(d.warning); else setDateWarning('');
    setSelectedDate(d.date);
    setAllDatesOpen(false);
    setAllDatesSearch('');
  }
  const selectedDateInfo = availableDates.find(d => d.date === selectedDate) ?? allFutureDates.find(d => d.date === selectedDate);

  // Step 3 — Product Metadata
  const [meta, setMeta] = useState({
    productTitle: '', productVersion: '', productArtists: ARTIST_NAME,
    spotifyArtistIds: [''], appleMusicArtistIds: [''],
    upc: '', catalogNumber: 'GMG-AUTO', genre: 'Pop / Rock', subgenre: '',
    cLine: '', pLine: '',
    compilation: false, linerNotes: '', preOrderDate: '', exclusiveDate: '', exclusiveService: '',
    originalReleaseDate: '',
  });
  const [metaTouched, setMetaTouched] = useState<Record<string, boolean>>({});
  function setM(k: string, v: unknown) { setMeta(p => ({ ...p, [k]: v })); }
  function touchM(k: string) { setMetaTouched(p => ({ ...p, [k]: true })); }

  // Step 4 — Tracks
  const [tracks, setTracks] = useState<Track[]>([defaultTrack()]);
  function updateTrack(i: number, k: keyof Track, v: string | boolean | TrackWriter[] | TrackProducer[] | Record<string, boolean>) {
    setTracks(ts => ts.map((t, idx) => idx === i ? { ...t, [k]: v } : t));
  }
  function touchTrack(i: number, k: string) {
    setTracks(ts => ts.map((t, idx) => idx === i ? { ...t, touched: { ...t.touched, [k]: true } } : t));
  }
  function addTrack() { setTracks(ts => [...ts, defaultTrack()]); }
  function removeTrack(i: number) { setTracks(ts => ts.filter((_, idx) => idx !== i)); }
  function duplicateTrack(i: number) { setTracks(ts => { const c = [...ts]; c.splice(i + 1, 0, { ...ts[i], touched: {} }); return c; }); }
  function addWriter(ti: number) { setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, writers: [...t.writers, { name: '', role: 'Lyricist-Composer' }] } : t)); }
  function removeWriter(ti: number, wi: number) { setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, writers: t.writers.filter((_, j) => j !== wi) } : t)); }
  function updateWriter(ti: number, wi: number, k: keyof TrackWriter, v: string) {
    setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, writers: t.writers.map((w, j) => j === wi ? { ...w, [k]: v } : w) } : t));
  }
  function addProducer(ti: number) { setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, producers: [...t.producers, { name: '' }] } : t)); }
  function removeProducer(ti: number, pi: number) { setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, producers: t.producers.filter((_, j) => j !== pi) } : t)); }
  function updateProducer(ti: number, pi: number, v: string) {
    setTracks(ts => ts.map((t, idx) => idx === ti ? { ...t, producers: t.producers.map((p, j) => j === pi ? { name: v } : p) } : t));
  }

  // Step 5 — Assets
  const [assets, setAssets] = useState({
    coverArtLink: '', audioLink: '', motionArtLink: '', pdfBookletLink: '',
    pressPhotosLink: '', videoLink: '', dropboxLink: '', discoLink: '',
    assetsUploaded: false,
    pitchToPlaylists: null as boolean | null,
  });
  function setA(k: string, v: unknown) { setAssets(p => ({ ...p, [k]: v })); }

  // Step 6 — Playlist
  const [pitch, setPitch] = useState({
    genre: 'Pop / Rock', focusGenre: '', supplementalGenre2: '',
    moods: [] as string[], instruments: '', musicCulture: [] as string[],
    elevatorPitch: '', culturalPositioning: '',
    quoteAboutSong: '', forFansOf: '',
    spotifyPlaylists: '', applePlaylists: '',
    pressTargets: '', marketingPlan: '',
    budget: '', focusTerritories: '',
    touringHighlights: '', musicVideoInfo: '',
    trackTitle: '',
  });
  const [pitchTouched, setPitchTouched] = useState<Record<string, boolean>>({});
  function setP(k: string, v: unknown) { setPitch(p => ({ ...p, [k]: v })); }
  function touchP(k: string) { setPitchTouched(p => ({ ...p, [k]: true })); }

  // Conditional step skip
  const skipPlaylist = assets.pitchToPlaylists === false;
  const TOTAL_STEPS = skipPlaylist ? 6 : 7;
  const reviewStep = skipPlaylist ? 6 : 7;

  const stepTitles = skipPlaylist
    ? ['Release Basics', 'Date Selection', 'Product Metadata', 'Track Metadata', 'Asset Delivery', 'Review + Submit']
    : ['Release Basics', 'Date Selection', 'Product Metadata', 'Track Metadata', 'Asset Delivery', 'Playlist + DSP Pitch', 'Review + Submit'];

  const stepDescriptions: Record<number, string> = {
    1: 'Core information for your release. Make sure artist names and links are accurate.',
    2: 'Select a release date — everything else in the timeline will be built around this.',
    3: 'Defines how your release is categorized and delivered to DSPs.',
    4: 'Enter detailed track information including credits, publishing, and ownership.',
    5: 'Upload and confirm all required assets for your release.',
    6: skipPlaylist ? '' : 'Provide details to support editorial and playlist pitching.',
    7: 'Review your submission before sending it to the GMG team.',
  };

  // Scores & blockers
  const metadataScore = Math.round([
    basics.title ? 100 : 0, basics.genre ? 100 : 0, selectedDate ? 100 : 0,
    meta.productTitle ? 100 : 0, meta.cLine ? 100 : 0, meta.pLine ? 100 : 0,
    tracks[0]?.title ? 100 : 0, tracks[0]?.writers[0]?.name ? 100 : 0,
  ].reduce((a, b) => a + b, 0) / 8);

  const assetsScore = Math.round([
    assets.coverArtLink ? 100 : 0, assets.audioLink ? 100 : 0,
    assets.dropboxLink ? 50 : 0, assets.discoLink ? 50 : 0,
  ].reduce((a, b) => a + b, 0) / 4);

  const marketingScore = Math.round([
    pitch.elevatorPitch ? 100 : 0,
    pitch.forFansOf ? 100 : 0,
    pitch.moods.length > 0 ? 100 : 0,
  ].reduce((a, b) => a + b, 0) / 3);

  const blockers = [
    !basics.title && 'Release title missing',
    !basics.genre && 'Genre missing (Step 1)',
    !selectedDate && 'Release date not selected',
    !meta.cLine && 'C Line missing',
    !meta.pLine && 'P Line missing',
    !assets.coverArtLink && 'Cover art not submitted',
    !assets.audioLink && 'Audio masters not submitted',
    assets.pitchToPlaylists === null && 'Playlist pitch decision required (Step 5)',
  ].filter(Boolean) as string[];

  const disposition = blockers.length === 0 ? 'Ready for Internal Review'
    : !basics.title || !selectedDate ? 'Draft'
    : !assets.coverArtLink || !assets.audioLink ? 'Needs Assets'
    : !meta.cLine || !meta.pLine ? 'Needs Metadata'
    : 'Draft';

  // Helper: show field error after touch or submit
  function showErr(touched: boolean, value: string) {
    return (touched || submitted) && !value.trim();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}>
      <div style={{ width: '100%', maxWidth: 720, maxHeight: '92vh', overflowY: 'auto', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '30px 36px', position: 'relative' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Disc size={15} color="#06B6D4" />
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Start New Release Plan</h2>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
            {ARTIST_NAME} · {LABEL_NAME} · Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}
          </p>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
              <div
                key={s}
                onClick={() => s < step && setStep(s)}
                title={stepTitles[s - 1]}
                style={{ flex: 1, height: 3, borderRadius: 2, background: s < step ? '#06B6D4' : s === step ? 'rgba(6,182,212,0.55)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s', cursor: s < step ? 'pointer' : 'default' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Step {step} of {TOTAL_STEPS}</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
        </div>

        {/* ─── STEP 1 — Release Basics ─── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p style={sectionLabel}>01 — Release Basics</p>
              <p style={sectionDesc}>Core information for your release. Make sure artist names and links are accurate.</p>
            </div>

            <div style={fieldWrap}>
              <FieldLabel required>Release Title</FieldLabel>
              <input
                style={showErr(basicsTouched.title, basics.title) ? inputErrorStyle : inputStyle}
                value={basics.title}
                onChange={e => setB('title', e.target.value)}
                onBlur={() => touchB('title')}
                placeholder="e.g. Flagpole Sitta"
              />
              {showErr(basicsTouched.title, basics.title) && <FieldError>This field is required.</FieldError>}
            </div>

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel>Release Type</FieldLabel>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={basics.type} onChange={e => setB('type', e.target.value)}>
                  {['Single', 'EP', 'Album', 'Deluxe', 'Re-release'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Priority Level</FieldLabel>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={basics.priority} onChange={e => setB('priority', e.target.value)}>
                  {['Urgent', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={fieldWrap}>
              <FieldLabel>Primary Artist</FieldLabel>
              <input style={{ ...inputStyle, opacity: 0.45 }} value={ARTIST_NAME} readOnly />
            </div>

            <div style={fieldWrap}>
              <FieldLabel>Additional Artists</FieldLabel>
              <input style={inputStyle} value={basics.additionalArtists} onChange={e => setB('additionalArtists', e.target.value)} placeholder="Separate with commas" />
              <HelperText>Only include artists who appear on this specific release.</HelperText>
            </div>

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel required>Genre</FieldLabel>
                <input
                  style={showErr(basicsTouched.genre, basics.genre) ? inputErrorStyle : inputStyle}
                  value={basics.genre}
                  onChange={e => setB('genre', e.target.value)}
                  onBlur={() => touchB('genre')}
                />
                {showErr(basicsTouched.genre, basics.genre) && <FieldError>This field is required.</FieldError>}
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Subgenre</FieldLabel>
                <input style={inputStyle} value={basics.subgenre} onChange={e => setB('subgenre', e.target.value)} placeholder="e.g. Emo, Pop Punk" />
              </div>
            </div>

            <div style={fieldWrap}>
              <FieldLabel>Release Objective</FieldLabel>
              <input style={inputStyle} value={basics.objective} onChange={e => setB('objective', e.target.value)} placeholder="e.g. Fan re-engagement, streaming growth, new audience" />
              <HelperText>Help GMG understand the goal of this release so we can align strategy.</HelperText>
            </div>

            <div style={divider} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CheckToggle checked={basics.isLeadSingle} onChange={() => setB('isLeadSingle', !basics.isLeadSingle)} label="This is the lead single" />
              <CheckToggle checked={basics.isNewRelease} onChange={() => setB('isNewRelease', !basics.isNewRelease)} label="New release (not a prior release)" />
              <CheckToggle checked={basics.firstWithGMG} onChange={() => setB('firstWithGMG', !basics.firstWithGMG)} label="First release with GMG" />
              <CheckToggle checked={basics.createNewArtistPage} onChange={() => setB('createNewArtistPage', !basics.createNewArtistPage)} label="Create new artist page at Spotify / Apple Music" />
            </div>

            {!basics.isNewRelease && (
              <div style={fieldWrap}>
                <FieldLabel>UPC (prior release)</FieldLabel>
                <input style={inputStyle} value={basics.upc} onChange={e => setB('upc', e.target.value)} placeholder="Enter existing UPC" />
                <HelperText>Only required if re-releasing a track that already has a UPC.</HelperText>
              </div>
            )}

            <div style={divider} />

            <MultiLinkField
              label="Spotify Artist Page Link"
              placeholder="open.spotify.com/artist/..."
              values={basics.spotifyLinks}
              onChange={v => setB('spotifyLinks', v)}
              helper="Add a link for each artist on this release."
            />
            <MultiLinkField
              label="Apple Music Artist Page Link"
              placeholder="music.apple.com/artist/..."
              values={basics.appleMusicLinks}
              onChange={v => setB('appleMusicLinks', v)}
            />
          </div>
        )}

        {/* ─── STEP 2 — Date Selection ─── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={sectionLabel}>02 — Date Selection</p>
              <p style={sectionDesc}>Select a release date — everything else in the timeline will be built around this.</p>
            </div>

            <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 12, padding: '12px 16px' }}>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                GMG calculates your submission window and readiness requirements from the date you select. Optimal dates are pre-calculated to avoid blackout periods and competing releases.
              </p>
            </div>

            {dateWarning && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                <AlertTriangle size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: '#F59E0B', lineHeight: 1.5 }}>{dateWarning}</span>
              </div>
            )}

            {/* Custom date selected banner */}
            {isCustomDate && selectedCustomInfo && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12 }}>
                <Info size={13} color="#06B6D4" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#06B6D4' }}>Custom date selected — {selectedCustomInfo.display}</p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>Release OS will recalculate submission window, editorial timing, and readiness requirements. Submit by <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{selectedCustomInfo.submissionDeadlineDisplay}</span>.</p>
                </div>
              </div>
            )}

            {/* Section A — Recommended Dates */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recommended release dates</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>AI OPTIMIZED</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {availableDates.map(d => {
                  const isSelected = selectedDate === d.date;
                  const dotColor = d.type === 'optimal' ? '#10B981' : d.type === 'caution' ? '#F59E0B' : d.type === 'reserved' ? '#EF4444' : '#6B7280';
                  return (
                    <div key={d.date} onClick={() => handleDateSelect(d)} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, border: `1px solid ${isSelected ? 'rgba(6,182,212,0.4)' : d.type === 'reserved' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`, background: isSelected ? 'rgba(6,182,212,0.06)' : 'rgba(255,255,255,0.01)', cursor: d.type === 'reserved' ? 'not-allowed' : 'pointer', opacity: d.type === 'reserved' ? 0.55 : 1, transition: 'all 0.15s' }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 4, boxShadow: d.type === 'optimal' ? `0 0 8px ${dotColor}60` : 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{d.display}</span>
                          <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: dotColor, background: `${dotColor}15`, border: `1px solid ${dotColor}30` }}>{d.label}</span>
                          {d.recommended && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}><Star size={7} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />AI PICK</span>}
                        </div>
                        <p style={{ margin: '0 0 3px', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{d.note}</p>
                        {d.warning && <p style={{ margin: 0, fontSize: 10, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={9} style={{ flexShrink: 0 }} />{d.warning}</p>}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Submit by</p>
                        <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{d.submissionDeadlineDisplay}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section B — All Future Dates */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>All future release dates</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>

              <p style={{ margin: '0 0 10px', fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                Don't see the timing you want? Choose any eligible future release date.
              </p>

              {!showAllDates ? (
                <button
                  onClick={() => { setShowAllDates(true); setAllDatesOpen(true); }}
                  style={{ width: '100%', padding: '11px 16px', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}
                >
                  <Globe size={13} />
                  Select from all future release dates
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setAllDatesOpen(o => !o)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: `1px solid ${allDatesOpen ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <Globe size={13} color="rgba(255,255,255,0.35)" />
                    <span style={{ flex: 1, fontSize: 12, color: isCustomDate && selectedCustomInfo ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                      {isCustomDate && selectedCustomInfo ? selectedCustomInfo.display : 'Select a release date…'}
                    </span>
                    <ChevronRight size={13} color="rgba(255,255,255,0.25)" style={{ transform: allDatesOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </div>

                  {allDatesOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100, background: '#141519', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                      {/* Search */}
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <input
                          autoFocus
                          style={{ ...inputStyle, fontSize: 12, padding: '7px 10px' }}
                          placeholder="Search by month, year, or label…"
                          value={allDatesSearch}
                          onChange={e => setAllDatesSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>

                      {/* Date list */}
                      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                        {filteredAllDates.length === 0 && (
                          <p style={{ margin: 0, padding: '16px', fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No dates match your search.</p>
                        )}
                        {filteredAllDates.map(d => {
                          const isSelected = selectedDate === d.date;
                          const dotColor = d.type === 'optimal' ? '#10B981' : d.type === 'caution' ? '#F59E0B' : d.type === 'reserved' ? '#EF4444' : '#6B7280';
                          return (
                            <div
                              key={d.date}
                              onClick={() => handleDateSelect(d)}
                              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', cursor: d.type === 'reserved' ? 'not-allowed' : 'pointer', background: isSelected ? 'rgba(6,182,212,0.06)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: d.type === 'reserved' ? 0.45 : 1, transition: 'background 0.1s' }}
                            >
                              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: d.type === 'optimal' ? `0 0 6px ${dotColor}50` : 'none' }} />
                              <span style={{ flex: 1, fontSize: 12, fontWeight: isSelected ? 700 : 400, color: isSelected ? '#06B6D4' : '#fff' }}>{d.display}</span>
                              <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 20, color: dotColor, background: `${dotColor}12`, border: `1px solid ${dotColor}28` }}>{d.label}</span>
                              {d.recommended && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>AI PICK</span>}
                              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', minWidth: 64, textAlign: 'right' }}>submit {d.submissionDeadlineDisplay}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ margin: '0 0 5px', fontSize: 9, fontFamily: 'monospace', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Blackout Dates</p>
              {[
                { label: 'July 4',         range: `Jul 4, ${getPlanningYear()}` },
                { label: 'Thanksgiving',   range: `Nov 26–29, ${getPlanningYear()}` },
                { label: 'Holiday Window', range: `Dec 11, ${getPlanningYear()} – Jan 8, ${getPlanningYear() + 1}` },
              ].map(b => (
                <p key={b.label} style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{b.label}: <span style={{ color: 'rgba(239,68,68,0.7)' }}>{b.range}</span></p>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 3 — Product Metadata ─── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p style={sectionLabel}>03 — Product Metadata</p>
              <p style={sectionDesc}>Defines how your release is categorized and delivered to DSPs.</p>
            </div>

            <div style={fieldWrap}>
              <FieldLabel required>Product Title</FieldLabel>
              <input
                style={showErr(metaTouched.productTitle, meta.productTitle) ? inputErrorStyle : inputStyle}
                value={meta.productTitle}
                onChange={e => setM('productTitle', e.target.value)}
                onBlur={() => touchM('productTitle')}
                placeholder="e.g. Move Along (Deluxe Edition)"
              />
              {showErr(metaTouched.productTitle, meta.productTitle) && <FieldError>This field is required.</FieldError>}
            </div>

            <div style={fieldWrap}>
              <FieldLabel>Product Version</FieldLabel>
              <input style={inputStyle} value={meta.productVersion} onChange={e => setM('productVersion', e.target.value)} placeholder="e.g. Acoustic, Remastered" />
              <HelperText>Only fill this in for remixes, acoustic versions, or remastered releases.</HelperText>
            </div>

            <div style={fieldWrap}>
              <FieldLabel>Product Artist(s)</FieldLabel>
              <input style={inputStyle} value={meta.productArtists} onChange={e => setM('productArtists', e.target.value)} />
            </div>

            <div style={groupBox}>
              <MultiLinkField
                label="Spotify Artist ID / Link"
                placeholder="open.spotify.com/artist/..."
                values={meta.spotifyArtistIds}
                onChange={v => setM('spotifyArtistIds', v)}
                helper="Add one per artist if this is a collaboration."
              />
              <MultiLinkField
                label="Apple Music Artist ID / Link"
                placeholder="music.apple.com/artist/..."
                values={meta.appleMusicArtistIds}
                onChange={v => setM('appleMusicArtistIds', v)}
              />
            </div>

            <div style={divider} />

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel>UPC</FieldLabel>
                <input style={inputStyle} value={meta.upc} onChange={e => setM('upc', e.target.value)} placeholder="Leave blank to assign new UPC" />
                <HelperText>Only enter if this is a prior release with an existing UPC.</HelperText>
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Catalog Number</FieldLabel>
                <input style={{ ...inputStyle, opacity: 0.45 }} value={meta.catalogNumber} readOnly />
                <HelperText>Auto-assigned by GMG.</HelperText>
              </div>
            </div>

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel required>Main Genre</FieldLabel>
                <input
                  style={showErr(metaTouched.genre, meta.genre) ? inputErrorStyle : inputStyle}
                  value={meta.genre}
                  onChange={e => setM('genre', e.target.value)}
                  onBlur={() => touchM('genre')}
                />
                {showErr(metaTouched.genre, meta.genre) && <FieldError>This field is required.</FieldError>}
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Subgenre</FieldLabel>
                <input style={inputStyle} value={meta.subgenre} onChange={e => setM('subgenre', e.target.value)} />
              </div>
            </div>

            <div style={grid2}>
              <div style={fieldWrap}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Lock size={8} color="rgba(255,255,255,0.18)" />
                  Product Price Tier
                </label>
                <div style={{ ...lockedInputStyle, display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' as const, borderStyle: 'dashed' }}>
                  <Lock size={10} color="rgba(255,255,255,0.15)" />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>This will be added by GMG after submission.</span>
                </div>
                <HelperText>GMG assigns price tier based on project format and VMG standards.</HelperText>
              </div>
              <div style={fieldWrap}>
                <FieldLabel required>Original Release Date</FieldLabel>
                <input
                  style={showErr(metaTouched.originalReleaseDate, meta.originalReleaseDate) ? inputErrorStyle : inputStyle}
                  type="date"
                  value={meta.originalReleaseDate}
                  onChange={e => setM('originalReleaseDate', e.target.value)}
                  onBlur={() => touchM('originalReleaseDate')}
                />
                {showErr(metaTouched.originalReleaseDate, meta.originalReleaseDate) && <FieldError>This field is required.</FieldError>}
                <HelperText>Use today's date for new releases.</HelperText>
              </div>
            </div>

            <div style={{ ...groupBox, gap: 14 }}>
              <div style={grid2}>
                <div style={fieldWrap}>
                  <FieldLabel required>C Line</FieldLabel>
                  <input
                    style={showErr(metaTouched.cLine, meta.cLine) ? inputErrorStyle : inputStyle}
                    value={meta.cLine}
                    onChange={e => setM('cLine', e.target.value)}
                    onBlur={() => touchM('cLine')}
                    placeholder="℗ 2026 SPIN Records"
                  />
                  {showErr(metaTouched.cLine, meta.cLine) && <FieldError>This field is required.</FieldError>}
                  <HelperText>Copyright owner of the composition (lyrics + melody).</HelperText>
                </div>
                <div style={fieldWrap}>
                  <FieldLabel required>P Line</FieldLabel>
                  <input
                    style={showErr(metaTouched.pLine, meta.pLine) ? inputErrorStyle : inputStyle}
                    value={meta.pLine}
                    onChange={e => setM('pLine', e.target.value)}
                    onBlur={() => touchM('pLine')}
                    placeholder="© 2026 SPIN Records"
                  />
                  {showErr(metaTouched.pLine, meta.pLine) && <FieldError>This field is required.</FieldError>}
                  <HelperText>Copyright owner of the master recording.</HelperText>
                </div>
              </div>
            </div>

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel>Pre-order Date</FieldLabel>
                <input style={inputStyle} type="date" value={meta.preOrderDate} onChange={e => setM('preOrderDate', e.target.value)} />
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Exclusive Date</FieldLabel>
                <input style={inputStyle} type="date" value={meta.exclusiveDate} onChange={e => setM('exclusiveDate', e.target.value)} />
              </div>
            </div>

            {meta.exclusiveDate && (
              <div style={fieldWrap}>
                <FieldLabel>Exclusive Service</FieldLabel>
                <input style={inputStyle} value={meta.exclusiveService} onChange={e => setM('exclusiveService', e.target.value)} placeholder="e.g. Spotify, Apple Music, Tidal" />
              </div>
            )}

            <CheckToggle checked={meta.compilation} onChange={() => setM('compilation', !meta.compilation)} label="This is a compilation" />

            <div style={fieldWrap}>
              <FieldLabel>Liner Notes</FieldLabel>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }} value={meta.linerNotes} onChange={e => setM('linerNotes', e.target.value)} placeholder="Optional credits and notes..." />
            </div>
          </div>
        )}

        {/* ─── STEP 4 — Track Metadata ─── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={sectionLabel}>04 — Track Metadata</p>
              <p style={sectionDesc}>Enter detailed track information including credits, publishing, and ownership.</p>
            </div>

            {tracks.map((track, ti) => (
              <div key={ti} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Track {ti + 1}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => duplicateTrack(ti)} style={{ fontSize: 9, padding: '4px 10px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Duplicate</button>
                    {tracks.length > 1 && <button onClick={() => removeTrack(ti)} style={{ fontSize: 9, padding: '4px 10px', borderRadius: 7, cursor: 'pointer', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={9} />Remove</button>}
                  </div>
                </div>

                <div style={grid2}>
                  <div style={fieldWrap}>
                    <FieldLabel required>Song Title</FieldLabel>
                    <input
                      style={showErr(!!track.touched?.title, track.title) ? inputErrorStyle : inputStyle}
                      value={track.title}
                      onChange={e => updateTrack(ti, 'title', e.target.value)}
                      onBlur={() => touchTrack(ti, 'title')}
                    />
                    {showErr(!!track.touched?.title, track.title) && <FieldError>This field is required.</FieldError>}
                  </div>
                  <div style={fieldWrap}>
                    <FieldLabel>Song Version</FieldLabel>
                    <input style={inputStyle} value={track.version} onChange={e => updateTrack(ti, 'version', e.target.value)} placeholder="e.g. Acoustic, Remix" />
                  </div>
                </div>

                <div style={fieldWrap}>
                  <FieldLabel>Song Artist(s)</FieldLabel>
                  <input style={inputStyle} value={track.artists} onChange={e => updateTrack(ti, 'artists', e.target.value)} />
                </div>

                {/* Writers */}
                <div style={groupBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <FieldLabel required>Writers</FieldLabel>
                      <HelperText>List all songwriters exactly as they should appear in credits.</HelperText>
                    </div>
                    <button onClick={() => addWriter(ti)} style={{ fontSize: 9, padding: '3px 9px', borderRadius: 7, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={9} />Add</button>
                  </div>
                  {(submitted || !!track.touched?.writers) && !track.writers.some(w => w.name.trim()) && (
                    <FieldError>Please enter at least one writer.</FieldError>
                  )}
                  {track.writers.map((w, wi) => (
                    <div key={wi} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 30px', gap: 8 }}>
                      <input style={inputStyle} value={w.name} onChange={e => updateWriter(ti, wi, 'name', e.target.value)} onBlur={() => touchTrack(ti, 'writers')} placeholder="Writer name" />
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={w.role} onChange={e => updateWriter(ti, wi, 'role', e.target.value as TrackWriter['role'])}>
                        {['Lyricist', 'Composer', 'Lyricist-Composer'].map(r => <option key={r}>{r}</option>)}
                      </select>
                      {track.writers.length > 1 && <button onClick={() => removeWriter(ti, wi)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={10} /></button>}
                    </div>
                  ))}
                </div>

                {/* Producers */}
                <div style={groupBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FieldLabel>Producers</FieldLabel>
                    <button onClick={() => addProducer(ti)} style={{ fontSize: 9, padding: '3px 9px', borderRadius: 7, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={9} />Add</button>
                  </div>
                  {track.producers.map((p, pi) => (
                    <div key={pi} style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gap: 8 }}>
                      <input style={inputStyle} value={p.name} onChange={e => updateProducer(ti, pi, e.target.value)} placeholder="Producer name" />
                      {track.producers.length > 1 && <button onClick={() => removeProducer(ti, pi)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={10} /></button>}
                    </div>
                  ))}
                </div>

                {/* ISRC + Language */}
                <div style={grid2}>
                  <div style={fieldWrap}>
                    <FieldLabel>ISRC</FieldLabel>
                    <select style={{ ...inputStyle, cursor: 'pointer', marginBottom: 6 }} value={track.assignISRC ? 'assign' : 'manual'} onChange={e => updateTrack(ti, 'assignISRC', e.target.value === 'assign')}>
                      <option value="assign">Assign new ISRC</option>
                      <option value="manual">Enter manual ISRC</option>
                    </select>
                    {!track.assignISRC && <input style={inputStyle} value={track.isrc} onChange={e => updateTrack(ti, 'isrc', e.target.value)} placeholder="e.g. USAT22100001" />}
                  </div>
                  <div style={fieldWrap}>
                    <FieldLabel>Audio Language</FieldLabel>
                    <input style={inputStyle} value={track.language} onChange={e => updateTrack(ti, 'language', e.target.value)} />
                  </div>
                </div>

                {/* C Line + P Line */}
                <div style={groupBox}>
                  <div style={grid2}>
                    <div style={fieldWrap}>
                      <FieldLabel required>C Line</FieldLabel>
                      <input
                        style={showErr(!!track.touched?.cLine, track.cLine) ? inputErrorStyle : inputStyle}
                        value={track.cLine}
                        onChange={e => updateTrack(ti, 'cLine', e.target.value)}
                        onBlur={() => touchTrack(ti, 'cLine')}
                        placeholder="℗ 2026 SPIN Records"
                      />
                      {showErr(!!track.touched?.cLine, track.cLine) && <FieldError>This field is required.</FieldError>}
                      <HelperText>Copyright owner of the composition (lyrics + melody).</HelperText>
                    </div>
                    <div style={fieldWrap}>
                      <FieldLabel required>P Line</FieldLabel>
                      <input
                        style={showErr(!!track.touched?.pLine, track.pLine) ? inputErrorStyle : inputStyle}
                        value={track.pLine}
                        onChange={e => updateTrack(ti, 'pLine', e.target.value)}
                        onBlur={() => touchTrack(ti, 'pLine')}
                        placeholder="© 2026 SPIN Records"
                      />
                      {showErr(!!track.touched?.pLine, track.pLine) && <FieldError>This field is required.</FieldError>}
                      <HelperText>Copyright owner of the master recording.</HelperText>
                    </div>
                  </div>
                </div>

                {/* Explicit + Price Tier */}
                <div style={grid2}>
                  <div style={fieldWrap}>
                    <FieldLabel>Explicit / Clean</FieldLabel>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={track.explicit} onChange={e => updateTrack(ti, 'explicit', e.target.value as 'Explicit' | 'Clean')}>
                      <option>Clean</option><option>Explicit</option>
                    </select>
                  </div>
                  <div style={fieldWrap}>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Lock size={8} color="rgba(255,255,255,0.18)" />
                      Track Price Tier
                    </label>
                    <div style={{ ...lockedInputStyle, display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' as const, borderStyle: 'dashed' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>T3</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>This will be added by GMG after submission.</span>
                    </div>
                  </div>
                </div>

                {/* TikTok */}
                <div style={groupBox}>
                  <div>
                    <p style={{ ...labelStyle, marginBottom: 2 }}>TikTok Clip Window <span style={{ color: '#EF4444' }}>*</span></p>
                    <HelperText>Select the portion of the track most likely to perform on TikTok.</HelperText>
                  </div>
                  <div style={grid2}>
                    <div style={fieldWrap}>
                      <FieldLabel required>Clip Start</FieldLabel>
                      <input
                        style={showErr(!!track.touched?.tiktokStart, track.tiktokStart) ? inputErrorStyle : inputStyle}
                        value={track.tiktokStart}
                        onChange={e => updateTrack(ti, 'tiktokStart', e.target.value)}
                        onBlur={() => touchTrack(ti, 'tiktokStart')}
                        placeholder="e.g. 0:32"
                      />
                      {showErr(!!track.touched?.tiktokStart, track.tiktokStart) && <FieldError>This field is required.</FieldError>}
                    </div>
                    <div style={fieldWrap}>
                      <FieldLabel required>Clip End</FieldLabel>
                      <input
                        style={showErr(!!track.touched?.tiktokEnd, track.tiktokEnd) ? inputErrorStyle : inputStyle}
                        value={track.tiktokEnd}
                        onChange={e => updateTrack(ti, 'tiktokEnd', e.target.value)}
                        onBlur={() => touchTrack(ti, 'tiktokEnd')}
                        placeholder="e.g. 0:47"
                      />
                      {showErr(!!track.touched?.tiktokEnd, track.tiktokEnd) && <FieldError>This field is required.</FieldError>}
                    </div>
                  </div>
                </div>

                {/* Publishers + PRO */}
                <div style={groupBox}>
                  <div style={fieldWrap}>
                    <FieldLabel required>Publisher(s) Name</FieldLabel>
                    <input
                      style={showErr(!!track.touched?.publishers, track.publishers) ? inputErrorStyle : inputStyle}
                      value={track.publishers}
                      onChange={e => updateTrack(ti, 'publishers', e.target.value)}
                      onBlur={() => touchTrack(ti, 'publishers')}
                      placeholder="e.g. Sony ATV, BMG Rights Management"
                    />
                    {showErr(!!track.touched?.publishers, track.publishers) && <FieldError>This field is required.</FieldError>}
                    <HelperText>Enter all publishing entities associated with this track.</HelperText>
                  </div>
                  <div style={fieldWrap}>
                    <FieldLabel required>PRO</FieldLabel>
                    <input
                      style={showErr(!!track.touched?.pro, track.pro) ? inputErrorStyle : inputStyle}
                      value={track.pro}
                      onChange={e => updateTrack(ti, 'pro', e.target.value)}
                      onBlur={() => touchTrack(ti, 'pro')}
                      placeholder="e.g. ASCAP, BMI, SESAC"
                    />
                    {showErr(!!track.touched?.pro, track.pro) && <FieldError>This field is required.</FieldError>}
                    <p style={noteStyle}>If artist is not registered with a PRO, write "TBD".</p>
                  </div>
                </div>

                {/* Payment Splits */}
                <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 9, fontFamily: 'monospace', color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payment Splits (Default)</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: '#fff', fontWeight: 600 }}>Greater Music Group Artist Fund</p>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>payments@greaterthanhq.com</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#06B6D4' }}>80%</span>
                  </div>
                  <p style={noteStyle}>It is the artist's responsibility to distribute any further split percentages with other writers/producers.</p>
                </div>

                <CheckToggle checked={track.albumOnly} onChange={() => updateTrack(ti, 'albumOnly', !track.albumOnly)} label="Album only (not available as individual track purchase)" />
              </div>
            ))}

            <button onClick={addTrack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 12, cursor: 'pointer', background: 'rgba(6,182,212,0.06)', border: '1px dashed rgba(6,182,212,0.25)', color: '#06B6D4', fontSize: 12, fontWeight: 600 }}>
              <Plus size={13} /> Add Track
            </button>
          </div>
        )}

        {/* ─── STEP 5 — Asset Delivery ─── */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p style={sectionLabel}>05 — Asset Delivery</p>
              <p style={sectionDesc}>Upload and confirm all required assets for your release.</p>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: 9, fontFamily: 'monospace', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Asset Specifications</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Cover Art</p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>Min 1500×1500 · 3000×3000 recommended · JPG, JPEG, TIFF · RGB only</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Audio Masters</p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>WAV, AIFF/AIF, FLAC · 44.1–192kHz · 16 or 24-bit · Mono or Stereo</p>
                </div>
              </div>
            </div>

            {[
              { k: 'coverArtLink', label: 'Cover Art Link', required: true, placeholder: 'Dropbox or Drive link to cover art file', Icon: Tag },
              { k: 'audioLink', label: 'Audio Masters Link', required: true, placeholder: 'Dropbox or Drive link to audio files', Icon: Music },
              { k: 'motionArtLink', label: 'Motion Art Link', required: false, placeholder: 'Animated cover art or visualizer', Icon: BarChart2 },
              { k: 'pdfBookletLink', label: 'PDF Booklet Link', required: false, placeholder: 'Digital booklet for album/EP', Icon: FileText },
              { k: 'pressPhotosLink', label: 'Press / DSP Photos Link', required: false, placeholder: 'Official artist photos', Icon: Users },
              { k: 'videoLink', label: 'Music Video Link', required: false, placeholder: 'YouTube, Vimeo, or Drive link', Icon: Globe },
              { k: 'dropboxLink', label: 'Dropbox / Approved Asset Link', required: false, placeholder: 'Main Dropbox folder for this release', Icon: Link },
              { k: 'discoLink', label: 'DISCO Playlist Link', required: false, placeholder: 'DISCO upload or playlist link', Icon: Disc },
            ].map(item => (
              <div key={item.k} style={fieldWrap}>
                <FieldLabel required={item.required}>
                  <item.Icon size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
                  {item.label}
                </FieldLabel>
                <input
                  style={inputStyle}
                  value={(assets as unknown as Record<string, string>)[item.k]}
                  onChange={e => setA(item.k, e.target.value)}
                  placeholder={item.placeholder}
                />
              </div>
            ))}

            <div style={divider} />

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Open DISCO Upload', color: '#06B6D4' },
                { label: 'Copy GMG Upload Instructions', color: '#10B981' },
                { label: 'Save Draft & Continue Later', color: '#F59E0B' },
              ].map(btn => (
                <button key={btn.label} style={{ fontSize: 11, padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: `${btn.color}08`, border: `1px solid ${btn.color}20`, color: btn.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Upload size={10} />{btn.label}
                </button>
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: assets.assetsUploaded ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${assets.assetsUploaded ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12 }}>
              <button type="button" onClick={() => setA('assetsUploaded', !assets.assetsUploaded)} style={{ width: 22, height: 22, borderRadius: 7, border: `1px solid ${assets.assetsUploaded ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.2)'}`, background: assets.assetsUploaded ? 'rgba(16,185,129,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {assets.assetsUploaded && <CheckCircle size={14} color="#10B981" />}
              </button>
              <span style={{ fontSize: 12, color: assets.assetsUploaded ? '#10B981' : 'rgba(255,255,255,0.55)', fontWeight: assets.assetsUploaded ? 700 : 400 }}>All assets uploaded and ready for GMG review</span>
            </label>

            {/* Playlist pitch decision */}
            <div style={divider} />
            <div style={{ background: assets.pitchToPlaylists === null ? 'rgba(6,182,212,0.03)' : assets.pitchToPlaylists ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${assets.pitchToPlaylists === null ? 'rgba(6,182,212,0.15)' : assets.pitchToPlaylists ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '18px 18px' }}>
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                Would you like to pitch this product to playlists? <span style={{ color: '#EF4444' }}>*</span>
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>
                Selecting Yes adds a short pitch intake step. GMG uses this to submit to Spotify Editorial, Apple Music, and other DSPs.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setA('pitchToPlaylists', true)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, border: `1px solid ${assets.pitchToPlaylists === true ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'}`, background: assets.pitchToPlaylists === true ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)', color: assets.pitchToPlaylists === true ? '#10B981' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                >
                  {assets.pitchToPlaylists === true && <CheckCircle size={13} />}
                  Yes, pitch to playlists
                </button>
                <button
                  onClick={() => setA('pitchToPlaylists', false)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, border: `1px solid ${assets.pitchToPlaylists === false ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, background: assets.pitchToPlaylists === false ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)', color: assets.pitchToPlaylists === false ? '#EF4444' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                >
                  {assets.pitchToPlaylists === false && <CheckCircle size={13} />}
                  No, skip playlist pitch
                </button>
              </div>
              {assets.pitchToPlaylists === false && (
                <p style={noteStyle}>You can return to this step to change your selection before submitting.</p>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 6 — Playlist + DSP Pitch ─── */}
        {step === 6 && !skipPlaylist && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p style={sectionLabel}>06 — Playlist + DSP Pitch Intake</p>
              <p style={sectionDesc}>Provide details to support editorial and playlist pitching across Spotify, Apple Music, and other DSPs.</p>
            </div>

            <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Info size={13} color="#06B6D4" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    Pitch deadline: 5 weeks before release · Spotify Editorial requires 7+ days before Friday release.
                  </p>
                  {selectedDateInfo && (
                    <p style={{ margin: 0, fontSize: 11, color: '#06B6D4', fontWeight: 600 }}>
                      Your pitch deadline: {selectedDateInfo.submissionDeadlineDisplay}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GMG-locked platform fields */}
            <div>
              <p style={{ ...sectionLabel, marginBottom: 4 }}>Platform References</p>
              <p style={{ ...sectionDesc, marginBottom: 12 }}>These IDs will be filled in by GMG after your release is submitted to distribution.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={grid2}>
                  <LockedGMGField label="Spotify URI" />
                  <LockedGMGField label="Spotify URL" />
                </div>
                <div style={grid2}>
                  <LockedGMGField label="Apple Music URL" />
                  <LockedGMGField label="iTunes URL" />
                </div>
                <div style={grid2}>
                  <LockedGMGField label="Apple Album ID" />
                  <LockedGMGField label="Apple Track ID" />
                </div>
                <div style={grid2}>
                  <LockedGMGField label="SmartURL / Play Link" />
                  <div style={fieldWrap}>
                    <FieldLabel>Music Video Link</FieldLabel>
                    <input style={inputStyle} value={pitch.musicVideoInfo} onChange={e => setP('musicVideoInfo', e.target.value)} placeholder="YouTube, Vimeo, or Drive link" />
                  </div>
                </div>
              </div>
            </div>

            <div style={divider} />

            {/* Focus track */}
            <div style={fieldWrap}>
              <FieldLabel required>Track Title</FieldLabel>
              <input
                style={showErr(pitchTouched.trackTitle, pitch.trackTitle) ? inputErrorStyle : inputStyle}
                value={pitch.trackTitle}
                onChange={e => setP('trackTitle', e.target.value)}
                onBlur={() => touchP('trackTitle')}
                placeholder="Title of the focus track being pitched"
              />
              {showErr(pitchTouched.trackTitle, pitch.trackTitle) && <FieldError>This field is required.</FieldError>}
              <HelperText>If submitting for an album, pick one (1) focus track to pitch.</HelperText>
            </div>

            {/* Moods */}
            <MultiSelectChips
              label="Mood(s)"
              options={MOOD_OPTIONS}
              selected={pitch.moods}
              onChange={v => setP('moods', v)}
              required
              helper="Select all moods that apply. DSPs use this for editorial playlist matching."
            />
            {(pitchTouched.moods || submitted) && pitch.moods.length === 0 && (
              <FieldError>Please select at least one mood.</FieldError>
            )}

            <div style={fieldWrap}>
              <FieldLabel required>Instruments</FieldLabel>
              <input
                style={showErr(pitchTouched.instruments, pitch.instruments) ? inputErrorStyle : inputStyle}
                value={pitch.instruments}
                onChange={e => setP('instruments', e.target.value)}
                onBlur={() => touchP('instruments')}
                placeholder="e.g. Guitar, Drums, Synth, Piano"
              />
              {showErr(pitchTouched.instruments, pitch.instruments) && <FieldError>This field is required.</FieldError>}
            </div>

            {/* Genres */}
            <div style={groupBox}>
              <div style={grid2}>
                <div style={fieldWrap}>
                  <FieldLabel required>Focus Genre</FieldLabel>
                  <input
                    style={showErr(pitchTouched.focusGenre, pitch.focusGenre) ? inputErrorStyle : inputStyle}
                    value={pitch.focusGenre}
                    onChange={e => setP('focusGenre', e.target.value)}
                    onBlur={() => touchP('focusGenre')}
                    placeholder="Primary genre for this pitch"
                  />
                  {showErr(pitchTouched.focusGenre, pitch.focusGenre) && <FieldError>This field is required.</FieldError>}
                  <HelperText>Primary genre DSPs will use to classify this release.</HelperText>
                </div>
                <div style={fieldWrap}>
                  <FieldLabel required>Supplemental Genre 2</FieldLabel>
                  <input
                    style={showErr(pitchTouched.supplementalGenre2, pitch.supplementalGenre2) ? inputErrorStyle : inputStyle}
                    value={pitch.supplementalGenre2}
                    onChange={e => setP('supplementalGenre2', e.target.value)}
                    onBlur={() => touchP('supplementalGenre2')}
                    placeholder="e.g. Emo, Alternative"
                  />
                  {showErr(pitchTouched.supplementalGenre2, pitch.supplementalGenre2) && <FieldError>This field is required.</FieldError>}
                  <HelperText>Additional genres to improve discoverability.</HelperText>
                </div>
              </div>
            </div>

            {/* Music Culture */}
            <MultiSelectChips
              label="Music Culture"
              options={MUSIC_CULTURE_OPTIONS}
              selected={pitch.musicCulture}
              onChange={v => setP('musicCulture', v)}
              helper="Select any cultural contexts relevant to this release."
            />

            <div style={fieldWrap}>
              <FieldLabel>For Fans Of</FieldLabel>
              <input style={inputStyle} value={pitch.forFansOf} onChange={e => setP('forFansOf', e.target.value)} placeholder="e.g. Jimmy Eat World, Yellowcard, Fall Out Boy" />
              <HelperText>Comparable artists that share your audience.</HelperText>
            </div>

            {/* Pitch text fields */}
            <div style={fieldWrap}>
              <FieldLabel required>Elevator Pitch / Mini Bio</FieldLabel>
              <textarea
                style={{ ...(showErr(pitchTouched.elevatorPitch, pitch.elevatorPitch) ? inputErrorStyle : inputStyle), minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
                value={pitch.elevatorPitch}
                onChange={e => { if (e.target.value.length <= 500) setP('elevatorPitch', e.target.value); }}
                onBlur={() => touchP('elevatorPitch')}
                placeholder="Short pitch to playlist editors — explain the song, the artist, and why now."
                maxLength={500}
              />
              {showErr(pitchTouched.elevatorPitch, pitch.elevatorPitch) && <FieldError>This field is required.</FieldError>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={helperStyle}>Keep it concise and editorial-focused. Max 500 characters.</span>
                <span style={{ ...helperStyle, color: pitch.elevatorPitch.length > 450 ? '#F59E0B' : undefined }}>{pitch.elevatorPitch.length}/500</span>
              </div>
            </div>

            <div style={fieldWrap}>
              <FieldLabel required>Cultural Positioning</FieldLabel>
              <textarea
                style={{ ...(showErr(pitchTouched.culturalPositioning, pitch.culturalPositioning) ? inputErrorStyle : inputStyle), minHeight: 70, resize: 'vertical', lineHeight: 1.6 }}
                value={pitch.culturalPositioning}
                onChange={e => { if (e.target.value.length <= 300) setP('culturalPositioning', e.target.value); }}
                onBlur={() => touchP('culturalPositioning')}
                placeholder="How does this song fit the current cultural moment?"
                maxLength={300}
              />
              {showErr(pitchTouched.culturalPositioning, pitch.culturalPositioning) && <FieldError>This field is required.</FieldError>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={helperStyle}>How this release fits culturally or within a scene or movement.</span>
                <span style={{ ...helperStyle, color: pitch.culturalPositioning.length > 260 ? '#F59E0B' : undefined }}>{pitch.culturalPositioning.length}/300</span>
              </div>
            </div>

            <div style={fieldWrap}>
              <FieldLabel required>Quote About the Song</FieldLabel>
              <textarea
                style={{ ...(showErr(pitchTouched.quoteAboutSong, pitch.quoteAboutSong) ? inputErrorStyle : inputStyle), minHeight: 60, resize: 'vertical', lineHeight: 1.6 }}
                value={pitch.quoteAboutSong}
                onChange={e => setP('quoteAboutSong', e.target.value)}
                onBlur={() => touchP('quoteAboutSong')}
                placeholder='e.g. "This song is about the night everything changed..." — Artist Name'
              />
              {showErr(pitchTouched.quoteAboutSong, pitch.quoteAboutSong) && <FieldError>This field is required.</FieldError>}
              <HelperText>Artist quote describing the meaning or story behind the track. Max 2 sentences.</HelperText>
            </div>

            <div style={divider} />

            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel>Spotify Playlist Targets</FieldLabel>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', lineHeight: 1.6 }} value={pitch.spotifyPlaylists} onChange={e => setP('spotifyPlaylists', e.target.value)} placeholder="e.g. All Out 2000s, Rock Anthems..." />
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Apple Music Playlist Targets</FieldLabel>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', lineHeight: 1.6 }} value={pitch.applePlaylists} onChange={e => setP('applePlaylists', e.target.value)} />
              </div>
            </div>
            <div style={fieldWrap}>
              <FieldLabel>Press + Radio Targets</FieldLabel>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', lineHeight: 1.6 }} value={pitch.pressTargets} onChange={e => setP('pressTargets', e.target.value)} placeholder="Key publications, blogs, stations..." />
            </div>
            <div style={fieldWrap}>
              <FieldLabel>Marketing Plan Timeline</FieldLabel>
              <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical', lineHeight: 1.6 }} value={pitch.marketingPlan} onChange={e => setP('marketingPlan', e.target.value)} placeholder="Week-by-week release plan overview..." />
            </div>
            <div style={grid2}>
              <div style={fieldWrap}>
                <FieldLabel>Overall Marketing Budget</FieldLabel>
                <input style={inputStyle} value={pitch.budget} onChange={e => setP('budget', e.target.value)} placeholder="e.g. $15,000" />
              </div>
              <div style={fieldWrap}>
                <FieldLabel>Top Focus Territories</FieldLabel>
                <input style={inputStyle} value={pitch.focusTerritories} onChange={e => setP('focusTerritories', e.target.value)} placeholder="e.g. US, UK, Brazil, Australia" />
              </div>
            </div>
            <div style={fieldWrap}>
              <FieldLabel>Touring Highlights</FieldLabel>
              <input style={inputStyle} value={pitch.touringHighlights} onChange={e => setP('touringHighlights', e.target.value)} placeholder="Any upcoming tour dates supporting this release" />
            </div>
          </div>
        )}

        {/* ─── REVIEW + SUBMIT ─── */}
        {step === reviewStep && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={sectionLabel}>0{reviewStep} — Review + Submit</p>
              <p style={sectionDesc}>Review your submission before sending it to the GMG team.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Metadata Score', score: metadataScore, color: metadataScore >= 80 ? '#10B981' : metadataScore >= 50 ? '#F59E0B' : '#EF4444' },
                { label: 'Assets Score', score: assetsScore, color: assetsScore >= 80 ? '#10B981' : assetsScore >= 50 ? '#F59E0B' : '#EF4444' },
                { label: 'Marketing Score', score: marketingScore, color: marketingScore >= 80 ? '#10B981' : marketingScore >= 50 ? '#F59E0B' : '#EF4444' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${s.color}20`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.score}%</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Release Summary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Title', value: basics.title || '—' },
                  { label: 'Type', value: basics.type },
                  { label: 'Artist', value: ARTIST_NAME },
                  { label: 'Label', value: LABEL_NAME },
                  { label: 'Release Date', value: selectedDateInfo?.display || '—' },
                  { label: 'Submission Deadline', value: selectedDateInfo?.submissionDeadlineDisplay || '—' },
                  { label: 'Assigned Rep', value: 'Randy Jackson' },
                  { label: 'Tracks', value: tracks.length.toString() },
                  { label: 'Playlist Pitch', value: assets.pitchToPlaylists === null ? '—' : assets.pitchToPlaylists ? 'Yes' : 'No' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {blockers.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 9, fontFamily: 'monospace', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Open Blockers ({blockers.length})</p>
                {blockers.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                    <AlertTriangle size={10} color="#EF4444" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{b}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>System Disposition</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: blockers.length === 0 ? '#10B981' : '#F59E0B' }}>{disposition}</p>
              </div>
              <Shield size={20} color={blockers.length === 0 ? '#10B981' : '#F59E0B'} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <Save size={12} /> Save Draft
              </button>
              {blockers.length > 0 ? (
                <button onClick={() => setSubmitted(true)} style={{ flex: 2, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Mic2 size={12} /> Submit to Artist OS Reps
                </button>
              ) : (
                <button onClick={onClose} style={{ flex: 2, fontSize: 12, padding: '11px', borderRadius: 10, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Send size={12} /> Mark Ready for Internal Review
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '9px 18px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              <ChevronLeft size={13} /> Back
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => {
                if (step === 5 && assets.pitchToPlaylists === null) return;
                setStep(s => s + 1);
              }}
              disabled={step === 5 && assets.pitchToPlaylists === null}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '9px 22px', borderRadius: 9, fontWeight: 700,
                cursor: step === 5 && assets.pitchToPlaylists === null ? 'not-allowed' : 'pointer',
                background: step === 5 && assets.pitchToPlaylists === null ? 'rgba(255,255,255,0.04)' : 'rgba(6,182,212,0.12)',
                border: `1px solid ${step === 5 && assets.pitchToPlaylists === null ? 'rgba(255,255,255,0.08)' : 'rgba(6,182,212,0.35)'}`,
                color: step === 5 && assets.pitchToPlaylists === null ? 'rgba(255,255,255,0.2)' : '#06B6D4',
              }}
            >
              {step === 5 && assets.pitchToPlaylists === null ? 'Answer above to continue' : 'Continue'}
              {!(step === 5 && assets.pitchToPlaylists === null) && <ChevronRight size={13} />}
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
