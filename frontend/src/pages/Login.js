import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const features = [
  {
    color: '#ef9f27',
    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    title: 'Rate & Review',
    text: 'Share your honest opinion on any film in the catalog',
  },
  {
    color: '#a78bfa',
    path: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
    title: 'Your reviews, your rules',
    text: 'Edit or delete your reviews anytime you want',
  },
  {
    color: '#5dcaa5',
    path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: 'Community-powered',
    text: 'Discover what real cinephiles think about every film',
  },
  { color: '#85b7eb', 
    path: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', 
    title: 'Your watchlist', 
    text: 'Save films you want to watch and find them anytime' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      loginUser(res.data.user, res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#080810', border: '1px solid #2a2a3e',
    borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
    color: '#f0eeff', outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '500', color: '#5a5a78',
    display: 'block', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const LeftPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '0 0 32px' : '0' }}>
      <div style={{ marginBottom: isMobile ? '20px' : '28px' }}>
        <h2 style={{ fontSize: isMobile ? '26px' : '34px', fontWeight: '600', color: '#f0eeff', lineHeight: '1.2', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Your cinema,<br />
          <span style={{ background: 'linear-gradient(90deg,#a78bfa,#7f77dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your reviews.</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4a4a68', lineHeight: '1.65' }}>
          MovieVerse is where cinephiles share honest opinions, discover hidden gems, and build their watchlist.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: '12px' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `linear-gradient(135deg,${f.color}22,${f.color}11)`, border: `1px solid ${f.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={f.path} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#e8e6ff', marginBottom: '2px' }}>{f.title}</div>
              <div style={{ fontSize: '11px', color: '#5a5a78', lineHeight: '1.5' }}>{f.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '20px 16px' : '32px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 20% 50%,rgba(83,74,183,0.18) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 80% 20%,rgba(167,139,250,0.08) 0%,transparent 55%)', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '48px', maxWidth: '900px', width: '100%', position: 'relative', zIndex: 1 }}>

        <LeftPanel />

        <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '18px', padding: isMobile ? '28px 20px' : '36px 32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '22px', fontWeight: '600', color: '#f0eeff', marginBottom: '6px' }}>Welcome back</div>
            <div style={{ fontSize: '13px', color: '#4a4a68' }}>Sign in to your MovieVerse account</div>
          </div>

          {error && (
            <div style={{ background: 'rgba(163,45,45,0.12)', border: '1px solid rgba(163,45,45,0.25)', borderRadius: '9px', padding: '11px 14px', fontSize: '13px', color: '#f09595', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f09595" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', letterSpacing: '0.01em' }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            <span style={{ fontSize: '11px', color: '#2a2a3e' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#4a4a68' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a78bfa', fontWeight: '500' }}>Create one →</Link>
          </div>

          <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(127,119,221,0.15)', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#4a4a68', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo credentials</div>
            <div style={{ fontSize: '12px', color: '#6b6a88' }}>user@filmlog.com / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
