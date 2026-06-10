import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiTrash, HiUsers, HiEye, HiPause, HiPlay } from 'react-icons/hi';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    jobService.getRecruiterJobs().then(res => { setJobs(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await jobService.updateJob(id, { status: newStatus });
      setJobs(jobs.map(j => j._id === id ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'}`);
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>Manage Jobs</h1>
          <Link to="/recruiter/post-job" style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
            padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>+ Post New Job</Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{ ...cardStyle, padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '16px' }}>No jobs posted yet</p>
            <Link to="/recruiter/post-job" style={{
              display: 'inline-flex', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
              padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none'
            }}>Post Your First Job</Link>
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc' }}>
                    {['Job Title', 'Location', 'Type', 'Applicants', 'Views', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        textAlign: h === 'Actions' ? 'right' : (h === 'Applicants' || h === 'Views' || h === 'Status' ? 'center' : 'left'),
                        padding: '14px 20px', fontSize: '12px', fontWeight: 700,
                        color: darkMode ? '#94a3b8' : '#64748b',
                        textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, i) => (
                    <tr key={job._id} style={{
                      borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '14px' }}>{job.title}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(job.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569' }}>{job.location}</td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569', textTransform: 'capitalize' }}>{job.jobType}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <Link to={`/recruiter/applicants/${job._id}`} style={{ color: '#6366f1', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>{job.applicants?.length || 0}</Link>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569' }}>{job.views || 0}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex', padding: '4px 12px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 600,
                          background: job.status === 'open' ? (darkMode ? 'rgba(52,211,153,0.12)' : '#d1fae5') : (darkMode ? 'rgba(248,113,113,0.12)' : '#fee2e2'),
                          color: job.status === 'open' ? (darkMode ? '#34d399' : '#065f46') : (darkMode ? '#f87171' : '#991b1b')
                        }}>{job.status}</span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button onClick={() => handleToggleStatus(job._id, job.status)}
                            title={job.status === 'open' ? 'Close' : 'Reopen'}
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: '#94a3b8', fontSize: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            {job.status === 'open' ? <HiPause /> : <HiPlay />}
                          </button>
                          <button onClick={() => handleDelete(job._id)} title="Delete"
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: '#ef4444', fontSize: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.1)' : '#fef2f2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <HiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
