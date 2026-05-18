import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      const res = await login(email, password);
      loginUser(res.data.user, res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#080810', border: '1px solid #2a2a3e',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
    color: '#f0eeff', outline: 'none',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: '500', color: '#5a5a78',
    display: 'block', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 70% 50%,rgba(83,74,183,0.2) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '16px', padding: '40px', maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎬</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#f0eeff', marginBottom: '4px' }}>Create your account</div>
          <div style={{ fontSize: '13px', color: '#4a4a68' }}>Join the MovieVerse community</div>
        </div>
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
          <div style={{ marginBottom: '16px' }}>
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
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none', color: '#fff', padding: '12px', borderRadius: '9px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#4a4a68', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7f77dd' }}>Sign in →</Link>
        </div>
      </div>
    </div>
  );
}
