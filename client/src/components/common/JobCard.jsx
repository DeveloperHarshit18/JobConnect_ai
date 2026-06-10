import { Link } from 'react-router-dom';
import { HiHeart, HiLocationMarker, HiBriefcase, HiClock, HiBookmark } from 'react-icons/hi';

const JobCard = ({ job, onSave, saved }) => {
  const formatSalary = (salary) => {
    if (!salary?.min && !salary?.max) return 'Not disclosed';
    const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
    if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)}`;
    return salary.min ? `${fmt(salary.min)}+` : `Up to ${fmt(salary.max)}`;
  };

  const isNew = () => {
    const daysDiff = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 3;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative'
    }}
    className="job-card"
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.08)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6366f1', fontWeight: 700, fontSize: '18px', flexShrink: 0
          }}>
            {job.company?.name?.charAt(0) || 'J'}
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>{job.company?.name || 'Company'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '12px' }}>
              <HiLocationMarker /> {job.location || 'Remote'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isNew() && (
            <span style={{
              padding: '2px 8px', borderRadius: '6px',
              background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 600
            }}>New</span>
          )}
          {onSave && (
            <button onClick={(e) => { e.stopPropagation(); onSave(job._id); }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: saved ? '#ef4444' : '#94a3b8', fontSize: '20px', padding: '4px'
            }}>
              {saved ? <HiHeart /> : <HiBookmark />}
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
        <h3 style={{
          fontWeight: 700, color: '#1e293b', fontSize: '17px',
          marginBottom: '8px', lineHeight: 1.3
        }}
        onMouseEnter={(e) => e.target.style.color = '#6366f1'}
        onMouseLeave={(e) => e.target.style.color = '#1e293b'}>
          {job.title}
        </h3>
      </Link>

      {/* Description snippet */}
      <p style={{
        fontSize: '14px', color: '#64748b', marginBottom: '16px',
        lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {job.description?.substring(0, 120)}...
      </p>

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {job.skillsRequired.slice(0, 3).map((skill, i) => (
            <span key={i} style={{
              padding: '3px 10px', borderRadius: '6px',
              background: '#eef2ff', color: '#4f46e5', fontSize: '12px', fontWeight: 500
            }}>{skill}</span>
          ))}
          {job.skillsRequired.length > 3 && (
            <span style={{ padding: '3px 10px', borderRadius: '6px', background: '#f1f5f9', color: '#94a3b8', fontSize: '12px' }}>
              +{job.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '16px', borderTop: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HiBriefcase style={{ color: '#6366f1' }} /> {job.jobType}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HiClock /> {job.experience?.min || 0}-{job.experience?.max || 5}y
          </span>
        </div>
        <span style={{ fontWeight: 700, color: '#059669', fontSize: '14px' }}>
          {formatSalary(job.salary)}
        </span>
      </div>

      {/* Match score */}
      {job.matchScore && (
        <div style={{
          marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <div style={{
            flex: 1, height: '4px', borderRadius: '2px', background: '#e2e8f0', overflow: 'hidden'
          }}>
            <div style={{
              width: `${job.matchScore}%`, height: '100%',
              background: job.matchScore > 75 ? '#10b981' : job.matchScore > 50 ? '#f59e0b' : '#ef4444',
              borderRadius: '2px', transition: 'width 0.5s'
            }}></div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1' }}>{job.matchScore}% match</span>
        </div>
      )}
    </div>
  );
};

export default JobCard;
