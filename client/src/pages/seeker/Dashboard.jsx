import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobService, applicationService, aiService } from '../../services';
import JobCard from '../../components/common/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { HiBriefcase, HiDocumentText, HiBookmark, HiLightningBolt, HiTrendingUp, HiSparkles } from 'react-icons/hi';

const SeekerDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getFeaturedJobs(),
        applicationService.getUserApplications()
      ]);
      setRecentJobs(jobsRes.data.data || []);
      setApplications(appsRes.data.data || []);
      if (user?.skills?.length > 0) {
        try {
          const recRes = await aiService.getRecommendations({ skills: user.skills });
          setRecommendations(recRes.data.data || []);
        } catch { }
      }
    } catch { }
    setLoading(false);
  };

  const stats = [
    { icon: <HiDocumentText />, label: 'Applications', value: applications.length, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { icon: <HiBriefcase />, label: 'Interviews', value: applications.filter(a => a.status === 'shortlisted').length, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
    { icon: <HiTrendingUp />, label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { icon: <HiBookmark />, label: 'Saved Jobs', value: user?.savedJobs?.length || 0, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  ];

  const quickActions = [
    { to: '/jobs', icon: <HiBriefcase />, title: 'Browse Jobs', desc: 'Find new opportunities', color: '#6366f1', bg: darkMode ? 'rgba(99,102,241,0.1)' : '#eef2ff' },
    { to: '/seeker/profile', icon: <HiSparkles />, title: 'Update Profile', desc: 'Improve your visibility', color: '#8b5cf6', bg: darkMode ? 'rgba(139,92,246,0.1)' : '#f5f3ff' },
    { to: '/seeker/applications', icon: <HiDocumentText />, title: 'Track Applications', desc: 'View your applications', color: '#10b981', bg: darkMode ? 'rgba(16,185,129,0.1)' : '#ecfdf5' },
  ];

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const badgeColors = {
    pending: { bg: darkMode ? 'rgba(251,191,36,0.12)' : '#fef3c7', color: darkMode ? '#fbbf24' : '#92400e' },
    reviewed: { bg: darkMode ? 'rgba(129,140,248,0.12)' : '#e0e7ff', color: darkMode ? '#818cf8' : '#3730a3' },
    shortlisted: { bg: darkMode ? 'rgba(34,211,238,0.12)' : '#cffafe', color: darkMode ? '#22d3ee' : '#155e75' },
    accepted: { bg: darkMode ? 'rgba(52,211,153,0.12)' : '#d1fae5', color: darkMode ? '#34d399' : '#065f46' },
    rejected: { bg: darkMode ? 'rgba(248,113,113,0.12)' : '#fee2e2', color: darkMode ? '#f87171' : '#991b1b' },
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '15px' }}>Here's what's happening with your job search</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ ...cardStyle, padding: '20px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: stat.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '18px', marginBottom: '12px'
              }}>{stat.icon}</div>
              <p style={{ fontSize: '26px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>{stat.value}</p>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {quickActions.map(action => (
            <Link key={action.to} to={action.to} style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
              ...cardStyle, textDecoration: 'none', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: action.color, fontSize: '18px', transition: 'all 0.2s'
              }}>{action.icon}</div>
              <div>
                <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '15px' }}>{action.title}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HiLightningBolt style={{ color: '#f59e0b', fontSize: '22px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>AI Recommended Jobs</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {recommendations.slice(0, 3).map(job => <JobCard key={job._id} job={job} />)}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>Recent Applications</h2>
            <Link to="/seeker/applications" style={{ color: '#6366f1', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          {applications.length === 0 ? (
            <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8' }}>No applications yet. Start applying!</p>
              <Link to="/jobs" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none'
              }}>Browse Jobs</Link>
            </div>
          ) : (
            <div style={{ ...cardStyle, overflow: 'hidden' }}>
              {applications.slice(0, 5).map((app, i) => (
                <div key={app._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderTop: i !== 0 ? `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: darkMode ? 'rgba(99,102,241,0.1)' : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#6366f1', fontWeight: 700, fontSize: '15px'
                    }}>{app.jobId?.company?.name?.charAt(0) || 'J'}</div>
                    <div>
                      <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '14px' }}>{app.jobId?.title || 'Job'}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{app.jobId?.company?.name} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600,
                    background: badgeColors[app.status]?.bg || '#f1f5f9',
                    color: badgeColors[app.status]?.color || '#64748b'
                  }}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Jobs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>Latest Jobs</h2>
            <Link to="/jobs" style={{ color: '#6366f1', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {recentJobs.slice(0, 6).map(job => <JobCard key={job._id} job={job} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
