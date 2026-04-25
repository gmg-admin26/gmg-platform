import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, DollarSign, Package, Users, Trophy,
  Utensils, Scissors, Shield, ChefHat, Star, ChevronRight, CheckCircle,
} from 'lucide-react';
import { ENROLLMENT_OPEN, WEEKS, SESSIONS, PRICE_PER_WEEK } from '../config';

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

export default function CCClasses() {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <div style={{ background: S.cream }}>

      {/* Page header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Summer 2026 Program</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 20, lineHeight: 1.1 }}>
            Summer 2026 Cooking Classes
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px' }}>
            Join Chef Cheryl for a summer of hands-on cooking, learning, teamwork, and fun. Families can register one week at a time, making it easy to build a schedule that works.
          </p>
          <Link to="/chef-cheryl/reserve" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: ENROLLMENT_OPEN ? S.tomato : S.peach, color: S.darkGreen,
            fontFamily: S.sans, fontSize: 16, fontWeight: 700,
            padding: '14px 32px', borderRadius: 50, textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
          }}>
            <Star style={{ width: 18, height: 18 }} />
            {ENROLLMENT_OPEN ? 'Enroll Now' : 'Reserve Your Spot'}
          </Link>
        </div>
      </section>

      {/* Program details */}
      <section style={{ padding: '60px 0', background: S.ivory }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Calendar,   label: 'Start Date',       value: 'June 15, 2026',      color: S.green  },
              { icon: Clock,      label: 'Program Length',   value: '8 Weeks',            color: S.peach  },
              { icon: Clock,      label: 'Morning Session',  value: '9:00 AM – 12:30 PM', color: S.green  },
              { icon: Clock,      label: 'Afternoon Session',value: '1:00 PM – 4:00 PM',  color: S.peach  },
              { icon: DollarSign, label: 'Weekly Tuition',   value: '$300 / Child',        color: S.tomato },
              { icon: Package,    label: 'Supplies',         value: 'All Included',        color: S.green  },
              { icon: Calendar,   label: 'Enrollment Opens', value: 'May 1, 2026',        color: S.tomato },
              { icon: Users,      label: 'Availability',     value: 'First Come, First Served', color: S.green },
            ].map(item => (
              <div key={item.label} style={{
                background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)',
                borderRadius: 18, padding: '20px 18px',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}14`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <item.icon style={{ color: item.color, width: 20, height: 20 }} />
                </div>
                <p style={{ fontFamily: S.sans, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: S.darkGreen }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly schedule */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 12 }}>8-week program</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 700, color: S.darkGreen }}>Choose Your Week</h2>
            <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, marginTop: 12 }}>
              Register one week at a time — mix and match sessions that fit your summer.
            </p>
          </div>

          <div className="space-y-4">
            {WEEKS.map((week, i) => (
              <div key={week.id}
                style={{
                  background: selectedWeek === week.id ? `${S.green}08` : '#FAFAF7',
                  border: `1.5px solid ${selectedWeek === week.id ? S.green : 'rgba(92,122,78,0.12)'}`,
                  borderRadius: 22, overflow: 'hidden',
                  transition: 'all 0.2s', cursor: 'pointer',
                  boxShadow: selectedWeek === week.id ? `0 8px 30px ${S.green}18` : '0 2px 12px rgba(42,61,31,0.05)',
                }}
                onClick={() => setSelectedWeek(week.id === selectedWeek ? null : week.id)}
              >
                <div className="flex items-center gap-4 px-6 py-5">
                  {/* Week number */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: selectedWeek === week.id ? S.green : `${S.green}14`,
                    border: `1.5px solid ${selectedWeek === week.id ? S.green : `${S.green}25`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 700, color: selectedWeek === week.id ? '#fff' : S.green }}>{i + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 700, color: S.darkGreen }}>{week.label}</h3>
                      <span style={{ fontFamily: S.sans, fontSize: 13, color: S.muted }}>{week.dates}</span>
                    </div>
                    <p style={{ fontFamily: S.sans, fontSize: 12, color: S.sage, marginTop: 4 }}>
                      Teams, skills, recipes, and Friday Flavor Finale included &nbsp;·&nbsp; Theme announcement coming soon
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-4">
                    {SESSIONS.map(session => (
                      <div key={session.id} style={{
                        background: `${S.green}0A`, border: `1px solid ${S.green}20`,
                        borderRadius: 10, padding: '8px 14px',
                        textAlign: 'center',
                      }}>
                        <p style={{ fontFamily: S.sans, fontSize: 11, fontWeight: 600, color: S.green }}>{session.label}</p>
                        <p style={{ fontFamily: S.sans, fontSize: 11, color: S.sage }}>{session.time}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/chef-cheryl/reserve"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: ENROLLMENT_OPEN ? S.tomato : S.green,
                      color: '#fff', fontFamily: S.sans, fontSize: 13, fontWeight: 600,
                      padding: '10px 20px', borderRadius: 50, textDecoration: 'none',
                      flexShrink: 0, whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    }}
                  >
                    {ENROLLMENT_OPEN ? 'Enroll' : 'Reserve'}
                  </Link>
                </div>

                {selectedWeek === week.id && (
                  <div style={{ borderTop: `1px solid ${S.green}18`, padding: '20px 24px', background: `${S.green}05` }}>
                    <div className="sm:hidden flex flex-wrap gap-3 mb-4">
                      {SESSIONS.map(session => (
                        <div key={session.id} style={{
                          background: `${S.green}0A`, border: `1px solid ${S.green}20`,
                          borderRadius: 10, padding: '8px 14px',
                        }}>
                          <p style={{ fontFamily: S.sans, fontSize: 11, fontWeight: 600, color: S.green }}>{session.label}: {session.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Hands-on prep & cooking', 'Knife skills practice', 'Food safety instruction', 'Friday Flavor Finale'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle style={{ color: S.green, width: 14, height: 14, flexShrink: 0 }} />
                          <span style={{ fontFamily: S.sans, fontSize: 12, color: S.muted }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: '14px 18px', background: `${S.peach}14`, borderRadius: 12, border: `1px solid ${S.peach}25` }}>
                      <p style={{ fontFamily: S.sans, fontSize: 13, color: S.muted }}>
                        <strong style={{ color: S.darkGreen }}>Weekly tuition: $300 per child.</strong> All supplies included. Morning and afternoon sessions available.
                        {!ENROLLMENT_OPEN && ' Reserve your spot now — payment is due when enrollment opens May 1.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section style={{ background: S.ivory, padding: '80px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 700, color: S.darkGreen }}>What's Included Each Week</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Utensils,  label: 'Hands-on prep and cooking',        color: S.green  },
              { icon: Scissors,  label: 'Age-appropriate knife skills',      color: S.peach  },
              { icon: Shield,    label: 'Food safety instruction',           color: S.tomato },
              { icon: ChefHat,   label: 'Different food project each class', color: S.green  },
              { icon: Users,     label: 'Team-based collaboration',         color: S.peach  },
              { icon: Star,      label: 'Confidence-building routines',     color: S.green  },
              { icon: Trophy,    label: 'Friday Flavor Finale',             color: S.tomato },
              { icon: Package,   label: 'All supplies included',            color: S.green  },
            ].map(item => (
              <div key={item.label} style={{
                background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)',
                borderRadius: 18, padding: '22px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}14`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ color: item.color, width: 20, height: 20 }} />
                </div>
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.5, paddingTop: 8 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 700, color: S.darkGreen }}>How It Works</h2>
          </div>
          <div className="space-y-5">
            {[
              { step: 1, title: 'Choose your week',          body: 'Browse the 8-week schedule and pick the weeks that work for your family.'                                                         },
              { step: 2, title: 'Select morning or afternoon', body: 'Morning classes run 9:00 AM – 12:30 PM. Afternoon classes run 1:00 PM – 4:00 PM.'                                              },
              { step: 3, title: 'Reserve your spot',         body: 'Before May 1, 2026: complete the reservation form to join the priority notification list. No payment due yet.'                    },
              { step: 4, title: 'Get notified for enrollment', body: 'Receive priority notification when enrollment opens on May 1, 2026.'                                                           },
              { step: 5, title: 'Complete registration',     body: 'Pay with PayPal when enrollment opens. Spots are first come, first served.'                                                      },
            ].map(item => (
              <div key={item.step} style={{
                display: 'flex', gap: 18, alignItems: 'flex-start',
                background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)',
                borderRadius: 18, padding: '22px 24px',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: S.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 700, color: '#fff' }}>{item.step}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 700, color: S.darkGreen, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.65 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment banner */}
      <section style={{ background: S.tomato, padding: '48px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 700, color: '#FFF8F0' }}>
              Enrollment opens May 1, 2026 — first come, first served.
            </p>
            <p style={{ fontFamily: S.sans, fontSize: 15, color: 'rgba(255,248,240,0.7)', marginTop: 6 }}>
              Reserve your spot now to receive priority notification and early access.
            </p>
          </div>
          <Link to="/chef-cheryl/reserve" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#FFF8F0', color: S.tomato,
            fontFamily: S.sans, fontSize: 15, fontWeight: 700,
            padding: '14px 30px', borderRadius: 50, textDecoration: 'none',
            flexShrink: 0, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}>
            <Star style={{ width: 16, height: 16 }} />
            Reserve Your Spot
          </Link>
        </div>
      </section>

    </div>
  );
}
