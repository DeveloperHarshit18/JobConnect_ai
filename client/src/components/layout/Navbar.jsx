import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { HiMenu, HiX, HiMoon, HiSun, HiBell, HiChevronDown, HiUser, HiLogout, HiChat, HiBriefcase, HiHome, HiDocumentText } from 'react-icons/hi';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => { setMobileMenu(false); setProfileMenu(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'recruiter') return '/recruiter/dashboard';
    return '/seeker/dashboard';
  };

  const navLinks = isAuthenticated ? [
    { to: getDashboardLink(), label: 'Dashboard', icon: <HiHome /> },
    { to: '/jobs', label: 'Find Jobs', icon: <HiBriefcase /> },
    { to: '/chat', label: 'Messages', icon: <HiChat /> },
  ] : [
    { to: '/jobs', label: 'Find Jobs', icon: <HiBriefcase /> },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: darkMode ? '#1e293b' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px'
          }}>
            <HiBriefcase />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: darkMode ? 'white' : '#6366f1' }}>JobConnect AI</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.2s',
              color: location.pathname === link.to ? '#6366f1' : (darkMode ? '#cbd5e1' : '#64748b'),
              background: location.pathname === link.to ? (darkMode ? '#312e81' : '#eef2ff') : 'transparent'
            }}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dark Mode Toggle */}
          <button onClick={() => setDarkMode(!darkMode)} style={{
            width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: darkMode ? '#334155' : '#f1f5f9', color: darkMode ? '#fbbf24' : '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'all 0.2s'
          }} id="dark-mode-toggle">
            {darkMode ? <HiSun /> : <HiMoon />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link to={getDashboardLink()} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                background: darkMode ? '#334155' : '#f1f5f9', color: darkMode ? '#cbd5e1' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                textDecoration: 'none', transition: 'all 0.2s'
              }}>
                <HiBell />
              </Link>

              {/* Profile Menu */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setProfileMenu(!profileMenu)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 4px',
                  borderRadius: '12px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  background: darkMode ? '#334155' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s'
                }} id="profile-menu-btn">
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '13px'
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? 'white' : '#334155', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <HiChevronDown style={{ fontSize: '12px', color: '#94a3b8' }} />
                </button>

                {profileMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '220px',
                    background: darkMode ? '#1e293b' : 'white', borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 99
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
                      <p style={{ fontWeight: 600, color: darkMode ? 'white' : '#1e293b', fontSize: '14px' }}>{user?.name}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{user?.email}</p>
                    </div>
                    <Link to={getDashboardLink()} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                      textDecoration: 'none', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '14px',
                      transition: 'background 0.2s'
                    }}>
                      <HiHome /> Dashboard
                    </Link>
                    {user?.role === 'seeker' && (
                      <Link to="/seeker/profile" style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                        textDecoration: 'none', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '14px'
                      }}>
                        <HiUser /> Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                      width: '100%', border: 'none', background: 'none', cursor: 'pointer',
                      borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
                      color: '#ef4444', fontSize: '14px', textAlign: 'left'
                    }}>
                      <HiLogout /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" style={{
                padding: '8px 20px', borderRadius: '10px',
                border: `2px solid ${darkMode ? '#6366f1' : '#6366f1'}`,
                color: '#6366f1', fontWeight: 600, fontSize: '14px',
                textDecoration: 'none', transition: 'all 0.2s'
              }} id="nav-login">
                Login
              </Link>
              <Link to="/register" style={{
                padding: '8px 20px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', fontWeight: 600, fontSize: '14px',
                textDecoration: 'none', transition: 'all 0.2s'
              }} id="nav-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{
            display: 'none', width: '36px', height: '36px', borderRadius: '10px',
            border: 'none', cursor: 'pointer',
            background: darkMode ? '#334155' : '#f1f5f9', color: darkMode ? '#cbd5e1' : '#64748b',
            fontSize: '20px', alignItems: 'center', justifyContent: 'center'
          }} className="mobile-menu-btn" id="mobile-menu-btn">
            {mobileMenu ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          background: darkMode ? '#1e293b' : 'white'
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 0', color: darkMode ? '#cbd5e1' : '#475569',
              textDecoration: 'none', fontSize: '15px', fontWeight: 500,
              borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`
            }}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
