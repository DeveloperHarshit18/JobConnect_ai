import { useState, useEffect } from 'react';
import { applicationService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBriefcase, HiLocationMarker, HiClock } from 'react-icons/hi';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    applicationService.getUserApplications().then(res => {
      setApplications(res.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const badgeColors = {
    pending: { bg: darkMode ? 'rgba(251,191,36,0.12)' : '#fef3c7', color: darkMode ? '#fbbf24' : '#92400e' },
    reviewed: { bg: darkMode ? 'rgba(129,140,248,0.12)' : '#e0e7ff', color: darkMode ? '#818cf8' : '#3730a3' },
    shortlisted: { bg: darkMode ? 'rgba(34,211,238,0.12)' : '#cffafe', color: darkMode ? '#22d3ee' : '#155e75' },
    accepted: { bg: darkMode ? 'rgba(52,211,153,0.12)' : '#d1fae5', color: darkMode ? '#34d399' : '#065f46' },
    rejected: { bg: darkMode ? 'rgba(248,113,113,0.12)' : '#fee2e2', color: darkMode ? '#f87171' : '#991b1b' },
  };

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '24px' }}>My Applications</h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '8px 18px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 600, textTransform: 'capitalize',
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                border: filter === s ? 'none' : `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                background: filter === s ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (darkMode ? '#1e293b' : '#ffffff'),
                color: filter === s ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
              }}>
              {s} {s !== 'all' && `(${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ ...cardStyle, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>No applications found</h3>
            <p style={{ color: '#94a3b8', marginTop: '4px' }}>Start applying to jobs to see them here</p>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
              padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none'
            }}>Browse Jobs</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ ...cardStyle, padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: darkMode ? 'rgba(99,102,241,0.1)' : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6366f1', fontWeight: 700, fontSize: '18px', flexShrink: 0
                  }}>{app.jobId?.company?.name?.charAt(0) || 'J'}</div>
                  <div>
                    <Link to={`/jobs/${app.jobId?._id}`} style={{
                      fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', textDecoration: 'none', fontSize: '15px'
                    }}>{app.jobId?.title || 'Job'}</Link>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiBriefcase style={{ color: '#6366f1' }} /> {app.jobId?.company?.name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiLocationMarker /> {app.jobId?.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiClock /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '5px 14px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: 600,
                  background: badgeColors[app.status]?.bg || '#f1f5f9',
                  color: badgeColors[app.status]?.color || '#64748b'
                }}>{app.status}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
