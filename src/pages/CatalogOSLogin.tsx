// =============================================================================
// LOCKED PRODUCTION PAGE — Catalog OS login
// Do NOT redesign, regenerate, or replace this component.
// Only make scoped edits (e.g. credential updates, error message copy).
// Route: /catalog-os/login and /catalog/login
// Credentials source: src/auth/roles.ts → CATALOG_OS_USERS
// On success redirects to: /catalog/app
// =============================================================================
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Library } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import CatalogAccessRequestModal from '../components/CatalogAccessRequestModal';

export default function CatalogOSLogin() {
  const navigate = useNavigate();
  const { loginCatalogOS, catalogOSAuth } = useAuth();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [shake, setShake]         = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (catalogOSAuth.authenticated) {
    return <Navigate to="/catalog/app" replace />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = loginCatalogOS(email, password);
      if (ok) {
        navigate('/catalog/app', { replace: true });
      } else {
        setError('Credentials not recognized. Contact GMG to verify your access.');
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 900);
  }

  return (
    <>
      <CatalogAccessRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <style>{`
        @keyframes cos-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cos-shake {
          0%,100% { transform: translateX(0); }
          18%     { transform: translateX(-7px); }
          36%     { transform: translateX(6px); }
          54%     { transform: translateX(-4px); }
          72%     { transform: translateX(3px); }
        }
        @keyframes cos-spin {
          to { transform: rotate(360deg); }
        }
        .cos-field {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: rgba(255,255,255,0.88);
          font-size: 13.5px;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .cos-field:focus {
          outline: none;
          border-color: rgba(16,185,129,0.35);
          background: rgba(16,185,129,0.025);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.07);
        }
        .cos-field::placeholder { color: rgba(255,255,255,0.16); }
        .cos-field:disabled { opacity: 0.5; cursor: not-allowed; }
        .cos-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: 1px solid rgba(16,185,129,0.28);
          background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(5,150,105,0.1));
          color: rgba(52,211,153,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          box-shadow: 0 0 28px rgba(16,185,129,0.08);
          font-family: inherit;
        }
        .cos-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(5,150,105,0.15));
          box-shadow: 0 0 48px rgba(16,185,129,0.18);
          transform: translateY(-1px);
        }
        .cos-btn:active:not(:disabled) { transform: translateY(0); }
        .cos-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
        background: '#07100C',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.018) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 420,
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'cos-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Library size={20} color="rgba(16,185,129,0.8)" />
            </div>

            <p style={{
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'rgba(16,185,129,0.5)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Greater Music Group
            </p>

            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 10,
            }}>
              Catalog OS
            </h1>

            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.55,
              maxWidth: 300,
              margin: '0 auto',
              fontWeight: 300,
            }}>
              Operate, grow, and monetize your catalog like a business.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '32px 32px 28px',
            animation: shake ? 'cos-shake 0.5s ease' : 'none',
          }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'monospace',
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="rgba(255,255,255,0.18)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    className="cos-field"
                    type="text"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                    style={error ? { borderColor: 'rgba(239,68,68,0.3)' } : {}}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'monospace',
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="rgba(255,255,255,0.18)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    className="cos-field"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    style={{ paddingRight: 44, ...(error ? { borderColor: 'rgba(239,68,68,0.3)' } : {}) }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9,
                  padding: '10px 14px',
                  background: 'rgba(239,68,68,0.05)',
                  border: '1px solid rgba(239,68,68,0.18)',
                  borderRadius: 9,
                }}>
                  <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(239,68,68,0.85)', margin: 0, lineHeight: 1.5 }}>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="cos-btn"
                disabled={loading}
                style={{ marginTop: 2 }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 13, height: 13,
                      border: '2px solid rgba(16,185,129,0.2)',
                      borderTopColor: 'rgba(16,185,129,0.75)',
                      borderRadius: '50%',
                      animation: 'cos-spin 0.7s linear infinite',
                      flexShrink: 0,
                    }} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Catalog OS
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', marginBottom: 8 }}>
                Demo Logins
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { label: 'Admin', email: 'catalog@gmg.ai', password: 'GMGcatalog123!' },
                  { label: 'Bassnectar', email: 'client@bassnectar.net', password: 'bassnectar123' },
                  { label: 'Santigold', email: 'client@santigold.com', password: 'santigold123' },
                  { label: 'Virgin Catalog', email: 'client@artist03.com', password: 'artist03123' },
                ].map(cred => (
                  <button
                    key={cred.label}
                    type="button"
                    disabled={loading}
                    onClick={() => { setEmail(cred.email); setPassword(cred.password); setError(''); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', borderRadius: 7, cursor: 'pointer',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace',
                      transition: 'all 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(16,185,129,0.06)'; b.style.borderColor = 'rgba(16,185,129,0.18)'; b.style.color = 'rgba(16,185,129,0.7)'; }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.02)'; b.style.borderColor = 'rgba(255,255,255,0.06)'; b.style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, minWidth: 60 }}>{cred.label}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{cred.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginTop: 20, paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <button
                type="button"
                onClick={() => setRequestOpen(true)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '9px 14px',
                  borderRadius: 9,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.38)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.38)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                Request Access
              </button>

              <Link
                to="/"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '9px 14px',
                  borderRadius: 9,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.38)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.38)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                Back to GMG
              </Link>
            </div>
          </div>

          <p style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 11,
            color: 'rgba(255,255,255,0.18)',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}>
            Access is granted to approved catalog clients,<br />partners, and internal operators.
          </p>
        </div>
      </div>
    </>
  );
}
