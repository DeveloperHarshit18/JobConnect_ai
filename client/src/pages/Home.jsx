import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiBriefcase, HiUsers, HiGlobe, HiStar, HiArrowRight, HiLightningBolt } from 'react-icons/hi';
import { jobService } from '../services';
import JobCard from '../components/common/JobCard';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    jobService.getFeaturedJobs().then(res => setFeaturedJobs(res.data.data || [])).catch(() => {});
  }, []);

  const stats = [
    { icon: <HiBriefcase />, value: '10,000+', label: 'Active Jobs' },
    { icon: <HiUsers />, value: '50,000+', label: 'Job Seekers' },
    { icon: <HiGlobe />, value: '2,000+', label: 'Companies' },
    { icon: <HiStar />, value: '95%', label: 'Success Rate' },
  ];

  const categories = [
    { name: 'Technology', count: 1240, icon: '💻' },
    { name: 'Design', count: 856, icon: '🎨' },
    { name: 'Marketing', count: 692, icon: '📊' },
    { name: 'Finance', count: 534, icon: '💰' },
    { name: 'Healthcare', count: 428, icon: '🏥' },
    { name: 'Education', count: 312, icon: '📚' },
  ];

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #06b6d4 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
        paddingBottom: '120px'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              borderRadius: '50px', padding: '6px 16px',
              color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500,
              marginBottom: '24px'
            }}>
              <HiLightningBolt style={{ color: '#fbbf24' }} /> AI-Powered Job Matching
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '20px'
            }}>
              Find Your Dream Job with{' '}
              <span style={{
                background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>AI-Powered</span>{' '}
              Matching
            </h1>

            {/* Description */}
            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              lineHeight: 1.6
            }}>
              Connect with top companies, get AI resume analysis, and land your perfect role.
              Join thousands of professionals already using JobConnect AI.
            </p>

            {/* Search Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{
                  flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', background: '#f8fafc', borderRadius: '12px'
                }}>
                  <HiSearch style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }} />
                  <input type="text" placeholder="Job title, keyword, or company"
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      fontSize: '15px', color: '#334155'
                    }}
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="hero-search" />
                </div>
                <div style={{
                  flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', background: '#f8fafc', borderRadius: '12px'
                }}>
                  <HiLocationMarker style={{ color: '#94a3b8', fontSize: '20px', flexShrink: 0 }} />
                  <input type="text" placeholder="City or remote"
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      fontSize: '15px', color: '#334155'
                    }}
                    value={location} onChange={(e) => setLocation(e.target.value)} id="hero-location" />
                </div>
                <Link to={`/jobs?search=${searchQuery}&location=${location}`}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', padding: '12px 32px', borderRadius: '12px',
                    fontWeight: 700, fontSize: '16px', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, whiteSpace: 'nowrap'
                  }} id="hero-search-btn">
                  Search Jobs
                </Link>
              </div>
            </div>

            {/* Popular searches */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              gap: '8px', marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.7)'
            }}>
              <span>Popular:</span>
              {['React Developer', 'Data Scientist', 'UI Designer', 'DevOps'].map(term => (
                <Link key={term} to={`/jobs?search=${term}`}
                  style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  {term}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" style={{ width: '100%', height: 'auto', display: 'block' }} preserveAspectRatio="none">
            <path fill="white" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"></path>
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{
                  textAlign: 'center', padding: '28px 24px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #eef2ff 0%, #f0e6ff 100%)',
                  border: '1px solid #e0e7ff'
                }}>
                <div style={{ fontSize: '28px', color: '#6366f1', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#1e293b' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              Explore by Category
            </h2>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto', fontSize: '16px' }}>
              Discover opportunities across the most popular industries
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {categories.map((cat, i) => (
              <motion.div key={i} whileHover={{ y: -5 }}>
                <Link to={`/jobs?category=${cat.name}`}
                  style={{
                    display: 'block', padding: '24px 16px', background: 'white',
                    borderRadius: '16px', border: '1px solid #e2e8f0',
                    textAlign: 'center', textDecoration: 'none',
                    transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                  <h3 style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{cat.count} jobs</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS SECTION ===== */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                Latest Opportunities
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px' }}>Discover fresh job openings from top companies</p>
            </div>
            <Link to="/jobs" className="btn-secondary" style={{ display: 'none' }}>
              View All Jobs <HiArrowRight />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {featuredJobs.length > 0 ? (
              featuredJobs.map(job => <JobCard key={job._id} job={job} />)
            ) : (
              [...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: '#f1f5f9', borderRadius: '16px', height: '240px',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/jobs" className="btn-primary" style={{ borderRadius: '12px', padding: '12px 32px', fontSize: '16px' }}>
              View All Jobs <HiArrowRight style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              Ready to Start Your Journey?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.6 }}>
              Join thousands of professionals and companies on JobConnect AI
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link to="/register" style={{
                background: 'white', color: '#6366f1', padding: '14px 32px',
                borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
                fontSize: '16px', transition: 'all 0.3s'
              }}>
                Get Started Free
              </Link>
              <Link to="/register?role=recruiter" style={{
                border: '2px solid white', color: 'white', padding: '14px 32px',
                borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
                fontSize: '16px', transition: 'all 0.3s'
              }}>
                Post a Job
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
