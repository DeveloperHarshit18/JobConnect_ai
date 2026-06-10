import { Link } from 'react-router-dom';
import { HiHeart, HiBriefcase } from 'react-icons/hi';

const Footer = () => {
  const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontSize: '14px', lineHeight: '2' };

  return (
    <footer style={{ background: '#0f172a', color: 'white', paddingTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', paddingBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px'
              }}><HiBriefcase /></div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>JobConnect AI</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
              AI-powered job portal connecting talented professionals with top companies. Find your dream job today.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>For Job Seekers</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/jobs" style={linkStyle}>Browse Jobs</Link>
              <Link to="/register" style={linkStyle}>Create Account</Link>
              <Link to="/seeker/profile" style={linkStyle}>Build Resume</Link>
              <Link to="/seeker/applications" style={linkStyle}>Track Applications</Link>
            </div>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>For Recruiters</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/recruiter/post-job" style={linkStyle}>Post a Job</Link>
              <Link to="/register?role=recruiter" style={linkStyle}>Recruiter Signup</Link>
              <Link to="/recruiter/manage-jobs" style={linkStyle}>Manage Jobs</Link>
              <Link to="/recruiter/dashboard" style={linkStyle}>Dashboard</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
              <p>📧 support@jobconnect.ai</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Bangalore, India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid #1e293b', padding: '20px 0',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
          gap: '12px', fontSize: '14px', color: '#64748b'
        }}>
          <p>© {new Date().getFullYear()} JobConnect AI. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <HiHeart style={{ color: '#ef4444' }} /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
