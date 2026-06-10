import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HiUsers, HiBriefcase, HiDocumentText, HiTrendingUp, HiTrash, HiBan, HiCheck } from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ limit: 20 }),
        adminService.getAllJobs({ limit: 20 })
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setJobs(jobsRes.data.data || []);
    } catch { }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const handleToggleUser = async (id) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? res.data.data : u));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Remove this job?')) return;
    try {
      await adminService.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job removed');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { icon: <HiUsers />, label: 'Job Seekers', value: stats?.totalUsers || 0, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { icon: <HiUsers />, label: 'Recruiters', value: stats?.totalRecruiters || 0, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
    { icon: <HiBriefcase />, label: 'Total Jobs', value: stats?.totalJobs || 0, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { icon: <HiDocumentText />, label: 'Applications', value: stats?.totalApplications || 0, gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'jobs', label: 'Jobs' },
  ];

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const thStyle = (align = 'left') => ({
    textAlign: align, padding: '14px 20px', fontSize: '12px', fontWeight: 700,
    color: darkMode ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px'
  });

  const tdStyle = (align = 'left') => ({
    padding: '14px 20px', fontSize: '14px',
    color: darkMode ? '#94a3b8' : '#475569', textAlign: align
  });

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '15px' }}>Platform overview and management</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {statCards.map((stat, i) => (
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

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '24px',
          background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '14px',
          padding: '4px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 24px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none',
                transition: 'all 0.2s',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            <div style={{ ...cardStyle, padding: '24px' }}>
              <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiTrendingUp style={{ color: '#6366f1' }} /> User Growth
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats?.userGrowth || []}>
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...cardStyle, padding: '24px' }}>
              <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiBriefcase style={{ color: '#6366f1' }} /> Jobs Posted
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.jobGrowth || []}>
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc' }}>
                    <th style={thStyle()}>Name</th>
                    <th style={thStyle()}>Email</th>
                    <th style={thStyle()}>Role</th>
                    <th style={thStyle('center')}>Status</th>
                    <th style={thStyle('center')}>Joined</th>
                    <th style={thStyle('right')}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}
                      onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={tdStyle()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '12px', fontWeight: 700
                          }}>{u.name?.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '14px' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={tdStyle()}>{u.email}</td>
                      <td style={tdStyle()}>
                        <span style={{
                          padding: '3px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                          background: darkMode ? 'rgba(99,102,241,0.12)' : '#eef2ff',
                          color: darkMode ? '#a5b4fc' : '#4f46e5', textTransform: 'capitalize'
                        }}>{u.role}</span>
                      </td>
                      <td style={tdStyle('center')}>
                        <span style={{
                          padding: '3px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                          background: u.isActive !== false ? (darkMode ? 'rgba(52,211,153,0.12)' : '#d1fae5') : (darkMode ? 'rgba(248,113,113,0.12)' : '#fee2e2'),
                          color: u.isActive !== false ? (darkMode ? '#34d399' : '#065f46') : (darkMode ? '#f87171' : '#991b1b')
                        }}>{u.isActive !== false ? 'Active' : 'Suspended'}</span>
                      </td>
                      <td style={{ ...tdStyle('center'), color: '#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={tdStyle('right')}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button onClick={() => handleToggleUser(u._id)} title="Toggle Status"
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: '#94a3b8', fontSize: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            {u.isActive !== false ? <HiBan /> : <HiCheck />}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} title="Delete"
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: '#ef4444', fontSize: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
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

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc' }}>
                    <th style={thStyle()}>Job Title</th>
                    <th style={thStyle()}>Company</th>
                    <th style={thStyle()}>Location</th>
                    <th style={thStyle('center')}>Status</th>
                    <th style={thStyle('right')}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j._id} style={{ borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}
                      onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...tdStyle(), fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b' }}>{j.title}</td>
                      <td style={tdStyle()}>{j.company?.name}</td>
                      <td style={tdStyle()}>{j.location}</td>
                      <td style={tdStyle('center')}>
                        <span style={{
                          padding: '3px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                          background: j.status === 'open' ? (darkMode ? 'rgba(52,211,153,0.12)' : '#d1fae5') : (darkMode ? 'rgba(248,113,113,0.12)' : '#fee2e2'),
                          color: j.status === 'open' ? (darkMode ? '#34d399' : '#065f46') : (darkMode ? '#f87171' : '#991b1b')
                        }}>{j.status}</span>
                      </td>
                      <td style={tdStyle('right')}>
                        <button onClick={() => handleDeleteJob(j._id)} title="Remove"
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: 'transparent', color: '#ef4444', fontSize: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <HiTrash />
                        </button>
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

export default AdminDashboard;
