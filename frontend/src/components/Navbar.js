import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: '60px', background: 'rgba(8,8,16,0.95)',
    borderBottom: '1px solid #1e1e2e', position: 'sticky', top: 0, zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  logoIcon: {
    width: '28px', height: '28px', background: 'linear-gradient(135deg,#7f77dd,#a78bfa)',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: '16px', fontWeight: '600', color: '#f0eeff' },
  logoSpan: { color: '#a78bfa' },
  navRight: { display: 'flex', gap: '8px', alignItems: 'center' },
  btnGhost: {
    background: 'transparent', border: '1px solid #2a2a3e', color: '#9998b3',
    padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg,#534ab7,#7f77dd)', border: 'none',
    color: '#fff', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
  },
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate('/');
  };

  const displayName = user?.username || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>
          <img src="/logo.svg" alt="MovieVerse" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
        </div>
        <div style={styles.logoText}>
          Movie<span style={styles.logoSpan}>Verse</span>
        </div>
      </Link>
      <div style={styles.navRight}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '10px', border: '1px solid #2a2a3e', background: dropdownOpen ? '#12121f' : 'transparent', transition: 'all 0.15s' }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#534ab7,#7f77dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
                {initial}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#f0eeff', lineHeight: 1 }}>
                  {displayName}
                </div>
                {user.role === 'admin' && (
                  <div style={{ fontSize: '10px', color: '#7f77dd', marginTop: '2px' }}>Administrator</div>
                )}
              </div>
              <span style={{ fontSize: '10px', color: '#3a3a58', marginLeft: '2px' }}>▾</span>
            </div>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#0e0e1a', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '8px', minWidth: '180px', zIndex: 200 }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e2e', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#4a4a68', marginBottom: '2px' }}>Signed in as</div>
                  <div style={{ fontSize: '12px', color: '#f0eeff', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>

                {user.role !== 'admin' && (
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#9998b3', fontSize: '13px' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#12121f'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>🎬</span> My Watchlist
                    </div>
                  </Link>
                )}

                {user.role !== 'admin' && (
                    <Link to="/my-reviews" onClick={() => setDropdownOpen(false)}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#9998b3', fontSize: '13px' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#12121f'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span>⭐</span> My Reviews
                        </div>
                    </Link>
              )}

                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#9998b3', fontSize: '13px' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#12121f'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>🛡</span> Admin Panel
                    </div>
                  </Link>
                )}

                <div style={{ borderTop: '1px solid #1e1e2e', marginTop: '6px', paddingTop: '6px' }}>
                  <div
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#f09595', fontSize: '13px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#12121f'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>→</span> Sign out
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button style={styles.btnGhost}>Sign in</button>
            </Link>
            <Link to="/register">
              <button style={styles.btnPrimary}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}