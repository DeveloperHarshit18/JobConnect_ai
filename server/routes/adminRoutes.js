const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, toggleUserStatus, getAllJobs, deleteJob } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
