const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, uploadResume, uploadAvatar,
  toggleSaveJob, getSavedJobs, getNotifications, markNotificationRead, getPublicProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('resume'), updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/save-job/:jobId', protect, toggleSaveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);
router.get('/:id', getPublicProfile);

module.exports = router;
