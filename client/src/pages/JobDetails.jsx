import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobService, applicationService, userService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiCurrencyRupee, HiBriefcase, HiClock, HiBookmark, HiGlobe, HiUsers, HiEye, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await jobService.getJob(id);
      setJob(res.data.data);
    } catch { navigate('/jobs'); }
    setLoading(false);
  };

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    setApplying(true);
    try {
      await applicationService.apply({ jobId: id });
      setApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  const handleSave = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const res = await userService.toggleSaveJob(id);
      setSaved(res.data.saved);
      toast.success(res.data.message);
    } catch { toast.error('Failed to save job'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return <div style={{ textAlign: 'center', padding: '80px 20px' }}><p style={{ color: '#94a3b8' }}>Job not found</p></div>;

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const sectionTitle = {
    fontSize: '18px', fontWeight: 700,
    color: darkMode ? '#ffffff' : '#1e293b',
    marginBottom: '16px'
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
          <button onClick={() => navigate(-1)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            color: '#94a3b8', fontSize: '14px', marginBottom: '20px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
            <HiArrowLeft /> Back to Jobs
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6366f1', fontWeight: 700, fontSize: '24px', flexShrink: 0
              }}>
                {job.company?.name?.charAt(0)}
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '6px' }}>{job.title}</h1>
                <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '12px' }}>{job.company?.name}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#64748b' }}>
                    <HiLocationMarker style={{ color: '#6366f1' }} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#64748b' }}>
                    <HiBriefcase style={{ color: '#6366f1' }} /> {job.jobType}
                  </span>
                  {job.salary?.min && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#64748b' }}>
                      <HiCurrencyRupee style={{ color: '#6366f1' }} /> ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#64748b' }}>
                    <HiEye style={{ color: '#6366f1' }} /> {job.views} views
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignSelf: 'flex-start' }}>
              <button onClick={handleSave} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '12px',
                border: `2px solid ${saved ? '#6366f1' : (darkMode ? '#334155' : '#e2e8f0')}`,
                background: saved ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: saved ? '#6366f1' : (darkMode ? '#cbd5e1' : '#64748b'),
                fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <HiBookmark /> {saved ? 'Saved' : 'Save'}
              </button>
              {user?.role === 'seeker' && (
                <button onClick={handleApply} disabled={applying || applied}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 24px', borderRadius: '12px', border: 'none',
                    background: applied ? '#10b981' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', fontWeight: 700, fontSize: '14px',
                    cursor: (applying || applied) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: applied ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                    opacity: applying ? 0.7 : 1
                  }}>
                  {applied ? <><HiCheckCircle /> Applied</> : applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Main + Sidebar Layout */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Main Content */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={cardStyle}>
                <h2 style={sectionTitle}>Job Description</h2>
                <div style={{ color: darkMode ? '#cbd5e1' : '#475569', lineHeight: 1.8, fontSize: '15px', whiteSpace: 'pre-line' }}>
                  {job.description}
                </div>
              </div>

              {job.responsibilities?.length > 0 && (
                <div style={cardStyle}>
                  <h2 style={sectionTitle}>Responsibilities</h2>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {job.responsibilities.map((r, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '15px' }}>
                        <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.qualifications?.length > 0 && (
                <div style={cardStyle}>
                  <h2 style={sectionTitle}>Qualifications</h2>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {job.qualifications.map((q, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: darkMode ? '#cbd5e1' : '#475569', fontSize: '15px' }}>
                        <HiCheckCircle style={{ color: '#10b981', marginTop: '3px', flexShrink: 0 }} /> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={cardStyle}>
                <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px' }}>Job Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: darkMode ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><HiClock /></div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>Posted</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b' }}>{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: darkMode ? 'rgba(6, 182, 212, 0.15)' : '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}><HiBriefcase /></div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>Experience</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b' }}>{job.experience?.min || 0} - {job.experience?.max || 'Any'} years</p>
                    </div>
                  </div>
                  {job.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><HiClock /></div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Deadline</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b' }}>{new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {job.skillsRequired?.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px' }}>Required Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.skillsRequired.map((skill, i) => (
                      <span key={i} style={{
                        padding: '6px 14px', borderRadius: '8px',
                        background: darkMode ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                        color: darkMode ? '#a5b4fc' : '#4f46e5',
                        fontSize: '13px', fontWeight: 600
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div style={cardStyle}>
                <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px' }}>About Company</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6366f1', fontWeight: 700, fontSize: '18px'
                  }}>{job.company?.name?.charAt(0)}</div>
                  <div>
                    <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '15px' }}>{job.company?.name}</p>
                    {job.company?.website && (
                      <a href={job.company.website} target="_blank" rel="noreferrer"
                        style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HiGlobe /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefits */}
              {job.benefits?.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px' }}>Benefits</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {job.benefits.map((b, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: darkMode ? '#cbd5e1' : '#475569' }}>
                        <span style={{ color: '#10b981' }}>✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          div[style*="width: 300px"] { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default JobDetails;
