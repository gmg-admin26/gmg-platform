import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star, HelpCircle } from 'lucide-react';

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

const FAQS = [
  {
    q: 'What ages are the classes for?',
    a: "Chef Cheryl's summer classes are designed for elementary and middle school students. The curriculum is calibrated to be age-appropriate, engaging, and accessible for a range of skill levels.",
  },
  {
    q: 'Can my child sign up for more than one week?',
    a: 'Yes. Families can register one week at a time and choose as many weeks as they\'d like, based on availability. Spots are limited so we encourage reserving multiple weeks early.',
  },
  {
    q: 'What are the class times?',
    a: 'Morning classes run from 9:00 AM to 12:30 PM. Afternoon classes run from 1:00 PM to 4:00 PM. Both sessions cover the same curriculum.',
  },
  {
    q: 'How much does it cost?',
    a: 'Tuition is $300 per week per child, and all supplies are included. There are no additional fees or materials to purchase.',
  },
  {
    q: 'When does enrollment open?',
    a: 'Enrollment opens on May 1, 2026. Spots are first come, first served. We encourage families to reserve their spot before May 1 to get priority notification.',
  },
  {
    q: 'Can I reserve a spot before enrollment opens?',
    a: 'Yes. Parents can reserve a spot in advance to receive early notification when enrollment opens. No payment is required during the reservation phase — you\'re simply joining the priority access list.',
  },
  {
    q: 'How are spots assigned?',
    a: 'Spots are first come, first served once enrollment opens on May 1, 2026. Families who have reserved their spot will receive priority notification so they have the best chance of securing their preferred week and session.',
  },
  {
    q: 'What will my child learn?',
    a: 'Students learn prep, age-appropriate knife skills, food safety, teamwork, kitchen confidence, and complete different food items or cooking projects during each week. Skills are introduced progressively and reinforced through hands-on practice every session.',
  },
  {
    q: 'What happens on Fridays?',
    a: 'Fridays end with our Friday Flavor Finale — a fun weekly culmination where students celebrate what they learned and share the results of the week\'s work. It\'s a highlight of the program and something students and families look forward to every session.',
  },
  {
    q: 'Are supplies included?',
    a: 'Yes. All supplies are included in the weekly tuition. Families do not need to purchase or bring any cooking supplies, tools, or ingredients.',
  },
  {
    q: 'How many students are in each class?',
    a: 'Chef Cheryl keeps class sizes intentionally small to ensure every student gets personalized attention and hands-on time. Class size details will be confirmed closer to the start of the program.',
  },
  {
    q: 'How do I pay for enrollment?',
    a: 'Once enrollment opens on May 1, 2026, payment is completed via PayPal. You\'ll be able to complete registration and payment in one seamless step. If you need help with payment, contact us directly and we\'ll assist you.',
  },
];

export default function CCFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ background: S.cream }}>

      {/* Header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Frequently Asked Questions</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 18, lineHeight: 1.1 }}>
            Got Questions? We've Got Answers.
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Everything you need to know about Chef Cheryl's summer 2026 cooking classes.
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: open === i ? '#FAFAF7' : '#FAFAF7',
                  border: `1.5px solid ${open === i ? S.green : 'rgba(92,122,78,0.12)'}`,
                  borderRadius: 18, overflow: 'hidden',
                  boxShadow: open === i ? `0 6px 24px rgba(92,122,78,0.1)` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '22px 24px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: open === i ? `${S.green}14` : 'rgba(92,122,78,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <HelpCircle style={{ color: open === i ? S.green : S.sage, width: 15, height: 15 }} />
                    </div>
                    <span style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 700, color: S.darkGreen, lineHeight: 1.35 }}>{faq.q}</span>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {open === i
                      ? <ChevronUp style={{ color: S.green, width: 20, height: 20 }} />
                      : <ChevronDown style={{ color: S.muted, width: 20, height: 20 }} />
                    }
                  </div>
                </button>

                {open === i && (
                  <div style={{ paddingLeft: 68, paddingRight: 24, paddingBottom: 22 }}>
                    <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div style={{ marginTop: 48, background: S.ivory, border: '1.5px solid rgba(92,122,78,0.12)', borderRadius: 22, padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${S.peach}14`, border: `1.5px solid ${S.peach}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Star style={{ color: S.peach, width: 28, height: 28 }} />
            </div>
            <h3 style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 700, color: S.darkGreen, marginBottom: 10 }}>Still have questions?</h3>
            <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>
              We're happy to help. Reach out directly and we'll get back to you quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/chef-cheryl/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: S.green, color: '#fff',
                fontFamily: S.sans, fontSize: 15, fontWeight: 600,
                padding: '13px 26px', borderRadius: 50, textDecoration: 'none',
              }}>
                Contact Us
              </Link>
              <Link to="/chef-cheryl/reserve" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: S.green, border: `2px solid ${S.green}`,
                fontFamily: S.sans, fontSize: 15, fontWeight: 600,
                padding: '13px 26px', borderRadius: 50, textDecoration: 'none',
              }}>
                Reserve Your Spot
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
