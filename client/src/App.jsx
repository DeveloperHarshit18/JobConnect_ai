import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Seeker Pages
import SeekerDashboard from './pages/seeker/Dashboard';
import Profile from './pages/seeker/Profile';
import AppliedJobs from './pages/seeker/AppliedJobs';
import SavedJobs from './pages/seeker/SavedJobs';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import Applicants from './pages/recruiter/Applicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Chat
import Chat from './pages/Chat';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Job Seeker Routes */}
              <Route path="/seeker/dashboard" element={
                <ProtectedRoute roles={['seeker']}><SeekerDashboard /></ProtectedRoute>
              } />
              <Route path="/seeker/profile" element={
                <ProtectedRoute roles={['seeker']}><Profile /></ProtectedRoute>
              } />
              <Route path="/seeker/applications" element={
                <ProtectedRoute roles={['seeker']}><AppliedJobs /></ProtectedRoute>
              } />
              <Route path="/seeker/saved-jobs" element={
                <ProtectedRoute roles={['seeker']}><SavedJobs /></ProtectedRoute>
              } />

              {/* Recruiter Routes */}
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>
              } />
              <Route path="/recruiter/post-job" element={
                <ProtectedRoute roles={['recruiter']}><PostJob /></ProtectedRoute>
              } />
              <Route path="/recruiter/manage-jobs" element={
                <ProtectedRoute roles={['recruiter']}><ManageJobs /></ProtectedRoute>
              } />
              <Route path="/recruiter/applicants/:jobId" element={
                <ProtectedRoute roles={['recruiter']}><Applicants /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Chat Route */}
              <Route path="/chat" element={
                <ProtectedRoute roles={['seeker', 'recruiter']}><Chat /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" toastOptions={{
            className: 'dark:bg-dark-card dark:text-white',
            style: { borderRadius: '12px', padding: '12px 16px' }
          }} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
