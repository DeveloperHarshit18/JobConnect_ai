const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getRecruiterJobs, getFeaturedJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/featured', getFeaturedJobs);
router.get('/recruiter/me', protect, authorize('recruiter'), getRecruiterJobs);
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
