import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { authService } from '../services';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiBriefcase, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const darkMode = document.documentElement.classList.contains('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await authService.login(formData);
      dispatch(loginSuccess(res.data));
      toast.success('Welcome back!');
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 30%, #f0e6ff 60%, #fce7f3 100%)',
      padding: '48px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative blurred orbs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px',
        borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(80px)', pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px',
        borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(60px)', pointerEvents: 'none'
      }}></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
          }}>
            <HiBriefcase style={{ color: 'white', fontSize: '28px' }} />
          </div>
          <h1 style={{
            fontSize: '30px', fontWeight: 800,
            color: darkMode ? '#ffffff' : '#1e293b',
            marginBottom: '8px'
          }}>Welcome Back</h1>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '15px' }}>
            Sign in to your JobConnect AI account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: '20px',
          boxShadow: darkMode
            ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(51, 65, 85, 0.5)'
            : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          padding: '36px'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '14px', fontWeight: 600,
                color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '8px'
              }}>Email</label>
              <div style={{ position: 'relative' }}>
                <HiMail style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '18px'
                }} />
                <input type="email" required id="login-email"
                  style={{
                    width: '100%', paddingLeft: '42px', paddingRight: '16px',
                    paddingTop: '14px', paddingBottom: '14px',
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    borderRadius: '12px',
                    border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    outline: 'none', fontSize: '15px',
                    color: darkMode ? '#ffffff' : '#334155',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="you@example.com" value={formData.email}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '14px', fontWeight: 600,
                color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '8px'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <HiLockClosed style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '18px'
                }} />
                <input type={showPassword ? 'text' : 'password'} required id="login-password"
                  style={{
                    width: '100%', paddingLeft: '42px', paddingRight: '48px',
                    paddingTop: '14px', paddingBottom: '14px',
                    background: darkMode ? '#0f172a' : '#f8fafc',
                    borderRadius: '12px',
                    border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    outline: 'none', fontSize: '15px',
                    color: darkMode ? '#ffffff' : '#334155',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="••••••••" value={formData.password}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', fontSize: '18px', padding: '4px',
                    display: 'flex', alignItems: 'center'
                  }}>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} id="login-submit"
              style={{
                width: '100%',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.45)'; } }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.35)'; }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                Create Account
              </Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
