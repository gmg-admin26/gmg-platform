import { Link } from 'react-router-dom';
import { ChefHat, Heart, Shield, Users, Star, ChevronRight, Sparkles } from 'lucide-react';

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

export default function CCAbout() {
  return (
    <div style={{ background: S.cream }}>

      {/* Header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Meet the instructor</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 18, lineHeight: 1.1 }}>
            Meet Chef Cheryl
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto' }}>
            Culinary instructor. Kids' champion. Creator of a summer cooking experience that changes how young chefs see themselves in the kitchen.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Portrait placeholder */}
          <div>
            <div style={{
              aspectRatio: '3/4', background: `linear-gradient(145deg, ${S.green}14 0%, ${S.peach}08 100%)`,
              border: `1.5px dashed ${S.green}28`, borderRadius: 24,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
            }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `${S.green}14`, border: `2px solid ${S.green}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChefHat style={{ color: S.green, width: 48, height: 48 }} />
              </div>
              <p style={{ fontFamily: S.sans, fontSize: 14, color: `${S.green}60`, textAlign: 'center' }}>Chef Cheryl Portrait Photo</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                { value: '8 Wks',   label: 'Summer 2026 Program',   color: S.green  },
                { value: '2 Tiers', label: 'Morning & Afternoon',   color: S.peach  },
                { value: '$300',    label: 'Per Week / Child',       color: S.tomato },
                { value: '100%',    label: 'Hands-On Learning',      color: S.green  },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#FAFAF7', border: `1.5px solid rgba(92,122,78,0.1)`, borderRadius: 16, padding: '18px 16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</p>
                  <p style={{ fontFamily: S.sans, fontSize: 11, color: S.muted, marginTop: 3 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio copy */}
          <div>
            <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Biography</p>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: S.darkGreen, marginBottom: 24, lineHeight: 1.2 }}>
              Passionate about teaching kids to thrive in the kitchen.
            </h2>
            {[
              `Chef Cheryl is a passionate culinary instructor known for creating warm, engaging cooking experiences that help children build real skills and real confidence in the kitchen. Her classes combine structure, creativity, and encouragement, giving young chefs the chance to learn through hands-on practice in an environment that feels both exciting and supportive.`,
              `With experience guiding students through foundational cooking techniques, Chef Cheryl believes the kitchen is one of the best places for kids to develop independence, focus, teamwork, and pride in what they create. She teaches more than recipes — she teaches preparation, safety, communication, problem-solving, and the joy of making something from scratch.`,
              `Her teaching style is approachable, upbeat, and skill-centered. Students learn how to prep ingredients, practice age-appropriate knife skills, understand food safety, follow directions, work together, and present what they've made with confidence.`,
              `What makes Chef Cheryl's program special is the balance of high-quality instruction and fun. Each class is designed to help children feel capable, included, and excited to try something new. Whether a student is stepping into the kitchen for the first time or already loves to cook, Chef Cheryl creates an experience that helps them grow.`,
              `Through her summer cooking program, Chef Cheryl is building more than a class — she's creating a memorable experience where kids can discover new foods, make friends, practice teamwork, and leave each week with stronger skills and greater confidence.`,
            ].map((para, i) => (
              <p key={i} style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, lineHeight: 1.8, marginBottom: 18 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching philosophy */}
      <section style={{ background: S.ivory, padding: '80px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${S.peach}14`, border: `1px solid ${S.peach}25`, borderRadius: 50, padding: '8px 18px', marginBottom: 16 }}>
              <Sparkles style={{ color: S.peach, width: 14, height: 14 }} />
              <span style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.peach, fontWeight: 600 }}>Values & Approach</span>
            </div>
            <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 700, color: S.darkGreen }}>Cheryl's Teaching Philosophy</h2>
            <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, marginTop: 14, maxWidth: 500, margin: '14px auto 0' }}>
              Every class is built on four core beliefs that guide how Chef Cheryl teaches and how students grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Star,    title: 'Confidence grows through doing',        body: 'Students don\'t just watch — they\'re in the kitchen from day one, building real skills through real practice.', color: S.green  },
              { icon: Shield,  title: 'Safety and technique come first',       body: 'Before anything else, students learn the right way to handle tools, manage heat, and keep their workspace safe.',    color: S.tomato },
              { icon: Users,   title: 'Teamwork makes cooking more fun',      body: 'Cooking together teaches communication, listening, and collaboration — skills that go well beyond the kitchen.',      color: S.peach  },
              { icon: Heart,   title: 'Every child should feel proud',        body: 'Chef Cheryl creates an inclusive, encouraging environment where every student feels capable and celebrated.',          color: S.green  },
            ].map(item => (
              <div key={item.title} style={{
                background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)',
                borderRadius: 22, padding: '28px 26px',
                display: 'flex', gap: 18, alignItems: 'flex-start',
                boxShadow: '0 4px 20px rgba(42,61,31,0.05)',
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${item.color}14`, border: `1.5px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ color: item.color, width: 24, height: 24 }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: S.serif, fontSize: 19, fontWeight: 700, color: S.darkGreen, marginBottom: 10, lineHeight: 1.2 }}>{item.title}</h3>
                  <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <h2 style={{ fontFamily: S.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, color: S.darkGreen, marginBottom: 16 }}>
            Ready to give your young chef an unforgettable summer?
          </h2>
          <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, lineHeight: 1.7, marginBottom: 32 }}>
            Small group energy. Big confidence gains. Real skills, real teamwork, real fun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/chef-cheryl/classes" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: S.green, color: '#fff',
              fontFamily: S.sans, fontSize: 16, fontWeight: 700,
              padding: '15px 32px', borderRadius: 50, textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(92,122,78,0.3)',
            }}>
              View Summer 2026 Classes <ChevronRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link to="/chef-cheryl/reserve" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: S.green,
              border: `2px solid ${S.green}`, borderRadius: 50,
              fontFamily: S.sans, fontSize: 16, fontWeight: 700,
              padding: '15px 32px', textDecoration: 'none',
            }}>
              <Star style={{ width: 17, height: 17 }} />
              Reserve Your Spot
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
