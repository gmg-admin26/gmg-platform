import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Sparkles, Camera, Star, ChefHat, Users, Trophy } from 'lucide-react';

const S = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'system-ui, -apple-system, sans-serif',
  green: '#5C7A4E',
  darkGreen: '#2A3D1F',
  cream: '#FAFAF7',
  ivory: '#F5F0E8',
  peach: '#E8A87C',
  tomato: '#C94A2A',
  sage: '#8A9E7A',
  muted: '#6B7B5A',
};

function GalleryPlaceholder({ label, icon: Icon, aspect = '1/1', accent = S.green, size = 'md' }: {
  label: string; icon?: typeof Utensils; aspect?: string; accent?: string; size?: 'sm' | 'md' | 'lg';
}) {
  const IconComp = Icon ?? Utensils;
  const iconSize = size === 'lg' ? 36 : size === 'md' ? 28 : 20;
  return (
    <div style={{
      aspectRatio: aspect,
      background: `linear-gradient(145deg, ${accent}10 0%, ${accent}06 100%)`,
      border: `1.5px dashed ${accent}28`, borderRadius: 18,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ width: iconSize * 1.8, height: iconSize * 1.8, borderRadius: '50%', background: `${accent}12`, border: `1.5px solid ${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconComp style={{ color: accent, width: iconSize, height: iconSize }} />
      </div>
      <p style={{ fontFamily: S.sans, fontSize: 11, color: `${accent}60`, textAlign: 'center', maxWidth: 130, lineHeight: 1.5, padding: '0 8px' }}>{label}</p>
    </div>
  );
}

type Year = '2024' | '2025' | '2026';

const GALLERY_2024 = [
  { label: 'Prep station — class 1',     icon: Utensils,  aspect: '4/3', accent: S.green  },
  { label: 'Team cooking together',      icon: Users,     aspect: '1/1', accent: S.green  },
  { label: 'Chef Cheryl teaching',       icon: ChefHat,   aspect: '3/4', accent: S.green  },
  { label: 'Knife skills practice',      icon: Utensils,  aspect: '1/1', accent: S.sage   },
  { label: 'Friday Flavor Finale 2024',  icon: Trophy,    aspect: '4/3', accent: S.peach  },
  { label: 'Plated dishes showcase',     icon: Star,      aspect: '1/1', accent: S.green  },
  { label: 'Students at work',           icon: Utensils,  aspect: '3/2', accent: S.green  },
  { label: 'Team celebration',           icon: Users,     aspect: '1/1', accent: S.sage   },
  { label: 'Beautiful finished dish',    icon: Star,      aspect: '4/3', accent: S.peach  },
];

const GALLERY_2025 = [
  { label: 'Week 1 first day energy',    icon: Sparkles,  aspect: '4/3', accent: S.peach  },
  { label: 'Baking together',            icon: Utensils,  aspect: '1/1', accent: S.peach  },
  { label: 'Chef Cheryl and students',   icon: ChefHat,   aspect: '3/4', accent: S.sage   },
  { label: 'Ingredient prep station',    icon: Utensils,  aspect: '1/1', accent: S.peach  },
  { label: 'Friday Flavor Finale 2025',  icon: Trophy,    aspect: '4/3', accent: S.tomato },
  { label: 'Tasting the results',        icon: Star,      aspect: '1/1', accent: S.peach  },
  { label: 'Team plating showcase',      icon: Users,     aspect: '3/2', accent: S.peach  },
  { label: 'Student pride moment',       icon: Star,      aspect: '1/1', accent: S.sage   },
  { label: 'Kitchen in full swing',      icon: Utensils,  aspect: '4/3', accent: S.green  },
];

const PLACEHOLDERS_2026 = [
  { label: 'Summer 2026 memories coming soon',             icon: Sparkles },
  { label: 'Behind-the-scenes photos added weekly',        icon: Camera   },
  { label: 'Team moments and collaboration shots',         icon: Users    },
  { label: 'Friday Flavor Finale 2026 highlights',         icon: Trophy   },
  { label: 'Beautiful dishes and student creations',       icon: Star     },
  { label: 'Chef Cheryl + young chefs in action',          icon: ChefHat  },
];

export default function CCGallery() {
  const [activeYear, setActiveYear] = useState<Year>('2025');

  return (
    <div style={{ background: S.cream }}>

      {/* Header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Photo Gallery</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 18, lineHeight: 1.1 }}>
            From Our Kitchen to Yours
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Take a look at moments from Chef Cheryl's summer cooking adventures — where young chefs learn, create, collaborate, and celebrate.
          </p>
        </div>
      </section>

      {/* Year tabs */}
      <section style={{ padding: '40px 0 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {([
              { year: '2024' as Year, label: 'Summer 2024', color: S.green  },
              { year: '2025' as Year, label: 'Summer 2025', color: S.peach  },
              { year: '2026' as Year, label: 'Summer 2026 — Coming Soon', color: S.tomato },
            ] as const).map(tab => (
              <button
                key={tab.year}
                onClick={() => setActiveYear(tab.year)}
                style={{
                  padding: '11px 24px', borderRadius: 50, cursor: 'pointer',
                  fontFamily: S.sans, fontSize: 14, fontWeight: 600,
                  border: `1.5px solid ${activeYear === tab.year ? tab.color : 'rgba(92,122,78,0.15)'}`,
                  background: activeYear === tab.year ? `${tab.color}12` : 'transparent',
                  color: activeYear === tab.year ? tab.color : S.muted,
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery content */}
      <section style={{ padding: '50px 0 100px' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {activeYear === '2024' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.green }} />
                <h2 style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 700, color: S.darkGreen }}>Summer 2024</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {GALLERY_2024.map((item, i) => (
                  <GalleryPlaceholder key={i} label={item.label} icon={item.icon} aspect={item.aspect} accent={item.accent} />
                ))}
              </div>
              <div style={{ marginTop: 24, padding: '20px 24px', background: `${S.green}08`, border: `1px solid ${S.green}18`, borderRadius: 16 }}>
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>
                  <strong style={{ color: S.darkGreen }}>Summer 2024</strong> — Replace these placeholders with actual class photos when available. Photos should be uploaded with captions.
                </p>
              </div>
            </div>
          )}

          {activeYear === '2025' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.peach }} />
                <h2 style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 700, color: S.darkGreen }}>Summer 2025</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {GALLERY_2025.map((item, i) => (
                  <GalleryPlaceholder key={i} label={item.label} icon={item.icon} aspect={item.aspect} accent={item.accent} />
                ))}
              </div>
              <div style={{ marginTop: 24, padding: '20px 24px', background: `${S.peach}10`, border: `1px solid ${S.peach}25`, borderRadius: 16 }}>
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>
                  <strong style={{ color: S.darkGreen }}>Summer 2025</strong> — Replace these placeholders with actual class photos when available.
                </p>
              </div>
            </div>
          )}

          {activeYear === '2026' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: S.tomato }} />
                <h2 style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 700, color: S.darkGreen }}>Summer 2026</h2>
              </div>
              <div style={{ marginBottom: 32, padding: '20px 24px', background: `${S.tomato}08`, border: `1.5px solid ${S.tomato}20`, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                <Sparkles style={{ color: S.tomato, width: 22, height: 22, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 700, color: S.darkGreen }}>Season starts June 15, 2026</p>
                  <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>New class photos will be added here throughout the summer — behind-the-scenes, dishes, team moments, and Friday Flavor Finale highlights.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {PLACEHOLDERS_2026.map((item, i) => (
                  <GalleryPlaceholder key={i} label={item.label} icon={item.icon} aspect="1/1" accent={S.tomato} size="lg" />
                ))}
              </div>
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Link to="/chef-cheryl/reserve" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: S.tomato, color: '#fff',
                  fontFamily: S.sans, fontSize: 15, fontWeight: 700,
                  padding: '14px 32px', borderRadius: 50, textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(201,74,42,0.3)',
                }}>
                  <Star style={{ width: 17, height: 17 }} />
                  Reserve Your Spot for Summer 2026
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
