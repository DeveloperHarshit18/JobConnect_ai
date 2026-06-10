import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const jobService = {
  getJobs: (params) => API.get('/jobs', { params }),
  getJob: (id) => API.get(`/jobs/${id}`),
  getFeaturedJobs: () => API.get('/jobs/featured'),
  createJob: (data) => API.post('/jobs', data),
  updateJob: (id, data) => API.put(`/jobs/${id}`, data),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getRecruiterJobs: () => API.get('/jobs/recruiter/me'),
};

export const applicationService = {
  apply: (data) => API.post('/applications', data),
  getUserApplications: () => API.get('/applications/user'),
  getJobApplications: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => API.put(`/applications/${id}`, data),
};

export const userService = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  uploadResume: (formData) => API.post('/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => API.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleSaveJob: (jobId) => API.post(`/users/save-job/${jobId}`),
  getSavedJobs: () => API.get('/users/saved-jobs'),
  getNotifications: () => API.get('/users/notifications'),
  markNotificationRead: (id) => API.put(`/users/notifications/${id}`),
  getPublicProfile: (id) => API.get(`/users/${id}`),
};

export const messageService = {
  sendMessage: (data) => API.post('/messages', data),
  getMessages: (userId) => API.get(`/messages/${userId}`),
  getConversations: () => API.get('/messages/conversations/list'),
};

export const adminService = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/toggle`),
  getAllJobs: (params) => API.get('/admin/jobs', { params }),
  deleteJob: (id) => API.delete(`/admin/jobs/${id}`),
};

export const aiService = {
  analyzeResume: (data) => API.post('/ai/analyze-resume', data),
  getRecommendations: (data) => API.post('/ai/recommend-jobs', data),
};
