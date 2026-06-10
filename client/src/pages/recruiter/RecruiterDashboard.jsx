import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobService, applicationService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { HiBriefcase, HiUsers, HiEye, HiPlus, HiDocumentText, HiTrendingUp } from 'react-icons/hi';

const RecruiterDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    jobService.getRecruiterJobs().then(res => {
      setJobs(res.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'open').length;
  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

  const stats = [
    { icon: <HiBriefcase />, label: 'Total Jobs', value: jobs.length, gradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
    { icon: <HiDocumentText />, label: 'Active Jobs', value: activeJobs, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: <HiUsers />, label: 'Total Applicants', value: totalApplicants, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
    { icon: <HiEye />, label: 'Total Views', value: totalViews, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  ];

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>Recruiter Dashboard</h1>
            <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '15px' }}>Manage your job postings and applicants</p>
          </div>
          <Link to="/recruiter/post-job" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
            padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}><HiPlus /> Post New Job</Link>
        </div>

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

        {/* Recent Jobs */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`
          }}>
            <h2 style={{ fontWeight: 700, fontSize: '18px', color: darkMode ? '#ffffff' : '#1e293b' }}>Your Job Postings</h2>
            <Link to="/recruiter/manage-jobs" style={{ color: '#6366f1', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Manage All</Link>
          </div>
          {jobs.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', marginBottom: '16px' }}>No jobs posted yet</p>
              <Link to="/recruiter/post-job" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none'
              }}>Post Your First Job</Link>
            </div>
          ) : (
            <div>
              {jobs.slice(0, 10).map((job, i) => (
                <div key={job._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderTop: i !== 0 ? `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: job.status === 'open' ? '#10b981' : '#94a3b8'
                    }}></div>
                    <div>
                      <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '14px' }}>{job.title}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{job.location} • {job.jobType} • {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px' }}>
                    <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><HiUsers /> {job.applicants?.length || 0}</span>
                    <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><HiEye /> {job.views || 0}</span>
                    <Link to={`/recruiter/applicants/${job._id}`} style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
