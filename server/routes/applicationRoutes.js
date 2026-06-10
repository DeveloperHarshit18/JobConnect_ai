const express = require('express');
const router = express.Router();
const { applyForJob, getUserApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('seeker'), applyForJob);
router.get('/user', protect, authorize('seeker'), getUserApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
