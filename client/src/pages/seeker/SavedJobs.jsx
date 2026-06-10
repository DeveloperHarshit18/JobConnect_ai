import { useState, useEffect } from 'react';
import { userService } from '../../services';
import JobCard from '../../components/common/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    userService.getSavedJobs().then(res => {
      setJobs(res.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await userService.toggleSaveJob(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job removed from saved');
    } catch { toast.error('Failed to unsave'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '24px' }}>Saved Jobs</h1>
        {jobs.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            padding: '60px 24px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔖</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>No saved jobs</h3>
            <p style={{ color: '#94a3b8', marginTop: '4px' }}>Save jobs while browsing to view them here</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {jobs.map(job => <JobCard key={job._id} job={job} onSave={handleUnsave} saved />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
