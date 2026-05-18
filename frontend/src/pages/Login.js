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

  return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 50%,rgba(83,74,183,0.2) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 75% 30%,rgba(167,139,250,0.1) 0%,transparent 55%)', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '48px', maxWidth: '860px', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* LEFT SIDE - hidden on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#f0eeff', lineHeight: '1.25', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Your cinema,<br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#7f77dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your reviews.</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#4a4a68', lineHeight: '1.65', marginBottom: '28px' }}>
              Join MovieVerse and start rating the films you love. Share your opinion with a community of real cinephiles.
            </p>
            {[
            { icon: '⭐', text: 'Rate and review any film in the catalog' },
            { icon: '✏️', text: 'Edit or delete your reviews anytime' },
            { icon: '👥', text: 'See what the community thinks' },
            { icon: '🔐', text: 'Your account is always secure' },
            ].map((f, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,rgba(83,74,183,0.3),rgba(167,139,250,0.2))', border: '1px solid rgba(127,119,221,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                 {f.icon}
                </div>
                <span style={{ fontSize: '13px', color: '#6b6a88', lineHeight: '1.4' }}>{f.text}</span>
             </div>
            ))}
          </div>
        )}

        {/* LOGIN CARD */}
        <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '16px', padding: isMobile ? '28px 20px' : '32px' }}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎬</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#f0eeff', marginBottom: '4px' }}>MovieVerse</div>
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
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '12px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
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