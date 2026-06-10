import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { authService } from '../services';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiBriefcase, HiEye, HiEyeOff } from 'react-icons/hi';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'seeker',
  });
  const darkMode = document.documentElement.classList.contains('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await authService.register(formData);
      dispatch(loginSuccess(res.data));
      toast.success('Account created successfully!');
      const role = res.data.user.role;
      if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const roles = [
    { value: 'seeker', label: 'Job Seeker', desc: 'Looking for opportunities', icon: '🔍' },
    { value: 'recruiter', label: 'Recruiter', desc: 'Hiring talent', icon: '🏢' },
  ];

  const inputStyle = {
    width: '100%', paddingLeft: '42px', paddingRight: '16px',
    paddingTop: '14px', paddingBottom: '14px',
    background: darkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '12px',
    border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    outline: 'none', fontSize: '15px',
    color: darkMode ? '#ffffff' : '#334155',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: 600,
    color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '8px'
  };

  const handleFocus = (e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; };
  const handleBlur = (e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; };

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
        position: 'absolute', top: '-120px', left: '-120px', width: '400px', height: '400px',
        borderRadius: '50%', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(80px)', pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px',
        borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(60px)', pointerEvents: 'none'
      }}></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>

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
          }}>Create Account</h1>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '15px' }}>
            Join JobConnect AI and start your journey
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
            {/* Role Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setFormData({ ...formData, role: r.value })}
                    style={{
                      padding: '14px', borderRadius: '14px', textAlign: 'left',
                      border: `2px solid ${formData.role === r.value ? '#6366f1' : (darkMode ? '#334155' : '#e2e8f0')}`,
                      background: formData.role === r.value
                        ? (darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.04)')
                        : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>{r.icon}</span>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: darkMode ? '#ffffff' : '#1e293b' }}>{r.label}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <HiUser style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '18px'
                }} />
                <input type="text" required id="register-name"
                  style={inputStyle}
                  placeholder="John Doe" value={formData.name}
                  onFocus={handleFocus} onBlur={handleBlur}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <HiMail style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '18px'
                }} />
                <input type="email" required id="register-email"
                  style={inputStyle}
                  placeholder="you@example.com" value={formData.email}
                  onFocus={handleFocus} onBlur={handleBlur}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <HiLockClosed style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '18px'
                }} />
                <input type={showPassword ? 'text' : 'password'} required id="register-password"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  placeholder="Min 6 characters" value={formData.password}
                  onFocus={handleFocus} onBlur={handleBlur}
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
            <button type="submit" disabled={loading} id="register-submit"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
