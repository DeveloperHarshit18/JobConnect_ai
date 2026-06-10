import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService, jobService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker, HiDownload, HiCheck, HiX, HiArrowLeft, HiCode, HiChat } from 'react-icons/hi';

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    Promise.all([
      applicationService.getJobApplications(jobId),
      jobService.getJob(jobId)
    ]).then(([appsRes, jobRes]) => {
      setApplications(appsRes.data.data || []);
      setJob(jobRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [jobId]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, { status });
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a));
      toast.success(`Application ${status}`);
    } catch { toast.error('Failed to update'); }
  };

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
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <Link to="/recruiter/manage-jobs" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          color: '#94a3b8', fontSize: '14px', textDecoration: 'none', marginBottom: '16px'
        }}><HiArrowLeft /> Back to Jobs</Link>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>Applicants for {job?.title}</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>{applications.length} applicants</p>
        </div>

        {applications.length === 0 ? (
          <div style={{ ...cardStyle, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>No applicants yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Applicant List */}
            <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {applications.map(app => (
                <motion.div key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    ...cardStyle, padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                    borderColor: selectedApp?._id === app._id ? '#6366f1' : (darkMode ? '#334155' : '#e2e8f0'),
                    boxShadow: selectedApp?._id === app._id ? '0 0 0 3px rgba(99,102,241,0.15)' : cardStyle.boxShadow
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0
                    }}>{app.applicantId?.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '14px', color: darkMode ? '#ffffff' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.applicantId?.name}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.applicantId?.email}</p>
                    </div>
                    <span style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 600,
                      background: badgeColors[app.status]?.bg || '#f1f5f9',
                      color: badgeColors[app.status]?.color || '#64748b'
                    }}>{app.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Applicant Details */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {selectedApp ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  style={{ ...cardStyle, padding: '28px', position: 'sticky', top: '88px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '24px'
                      }}>{selectedApp.applicantId?.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>{selectedApp.applicantId?.name}</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiMail /> {selectedApp.applicantId?.email}</span>
                          {selectedApp.applicantId?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiPhone /> {selectedApp.applicantId?.phone}</span>}
                          {selectedApp.applicantId?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HiLocationMarker /> {selectedApp.applicantId?.location}</span>}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: badgeColors[selectedApp.status]?.bg || '#f1f5f9',
                      color: badgeColors[selectedApp.status]?.color || '#64748b'
                    }}>{selectedApp.status}</span>
                  </div>

                  {/* Skills */}
                  {selectedApp.applicantId?.skills?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}><HiCode style={{ color: '#6366f1' }} /> Skills</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedApp.applicantId.skills.map((skill, i) => (
                          <span key={i} style={{
                            padding: '4px 12px', borderRadius: '8px',
                            background: darkMode ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                            color: darkMode ? '#a5b4fc' : '#4f46e5', fontSize: '13px', fontWeight: 600
                          }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {selectedApp.coverLetter && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '8px', fontSize: '15px' }}>Cover Letter</h3>
                      <p style={{
                        fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569', lineHeight: 1.7,
                        background: darkMode ? '#0f172a' : '#f8fafc', padding: '16px', borderRadius: '12px'
                      }}>{selectedApp.coverLetter}</p>
                    </div>
                  )}

                  {/* Resume */}
                  {selectedApp.applicantId?.resume && (
                    <a href={`/${selectedApp.applicantId.resume}`} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: 600, textDecoration: 'none', fontSize: '14px', marginBottom: '20px' }}>
                      <HiDownload /> Download Resume
                    </a>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`, flexWrap: 'wrap' }}>
                    <button onClick={() => handleStatusUpdate(selectedApp._id, 'shortlisted')} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                      padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
                      minWidth: '120px'
                    }}><HiCheck /> Shortlist</button>
                    <button onClick={() => handleStatusUpdate(selectedApp._id, 'accepted')} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                      padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
                      minWidth: '120px'
                    }}><HiCheck /> Accept</button>
                    <button onClick={() => handleStatusUpdate(selectedApp._id, 'rejected')} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'transparent', color: '#ef4444', border: '2px solid #fecaca',
                      padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                      minWidth: '120px'
                    }}><HiX /> Reject</button>
                  </div>

                  {/* Chat link */}
                  <Link to={`/chat?userId=${selectedApp.applicantId?._id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: 600, textDecoration: 'none', fontSize: '14px', marginTop: '16px'
                  }}><HiChat /> Message Applicant</Link>
                </motion.div>
              ) : (
                <div style={{ ...cardStyle, padding: '60px 24px', textAlign: 'center' }}>
                  <p style={{ color: '#94a3b8' }}>Select an applicant to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 320px"] { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Applicants;
