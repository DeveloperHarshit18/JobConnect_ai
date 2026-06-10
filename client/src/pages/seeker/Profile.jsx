import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/authSlice';
import { userService, aiService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiPencil, HiUpload, HiAcademicCap, HiBriefcase, HiCode, HiLink, HiDocumentText, HiSparkles } from 'react-icons/hi';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    userService.getProfile().then(res => {
      setProfile(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile(profile);
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await userService.uploadResume(formData);
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await userService.uploadAvatar(formData);
      dispatch(updateUser({ profilePicture: res.data.data.profilePicture }));
      toast.success('Profile picture updated!');
    } catch { toast.error('Upload failed'); }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const analyzeResume = async () => {
    setAnalyzing(true);
    try {
      const resumeText = `Name: ${profile.name}\nSkills: ${profile.skills?.join(', ')}\nExperience: ${profile.experience?.map(e => `${e.title} at ${e.company}`).join(', ')}\nEducation: ${profile.education?.map(e => `${e.degree} from ${e.institution}`).join(', ')}`;
      const res = await aiService.analyzeResume({ resumeText });
      setResumeAnalysis(res.data.data);
    } catch { toast.error('Analysis failed'); }
    setAnalyzing(false);
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <HiUser /> },
    { id: 'skills', label: 'Skills', icon: <HiCode /> },
    { id: 'experience', label: 'Experience', icon: <HiBriefcase /> },
    { id: 'education', label: 'Education', icon: <HiAcademicCap /> },
    { id: 'resume', label: 'Resume & AI', icon: <HiSparkles /> },
  ];

  const cardStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...cardStyle, overflow: 'hidden', marginBottom: '24px' }}>
          {/* Gradient Banner */}
          <div style={{
            height: '140px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            position: 'relative'
          }}></div>

          {/* Profile Info */}
          <div style={{ padding: '0 28px 28px', marginTop: '-48px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '20px',
                  background: darkMode ? '#1e293b' : '#ffffff',
                  border: `4px solid ${darkMode ? '#1e293b' : '#ffffff'}`,
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1', fontSize: '36px', fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}>
                  {profile?.profilePicture ? (
                    <img src={`/${profile.profilePicture}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label style={{
                  position: 'absolute', bottom: '-4px', right: '-4px',
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer', fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.4)'
                }}>
                  <HiPencil />
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>

              {/* Name + Email */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e293b' }}>{profile?.name}</h1>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>{profile?.email}</p>
              </div>

              {/* Save Button */}
              <button onClick={handleSave} disabled={saving}
                style={{
                  background: saving ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', padding: '10px 24px', borderRadius: '12px',
                  fontWeight: 700, fontSize: '14px', border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
                  transition: 'all 0.3s', flexShrink: 0
                }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '24px',
          background: darkMode ? '#1e293b' : '#ffffff', borderRadius: '14px',
          padding: '4px', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ ...cardStyle, padding: '28px' }}>

          {/* ---- PERSONAL TAB ---- */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    value={profile?.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="text" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    value={profile?.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input type="text" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    value={profile?.location || ''} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Portfolio URL</label>
                  <input type="url" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    value={profile?.portfolio || ''} onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'none' }}
                  onFocus={handleFocus} onBlur={handleBlur}
                  value={profile?.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              </div>
            </div>
          )}

          {/* ---- SKILLS TAB ---- */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Add a skill (e.g., React.js)" style={{ ...inputStyle, flex: 1 }}
                  value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                <button onClick={addSkill} style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  padding: '0 24px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0
                }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(profile?.skills || []).map((skill, i) => (
                  <span key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '10px',
                    background: darkMode ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                    color: darkMode ? '#a5b4fc' : '#4f46e5', fontSize: '14px', fontWeight: 600
                  }}>
                    {skill}
                    <button onClick={() => removeSkill(skill)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
                      fontSize: '18px', padding: 0, lineHeight: 1
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>×</button>
                  </span>
                ))}
              </div>
              {(!profile?.skills || profile.skills.length === 0) && (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>No skills added yet. Start adding your skills!</p>
              )}
            </div>
          )}

          {/* ---- EXPERIENCE TAB ---- */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(profile?.experience || []).map((exp, i) => (
                <div key={i} style={{
                  padding: '20px', borderRadius: '14px',
                  background: darkMode ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Job Title</label>
                      <input type="text" placeholder="e.g. Frontend Developer" style={inputStyle}
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={exp.title || ''} onChange={(e) => { const updated = [...profile.experience]; updated[i].title = e.target.value; setProfile({ ...profile, experience: updated }); }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Company</label>
                      <input type="text" placeholder="e.g. Google" style={inputStyle}
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={exp.company || ''} onChange={(e) => { const updated = [...profile.experience]; updated[i].company = e.target.value; setProfile({ ...profile, experience: updated }); }} />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Description</label>
                    <textarea placeholder="What did you do in this role?" rows={2} style={{ ...inputStyle, resize: 'none' }}
                      onFocus={handleFocus} onBlur={handleBlur}
                      value={exp.description || ''} onChange={(e) => { const updated = [...profile.experience]; updated[i].description = e.target.value; setProfile({ ...profile, experience: updated }); }} />
                  </div>
                  <button onClick={() => { const updated = profile.experience.filter((_, idx) => idx !== i); setProfile({ ...profile, experience: updated }); }}
                    style={{ fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={() => setProfile({ ...profile, experience: [...(profile.experience || []), { title: '', company: '', description: '' }] })}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  border: `2px dashed ${darkMode ? '#334155' : '#e2e8f0'}`,
                  background: 'transparent', cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600, fontSize: '14px'
                }}>
                + Add Experience
              </button>
            </div>
          )}

          {/* ---- EDUCATION TAB ---- */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(profile?.education || []).map((edu, i) => (
                <div key={i} style={{
                  padding: '20px', borderRadius: '14px',
                  background: darkMode ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Institution</label>
                      <input type="text" placeholder="e.g. MIT" style={inputStyle}
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={edu.institution || ''} onChange={(e) => { const updated = [...profile.education]; updated[i].institution = e.target.value; setProfile({ ...profile, education: updated }); }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Degree</label>
                      <input type="text" placeholder="e.g. B.Tech" style={inputStyle}
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={edu.degree || ''} onChange={(e) => { const updated = [...profile.education]; updated[i].degree = e.target.value; setProfile({ ...profile, education: updated }); }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Field of Study</label>
                      <input type="text" placeholder="e.g. Computer Science" style={inputStyle}
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={edu.field || ''} onChange={(e) => { const updated = [...profile.education]; updated[i].field = e.target.value; setProfile({ ...profile, education: updated }); }} />
                    </div>
                  </div>
                  <button onClick={() => { const updated = profile.education.filter((_, idx) => idx !== i); setProfile({ ...profile, education: updated }); }}
                    style={{ fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: '12px', fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={() => setProfile({ ...profile, education: [...(profile.education || []), { institution: '', degree: '', field: '' }] })}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  border: `2px dashed ${darkMode ? '#334155' : '#e2e8f0'}`,
                  background: 'transparent', cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600, fontSize: '14px'
                }}>
                + Add Education
              </button>
            </div>
          )}

          {/* ---- RESUME & AI TAB ---- */}
          {activeTab === 'resume' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Resume Upload */}
              <div style={{
                padding: '32px', textAlign: 'center', borderRadius: '16px',
                border: `2px dashed ${darkMode ? '#334155' : '#d1d5db'}`,
                background: darkMode ? 'rgba(15,23,42,0.5)' : 'rgba(248,250,252,0.5)'
              }}>
                <HiUpload style={{ fontSize: '40px', color: '#94a3b8', margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '4px' }}>Upload Resume</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>PDF, DOC, or DOCX (Max 5MB)</p>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                  padding: '10px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                }}>
                  Choose File
                  <input type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                </label>
                {profile?.resume && <p style={{ fontSize: '13px', color: '#10b981', marginTop: '12px', fontWeight: 600 }}>✓ Resume uploaded</p>}
              </div>

              {/* AI Analysis */}
              <div style={{
                borderRadius: '16px', padding: '24px',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(88,28,135,0.15), rgba(49,46,129,0.15))'
                  : 'linear-gradient(135deg, #faf5ff, #eef2ff)',
                border: `1px solid ${darkMode ? 'rgba(139,92,246,0.3)' : '#e9d5ff'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <HiSparkles style={{ color: '#8b5cf6', fontSize: '22px' }} />
                  <h3 style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '17px' }}>AI Resume Analysis</h3>
                </div>
                <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '16px' }}>Get AI-powered feedback on your resume to improve your chances</p>
                <button onClick={analyzeResume} disabled={analyzing}
                  style={{
                    background: analyzing ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: 'white', padding: '10px 24px', borderRadius: '12px',
                    fontWeight: 700, fontSize: '14px', border: 'none',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    boxShadow: analyzing ? 'none' : '0 4px 12px rgba(139,92,246,0.3)'
                  }}>
                  {analyzing ? 'Analyzing...' : 'Analyze My Resume'}
                </button>

                {resumeAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Score */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px', borderRadius: '12px',
                      background: darkMode ? '#1e293b' : '#ffffff'
                    }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke={darkMode ? '#334155' : '#e5e7eb'} strokeWidth="3" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#6366f1" strokeWidth="3"
                            strokeDasharray={`${resumeAnalysis.score * 0.88} 88`} strokeLinecap="round" />
                        </svg>
                        <span style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, color: '#6366f1', fontSize: '16px'
                        }}>{resumeAnalysis.score}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b' }}>Resume Score</p>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>{resumeAnalysis.summary}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div style={{
                        padding: '16px', borderRadius: '12px',
                        background: darkMode ? '#1e293b' : '#ffffff'
                      }}>
                        <h4 style={{ fontWeight: 600, color: '#10b981', marginBottom: '8px', fontSize: '14px' }}>✓ Strengths</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {resumeAnalysis.strengths?.map((s, i) => <li key={i} style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#475569' }}>• {s}</li>)}
                        </ul>
                      </div>
                      <div style={{
                        padding: '16px', borderRadius: '12px',
                        background: darkMode ? '#1e293b' : '#ffffff'
                      }}>
                        <h4 style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '8px', fontSize: '14px' }}>⚡ Improvements</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {resumeAnalysis.improvements?.map((s, i) => <li key={i} style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#475569' }}>• {s}</li>)}
                        </ul>
                      </div>
                    </div>

                    {resumeAnalysis.extractedSkills && (
                      <div style={{
                        padding: '16px', borderRadius: '12px',
                        background: darkMode ? '#1e293b' : '#ffffff'
                      }}>
                        <h4 style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '8px', fontSize: '14px' }}>Extracted Skills</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {resumeAnalysis.extractedSkills.map((skill, i) => (
                            <span key={i} style={{
                              padding: '4px 10px', borderRadius: '6px',
                              background: darkMode ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                              color: darkMode ? '#a5b4fc' : '#4f46e5', fontSize: '12px', fontWeight: 600
                            }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
