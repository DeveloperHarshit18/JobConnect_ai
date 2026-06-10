import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services';
import JobCard from '../components/common/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HiSearch, HiLocationMarker, HiFilter, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const darkMode = document.documentElement.classList.contains('dark');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
    category: searchParams.get('category') || '',
    page: 1,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
      const res = await jobService.getJobs(params);
      setJobs(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const clearFilters = () => {
    const cleared = { search: '', location: '', jobType: '', experience: '', salaryMin: '', salaryMax: '', category: '', page: 1 };
    setFilters(cleared);
    setSearchParams({});
    // Re-fetch with cleared filters
    setLoading(true);
    jobService.getJobs({}).then(res => {
      setJobs(res.data.data || []);
      setPagination(res.data.pagination || {});
    }).catch(console.error).finally(() => setLoading(false));
  };

  const jobTypes = ['full-time', 'part-time', 'internship', 'remote', 'contract'];
  const experienceLevels = [
    { label: 'Fresher (0-1)', value: '1' },
    { label: 'Junior (1-3)', value: '3' },
    { label: 'Mid (3-5)', value: '5' },
    { label: 'Senior (5-10)', value: '10' },
    { label: 'Lead (10+)', value: '15' },
  ];

  const searchInputStyle = {
    width: '100%', background: 'transparent', border: 'none', outline: 'none',
    fontSize: '15px', color: darkMode ? '#ffffff' : '#334155'
  };

  const filterInputStyle = {
    width: '100%', padding: '10px 12px',
    background: darkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '10px', fontSize: '13px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    outline: 'none', color: darkMode ? '#ffffff' : '#334155',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      {/* Search Header */}
      <div style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{
              flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', background: darkMode ? '#0f172a' : '#f8fafc',
              borderRadius: '12px', border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`
            }}>
              <HiSearch style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }} />
              <input type="text" placeholder="Job title, keyword..."
                style={searchInputStyle}
                value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
            </div>
            <div style={{
              flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', background: darkMode ? '#0f172a' : '#f8fafc',
              borderRadius: '12px', border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`
            }}>
              <HiLocationMarker style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }} />
              <input type="text" placeholder="Location"
                style={searchInputStyle}
                value={filters.location} onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))} />
            </div>
            <button type="submit" id="search-jobs-btn" style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', padding: '12px 28px', borderRadius: '12px',
              fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              flexShrink: 0
            }}>Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent', border: `2px solid #6366f1`,
                color: '#6366f1', padding: '10px 20px', borderRadius: '12px',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer', flexShrink: 0
              }}>
              <HiFilter /> Filters
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Filters Sidebar */}
          <aside style={{
            width: '280px', flexShrink: 0,
            display: showFilters || window.innerWidth >= 768 ? 'block' : 'none',
            ...(showFilters && window.innerWidth < 768 ? {
              position: 'fixed', inset: 0, zIndex: 40,
              background: darkMode ? '#0f172a' : '#ffffff',
              padding: '24px', overflowY: 'auto'
            } : {})
          }}>
            {showFilters && window.innerWidth < 768 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: darkMode ? '#ffffff' : '#1e293b' }}>Filters</h3>
                <button onClick={() => setShowFilters(false)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px',
                  color: darkMode ? '#cbd5e1' : '#64748b'
                }}><HiX /></button>
              </div>
            )}

            <div style={{
              background: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              padding: '24px',
              position: 'sticky', top: '88px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: darkMode ? '#ffffff' : '#1e293b' }}>Filters</h3>
                <button onClick={clearFilters} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6366f1', fontSize: '13px', fontWeight: 600
                }}>Clear All</button>
              </div>

              {/* Job Type */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Type</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {jobTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 0' }}>
                      <input type="radio" name="jobType" value={type} checked={filters.jobType === type}
                        onChange={(e) => setFilters(f => ({ ...f, jobType: e.target.value }))}
                        style={{ accentColor: '#6366f1' }} />
                      <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569', textTransform: 'capitalize' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience Level</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {experienceLevels.map(exp => (
                    <label key={exp.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 0' }}>
                      <input type="radio" name="experience" value={exp.value} checked={filters.experience === exp.value}
                        onChange={(e) => setFilters(f => ({ ...f, experience: e.target.value }))}
                        style={{ accentColor: '#6366f1' }} />
                      <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569' }}>{exp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Salary Range (₹)</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" placeholder="Min" style={filterInputStyle}
                    value={filters.salaryMin} onChange={(e) => setFilters(f => ({ ...f, salaryMin: e.target.value }))} />
                  <input type="number" placeholder="Max" style={filterInputStyle}
                    value={filters.salaryMax} onChange={(e) => setFilters(f => ({ ...f, salaryMax: e.target.value }))} />
                </div>
              </div>

              <button onClick={() => { fetchJobs(); setShowFilters(false); }} style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', padding: '12px', borderRadius: '12px',
                fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer',
                transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>Apply Filters</button>
            </div>
          </aside>

          {/* Jobs List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '15px' }}>
                <span style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b' }}>{pagination.total || 0}</span> jobs found
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '8px' }}>No jobs found</h3>
                <p style={{ color: '#94a3b8', fontSize: '15px' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '16px'
                }}>
                  {jobs.map(job => <JobCard key={job._id} job={job} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                        style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none',
                          transition: 'all 0.2s',
                          background: filters.page === i + 1
                            ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (darkMode ? '#1e293b' : '#ffffff'),
                          color: filters.page === i + 1 ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b'),
                          boxShadow: filters.page === i + 1
                            ? '0 4px 12px rgba(99, 102, 241, 0.3)' : `0 0 0 1px ${darkMode ? '#334155' : '#e2e8f0'}`
                        }}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          aside { display: ${showFilters ? 'block' : 'none'} !important; }
        }
      `}</style>
    </div>
  );
};

export default Jobs;
