import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiBriefcase, HiLocationMarker, HiCurrencyRupee, HiCode, HiDocumentText, HiX } from 'react-icons/hi';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const darkMode = document.documentElement.classList.contains('dark');
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', jobType: 'full-time', category: '',
    salary: { min: '', max: '' }, experience: { min: '', max: '' },
    skillsRequired: [], responsibilities: [], qualifications: [], benefits: [],
    deadline: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newQual, setNewQual] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createJob(formData);
      toast.success('Job posted successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
    setLoading(false);
  };

  const addToArray = (field, value, setter) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const removeFromArray = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: darkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '12px',
    border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    outline: 'none', fontSize: '15px',
    color: darkMode ? '#ffffff' : '#334155',
    transition: 'all 0.2s', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: 600,
    color: darkMode ? '#cbd5e1' : '#374151', marginBottom: '6px'
  };

  const handleFocus = (e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
  const handleBlur = (e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '8px' }}>Post a New Job</h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '15px' }}>Fill in the details to find the perfect candidate</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Basic Info */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <HiBriefcase style={{ color: '#6366f1' }} /> Basic Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Job Title *</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. Senior React Developer"
                    onFocus={handleFocus} onBlur={handleBlur}
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea rows={6} required style={{ ...inputStyle, resize: 'none' }} placeholder="Detailed job description..."
                    onFocus={handleFocus} onBlur={handleBlur}
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Location *</label>
                    <input type="text" required style={inputStyle} placeholder="e.g. Bangalore, India"
                      onFocus={handleFocus} onBlur={handleBlur}
                      value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Job Type</label>
                    <select style={inputStyle} value={formData.jobType}
                      onFocus={handleFocus} onBlur={handleBlur}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input type="text" style={inputStyle} placeholder="e.g. Technology, Design, Marketing"
                    onFocus={handleFocus} onBlur={handleBlur}
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Salary & Experience */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <HiCurrencyRupee style={{ color: '#6366f1' }} /> Salary & Experience
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={labelStyle}>Min Salary (₹)</label><input type="number" style={inputStyle} placeholder="e.g. 500000" onFocus={handleFocus} onBlur={handleBlur} value={formData.salary.min} onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, min: e.target.value } })} /></div>
                <div><label style={labelStyle}>Max Salary (₹)</label><input type="number" style={inputStyle} placeholder="e.g. 1500000" onFocus={handleFocus} onBlur={handleBlur} value={formData.salary.max} onChange={(e) => setFormData({ ...formData, salary: { ...formData.salary, max: e.target.value } })} /></div>
                <div><label style={labelStyle}>Min Experience (yrs)</label><input type="number" style={inputStyle} placeholder="0" onFocus={handleFocus} onBlur={handleBlur} value={formData.experience.min} onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, min: e.target.value } })} /></div>
                <div><label style={labelStyle}>Max Experience (yrs)</label><input type="number" style={inputStyle} placeholder="5" onFocus={handleFocus} onBlur={handleBlur} value={formData.experience.max} onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, max: e.target.value } })} /></div>
              </div>
              <div><label style={labelStyle}>Application Deadline</label><input type="date" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} /></div>
            </div>

            {/* Skills */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <HiCode style={{ color: '#6366f1' }} /> Required Skills
              </h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input type="text" style={{ ...inputStyle, flex: 1 }} placeholder="Add a skill"
                  value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('skillsRequired', newSkill, setNewSkill))} />
                <button type="button" onClick={() => addToArray('skillsRequired', newSkill, setNewSkill)} style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  padding: '0 20px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0
                }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.skillsRequired.map((skill, i) => (
                  <span key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '10px',
                    background: darkMode ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                    color: darkMode ? '#a5b4fc' : '#4f46e5', fontSize: '14px', fontWeight: 600
                  }}>
                    {skill}
                    <button type="button" onClick={() => removeFromArray('skillsRequired', i)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '16px', padding: 0, lineHeight: 1
                    }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities & Qualifications */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <HiDocumentText style={{ color: '#6366f1' }} /> Details
              </h2>
              {/* Responsibilities */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Responsibilities</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" style={{ ...inputStyle, flex: 1 }} placeholder="Add responsibility"
                    value={newResp} onChange={(e) => setNewResp(e.target.value)}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('responsibilities', newResp, setNewResp))} />
                  <button type="button" onClick={() => addToArray('responsibilities', newResp, setNewResp)} style={{
                    background: 'transparent', border: `2px solid #6366f1`, color: '#6366f1',
                    padding: '0 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0
                  }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {formData.responsibilities.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569',
                      background: darkMode ? '#0f172a' : '#f8fafc', padding: '10px 14px', borderRadius: '10px'
                    }}>
                      <span>• {r}</span>
                      <button type="button" onClick={() => removeFromArray('responsibilities', i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px'
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Qualifications */}
              <div>
                <label style={labelStyle}>Qualifications</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" style={{ ...inputStyle, flex: 1 }} placeholder="Add qualification"
                    value={newQual} onChange={(e) => setNewQual(e.target.value)}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('qualifications', newQual, setNewQual))} />
                  <button type="button" onClick={() => addToArray('qualifications', newQual, setNewQual)} style={{
                    background: 'transparent', border: `2px solid #6366f1`, color: '#6366f1',
                    padding: '0 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0
                  }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {formData.qualifications.map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '14px', color: darkMode ? '#94a3b8' : '#475569',
                      background: darkMode ? '#0f172a' : '#f8fafc', padding: '10px 14px', borderRadius: '10px'
                    }}>
                      <span>✓ {q}</span>
                      <button type="button" onClick={() => removeFromArray('qualifications', i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px'
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '16px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;
