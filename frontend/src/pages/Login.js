import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

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
      const token = res.data.access_token;
      const userData = res.data.user;
      loginUser(userData, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#080810', border: '1px solid #2a2a3e',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    color: '#f0eeff', outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '500', color: '#5a5a78',
    display: 'block', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const features = [
    { color: '#ef9f27', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', text: 'Rate and review any film in the catalog' },
    { color: '#a78bfa', path: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', text: 'Edit or delete your reviews anytime' },
    { color: '#5dcaa5', path: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', text: 'See what the community thinks' },
    { color: '#85b7eb', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Your account is always secure' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 50%,rgba(83,74,183,0.2) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 75% 30%,rgba(167,139,250,0.1) 0%,transparent 55%)', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '48px', maxWidth: '860px', width: '100%', position: 'relative', zIndex: 1 }}>

        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#f0eeff', lineHeight: '1.25', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Your cinema,<br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#7f77dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your reviews.</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#4a4a68', lineHeight: '1.65', marginBottom: '28px' }}>
              Join MovieVerse and start rating the films you love. Share your opinion with a community of real cinephiles.
            </p>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,rgba(83,74,183,0.3),rgba(167,139,250,0.2))', border: '1px solid rgba(127,119,221,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.path} />
                  </svg>
                </div>
                <span style={{ fontSize: '13px', color: '#6b6a88', lineHeight: '1.4' }}>{f.text}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '16px', padding: isMobile ? '28px 20px' : '32px' }}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                  <line x1="7" y1="2" x2="7" y2="22"/>
                  <line x1="17" y1="2" x2="17" y2="22"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <line x1="2" y1="7" x2="7" y2="7"/>
                  <line x1="2" y1="17" x2="7" y2="17"/>
                  <line x1="17" y1="17" x2="22" y2="17"/>
                  <line x1="17" y1="7" x2="22" y2="7"/>
                </svg>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0eeff' }}>MovieVerse</div>
              <div style={{ fontSize: '12px', color: '#4a4a68', marginTop: '4px' }}>Discover films worth watching</div>
            </div>
          )}

          <div style={{ fontSize: '20px', fontWeight: '600', color: '#f0eeff', marginBottom: '4px' }}>Welcome back</div>
          <div style={{ fontSize: '13px', color: '#4a4a68', marginBottom: '24px' }}>Sign in to your account</div>

          {error && (
            <div style={{ background: 'rgba(163,45,45,0.15)', border: '1px solid rgba(163,45,45,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f09595', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '12px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            <span style={{ fontSize: '11px', color: '#3a3a58' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
          </div>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#4a4a68' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7f77dd' }}>Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}