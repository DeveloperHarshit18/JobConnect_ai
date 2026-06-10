const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/applications
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({ jobId, applicantId: req.user._id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user._id,
      resume: req.user.resume,
      coverLetter
    });

    // Update job applicants array
    job.applicants.push(application._id);
    await job.save();

    // Create notification for recruiter
    await Notification.create({
      userId: job.recruiterId,
      type: 'application',
      title: 'New Application',
      message: `${req.user.name} applied for "${job.title}"`,
      link: `/recruiter/applicants/${job._id}`
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/user
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title company location salary jobType status'
      })
      .sort('-appliedAt');

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for a specific job (recruiter)
// @route   GET /api/applications/job/:jobId
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('applicantId', 'name email skills experience education resume profilePicture phone location')
      .sort('-appliedAt');

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (recruiter)
// @route   PUT /api/applications/:id
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    // Notify applicant
    await Notification.create({
      userId: application.applicantId,
      type: 'status_update',
      title: 'Application Update',
      message: `Your application for "${application.jobId.title}" has been ${status}`,
      link: '/seeker/applications'
    });

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
