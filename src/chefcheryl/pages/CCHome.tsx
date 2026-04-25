import { Link } from 'react-router-dom';
import {
  ChefHat, Star, Calendar, Users, Clock, Package,
  Utensils, Scissors, Shield, Trophy, Heart, ChevronRight,
  Sparkles, Leaf, ArrowRight,
} from 'lucide-react';
import { ENROLLMENT_OPEN, WEEKS } from '../config';

// Reusable style tokens
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
  text: '#2A3D1F',
  muted: '#6B7B5A',
};

function CTAButton({ to, children, variant = 'primary', size = 'md' }: { to: string; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'tomato'; size?: 'md' | 'lg' }) {
  const bg = variant === 'tomato' ? S.tomato : variant === 'primary' ? S.green : 'transparent';
  const color = variant === 'secondary' ? S.green : '#FFF8F0';
  const border = variant === 'secondary' ? `2px solid ${S.green}` : 'none';
  const shadow = variant === 'tomato' ? '0 6px 24px rgba(201,74,42,0.3)' : variant === 'primary' ? '0 6px 24px rgba(92,122,78,0.3)' : 'none';
  const px = size === 'lg' ? '32px' : '22px';
  const py = size === 'lg' ? '16px' : '12px';
  const fs = size === 'lg' ? 17 : 14;

  return (
    <Link to={to} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: bg, color, border, borderRadius: 50,
      fontFamily: S.sans, fontSize: fs, fontWeight: 700,
      padding: `${py} ${px}`, textDecoration: 'none',
      boxShadow: shadow, letterSpacing: '0.01em',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {children}
    </Link>
  );
}

function ImagePlaceholder({ label, aspect = '4/3', accent = S.green }: { label: string; aspect?: string; accent?: string }) {
  return (
    <div style={{
      aspectRatio: aspect, background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
      border: `1.5px dashed ${accent}30`, borderRadius: 20,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}15`, border: `1.5px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Utensils style={{ color: accent, width: 22, height: 22 }} />
      </div>
      <p style={{ fontFamily: S.sans, fontSize: 12, color: `${accent}70`, textAlign: 'center', maxWidth: 120, lineHeight: 1.5 }}>{label}</p>
    </div>
  );
}

const TESTIMONIALS = [
  {
    text: '[Placeholder] My daughter came home every day excited to tell us what she made. Chef Cheryl has a gift for making every kid feel capable and confident.',
    name: 'Parent — Summer 2025 student',
    stars: 5,
  },
  {
    text: '[Placeholder] My son had never cooked before and by the end of the week he was making dinner for the family. Incredible program.',
    name: 'Parent — Summer 2025 student',
    stars: 5,
  },
  {
    text: '[Placeholder] Chef Cheryl creates an environment where kids feel safe to try new things. The Friday Flavor Finale was a highlight every single week.',
    name: 'Parent — Summer 2024 & 2025 student',
    stars: 5,
  },
  {
    text: "[Placeholder] Worth every penny. My kids came back with real kitchen skills and a completely different relationship with food.",
    name: 'Parent — Summer 2024 student',
    stars: 5,
  },
];

export default function CCHome() {
  return (
    <div style={{ background: S.cream }}>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(165deg, ${S.darkGreen} 0%, #3A5A2A 60%, #4A7A38 100%)`, position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.025)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50, padding: '8px 18px', marginBottom: 28 }}>
              <Sparkles style={{ color: S.peach, width: 14, height: 14 }} />
              <span style={{ fontFamily: S.sans, fontSize: 12, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Summer 2026 Now Open for Reservations</span>
            </div>

            <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 700, color: '#FEFDF8', lineHeight: 1.1, marginBottom: 24 }}>
              Summer Cooking Adventures<br />
              <em style={{ color: S.peach }}>for Young Chefs</em>
            </h1>

            <p style={{ fontFamily: S.sans, fontSize: 19, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 16, maxWidth: 520 }}>
              A premium hands-on cooking experience where kids build skills, confidence, teamwork, and creativity in the kitchen.
            </p>
            <p style={{ fontFamily: S.sans, fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Chef Cheryl's summer cooking classes are designed for elementary and middle school students who want to learn real kitchen skills in a fun, encouraging, team-based environment.
            </p>

            <div className="flex flex-wrap gap-3">
              <CTAButton to="/chef-cheryl/reserve" variant={ENROLLMENT_OPEN ? 'tomato' : 'tomato'} size="lg">
                <Star style={{ width: 18, height: 18 }} />
                {ENROLLMENT_OPEN ? 'Enroll Now' : 'Reserve Your Spot'}
              </CTAButton>
              <Link to="/chef-cheryl/classes" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 50,
                fontFamily: S.sans, fontSize: 17, fontWeight: 600,
                padding: '16px 32px', textDecoration: 'none',
              }}>
                Explore Summer 2026 <ChevronRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>

            {!ENROLLMENT_OPEN && (
              <p style={{ fontFamily: S.sans, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
                No payment due at this stage. &nbsp;·&nbsp; Enrollment opens May 1, 2026.
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-10">
              {[
                '8-week summer program',
                'Weekly registration',
                'Morning & afternoon',
                '$300/week per child',
                'All supplies included',
              ].map(b => (
                <span key={b} style={{
                  fontFamily: S.sans, fontSize: 12, fontWeight: 500,
                  background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 50,
                  padding: '6px 14px',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Hero image placeholder */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1.5px dashed rgba(255,255,255,0.18)',
              borderRadius: 28, aspectRatio: '4/3',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChefHat style={{ color: S.peach, width: 40, height: 40 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: S.sans, fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Chef Cheryl Hero Photo</p>
                <p style={{ fontFamily: S.sans, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Class action shot goes here</p>
              </div>
            </div>
            {/* Floating accent card */}
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              background: S.peach, borderRadius: 18, padding: '16px 22px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            }}>
              <div style={{ fontFamily: S.sans, fontSize: 28, fontWeight: 800, color: S.darkGreen, lineHeight: 1 }}>8</div>
              <div style={{ fontFamily: S.sans, fontSize: 12, color: S.darkGreen, opacity: 0.7, marginTop: 2 }}>weeks of fun</div>
            </div>
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: '#FFF8F0', borderRadius: 18, padding: '14px 20px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            }}>
              <div style={{ fontFamily: S.sans, fontSize: 22, fontWeight: 800, color: S.tomato, lineHeight: 1 }}>$300</div>
              <div style={{ fontFamily: S.sans, fontSize: 11, color: S.muted, marginTop: 2 }}>per week / child</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAM SNAPSHOT ── */}
      <section style={{ background: S.ivory, padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>What to expect</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: S.darkGreen }}>Where Young Chefs Learn by Doing</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Calendar,  title: 'Weekly Enrollment',     body: 'Sign up one week at a time — choose the weeks that work for your family\'s summer.',         color: S.green  },
              { icon: Utensils,  title: 'Hands-On Learning',     body: 'Prep, cooking, plating, and tasting. Students are in the kitchen from day one.',              color: S.peach  },
              { icon: Scissors,  title: 'Real Kitchen Skills',   body: 'Knife skills, food safety, kitchen organization, teamwork, and growing confidence.',          color: S.tomato },
              { icon: Trophy,    title: 'Friday Flavor Finale',  body: 'Every Friday ends with a celebration where students present the week\'s creations.',          color: S.green  },
            ].map(card => (
              <div key={card.title} style={{ background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)', borderRadius: 22, padding: '28px 24px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                className="hover:shadow-lg hover:-translate-y-1">
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${card.color}14`, border: `1.5px solid ${card.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <card.icon style={{ color: card.color, width: 24, height: 24 }} />
                </div>
                <h3 style={{ fontFamily: S.serif, fontSize: 19, fontWeight: 700, color: S.darkGreen, marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.65 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUMMER 2026 HIGHLIGHT ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Summer 2026</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: S.darkGreen, lineHeight: 1.15, marginBottom: 20 }}>
              Eight Weeks of Skill-Building, Creativity, <em style={{ color: S.green }}>and Fun</em>
            </h2>
            <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, lineHeight: 1.75, marginBottom: 28 }}>
              Each week gives young chefs the chance to create, collaborate, and grow in confidence while learning practical kitchen techniques they can carry with them for life.
            </p>

            {/* Mini week preview */}
            <div style={{ background: S.ivory, borderRadius: 18, padding: '20px 24px', marginBottom: 28, border: '1.5px solid rgba(92,122,78,0.1)' }}>
              <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>Quick Schedule Preview</p>
              <div className="space-y-2">
                {WEEKS.slice(0, 4).map((w, i) => (
                  <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: S.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: S.sans, fontSize: 11, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: S.sans, fontSize: 13, color: S.muted }}>{w.dates}</span>
                  </div>
                ))}
                <div style={{ fontFamily: S.sans, fontSize: 12, color: S.sage, paddingLeft: 40, paddingTop: 4 }}>+ 4 more weeks through August 7</div>
              </div>
            </div>

            <Link to="/chef-cheryl/classes" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: S.sans, fontSize: 15, fontWeight: 600, color: S.green,
              textDecoration: 'none', borderBottom: `2px solid ${S.green}`, paddingBottom: 2,
            }}>
              View full 8-week schedule <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <ImagePlaceholder label="Kids cooking in action" accent={S.green} />
            <ImagePlaceholder label="Team plating dishes" accent={S.peach} />
            <ImagePlaceholder label="Chef Cheryl teaching" aspect="3/2" accent={S.tomato} />
            <ImagePlaceholder label="Friday Flavor Finale" aspect="3/2" accent={S.green} />
          </div>
        </div>
      </section>

      {/* ── WHAT KIDS LEARN ── */}
      <section style={{ background: S.darkGreen, padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>Curriculum highlights</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#FEFDF8', lineHeight: 1.15 }}>Real Skills. Real Confidence.<br /><em style={{ color: S.peach }}>Real Fun.</em></h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Leaf,     title: 'Ingredient Prep',        body: 'Washing, cutting, measuring, and organizing fresh ingredients.' },
              { icon: Scissors, title: 'Knife Skills',           body: 'Age-appropriate knife techniques with safety as the foundation.'  },
              { icon: Shield,   title: 'Food Safety',            body: 'Cross-contamination, storage, temperature, and hygiene basics.'  },
              { icon: ChefHat,  title: 'Kitchen Organization',   body: 'Station setup, mise en place, and keeping a clean workspace.'     },
              { icon: Users,    title: 'Teamwork',               body: 'Collaborative cooking, communication, and shared responsibility.' },
              { icon: Star,     title: 'Tasting & Plating',      body: 'Presenting food with care, creativity, and confidence.'           },
              { icon: Utensils, title: 'Following Recipes',      body: 'Reading, understanding, and executing a recipe step by step.'     },
              { icon: Trophy,   title: 'Kitchen Confidence',     body: 'Students leave each week feeling capable, proud, and excited.'    },
            ].map(item => (
              <div key={item.title} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '24px 20px',
                transition: 'background 0.2s',
              }} className="hover:bg-white/10">
                <item.icon style={{ color: S.peach, width: 24, height: 24, marginBottom: 14 }} />
                <h3 style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: '#FEFDF8', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontFamily: S.sans, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRIDAY FLAVOR FINALE ── */}
      <section style={{ background: S.ivory, padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div style={{ aspectRatio: '4/3' }}>
            <ImagePlaceholder label="Friday Flavor Finale celebration photo" accent={S.tomato} aspect="4/3" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${S.tomato}14`, border: `1px solid ${S.tomato}25`, borderRadius: 50, padding: '8px 18px', marginBottom: 20 }}>
              <Trophy style={{ color: S.tomato, width: 14, height: 14 }} />
              <span style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.tomato, fontWeight: 600 }}>Every Friday</span>
            </div>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: S.darkGreen, lineHeight: 1.15, marginBottom: 20 }}>
              The <em style={{ color: S.tomato }}>Friday Flavor Finale</em>
            </h2>
            <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, lineHeight: 1.75, marginBottom: 20 }}>
              Each Friday ends with our <strong style={{ color: S.darkGreen }}>Friday Flavor Finale</strong> — a fun team-based culmination where students present what they learned, celebrate their progress, and show off new skills and dishes from the week.
            </p>
            <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, lineHeight: 1.7, marginBottom: 28 }}>
              It's the highlight of the week — a moment of pride, joy, and community that students and families look forward to every session.
            </p>
            <CTAButton to="/chef-cheryl/classes" variant="primary">
              See the full schedule <ChevronRight style={{ width: 16, height: 16 }} />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>From the kitchen</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: S.darkGreen }}>Moments from Past Classes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* 2024 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.green }} />
                <span style={{ fontFamily: S.sans, fontSize: 13, fontWeight: 600, color: S.darkGreen, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Summer 2024</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <ImagePlaceholder key={i} label={`2024 class photo ${i}`} aspect="1/1" accent={S.green} />
                ))}
              </div>
            </div>

            {/* 2025 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.peach }} />
                <span style={{ fontFamily: S.sans, fontSize: 13, fontWeight: 600, color: S.darkGreen, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Summer 2025</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <ImagePlaceholder key={i} label={`2025 class photo ${i}`} aspect="1/1" accent={S.peach} />
                ))}
              </div>
            </div>

            {/* 2026 coming soon */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: S.tomato }} />
                <span style={{ fontFamily: S.sans, fontSize: 13, fontWeight: 600, color: S.darkGreen, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Summer 2026</span>
              </div>
              <div style={{ background: `${S.tomato}08`, border: `1.5px dashed ${S.tomato}25`, borderRadius: 20, padding: '32px 20px', textAlign: 'center', aspectRatio: '1/1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Sparkles style={{ color: S.tomato, width: 32, height: 32 }} />
                <p style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 700, color: S.darkGreen }}>Coming Soon</p>
                <p style={{ fontFamily: S.sans, fontSize: 13, color: S.muted, lineHeight: 1.6 }}>Summer 2026 memories will be added as the season unfolds.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <CTAButton to="/chef-cheryl/gallery" variant="secondary">
              View Full Gallery <ArrowRight style={{ width: 16, height: 16 }} />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: S.ivory, padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>What families say</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: S.darkGreen }}>Parents Love It. Kids Can't Wait to Come Back.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)',
                borderRadius: 22, padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(42,61,31,0.05)',
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, si) => (
                    <Star key={si} style={{ color: S.peach, width: 16, height: 16, fill: S.peach }} />
                  ))}
                </div>
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.7, marginBottom: 18 }}>"{t.text}"</p>
                <p style={{ fontFamily: S.sans, fontSize: 12, color: S.sage, fontWeight: 600 }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: `linear-gradient(135deg, ${S.green} 0%, ${S.darkGreen} 100%)`, padding: '100px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 50, padding: '8px 18px', marginBottom: 24 }}>
            <Heart style={{ color: S.peach, width: 14, height: 14, fill: S.peach }} />
            <span style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Classes fill fast</span>
          </div>
          <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 20 }}>Spots Go Fast</h2>
          <p style={{ fontFamily: S.sans, fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 36 }}>
            Reserve your child's spot now to get priority notification when enrollment opens on May 1, 2026. No payment due at this stage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/chef-cheryl/reserve" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: S.peach, color: S.darkGreen,
              fontFamily: S.sans, fontSize: 18, fontWeight: 700,
              padding: '18px 40px', borderRadius: 50, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              letterSpacing: '0.01em',
            }}>
              <Star style={{ width: 20, height: 20 }} />
              Reserve Your Spot
            </Link>
          </div>
          <p style={{ fontFamily: S.sans, fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 20 }}>
            A summer experience they'll remember long after the last bite.
          </p>
        </div>
      </section>

    </div>
  );
}
