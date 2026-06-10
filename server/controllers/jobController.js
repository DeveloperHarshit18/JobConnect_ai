const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all jobs with filtering, sorting, pagination
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { search, location, jobType, experience, salaryMin, salaryMax, category, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    let query = { status: 'open' };

    // Search by keyword
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    // Filter by experience
    if (experience) {
      query['experience.min'] = { $lte: parseInt(experience) };
    }

    // Filter by salary range
    if (salaryMin) query['salary.min'] = { $gte: parseInt(salaryMin) };
    if (salaryMax) query['salary.max'] = { $lte: parseInt(salaryMax) };

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiterId', 'name company')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiterId', 'name email company profilePicture');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const recruiter = await User.findById(req.user._id);
    req.body.recruiterId = req.user._id;
    req.body.company = {
      name: recruiter.company?.name || recruiter.name,
      logo: recruiter.company?.logo || '',
      website: recruiter.company?.website || ''
    };

    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter/me
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured/recent jobs
// @route   GET /api/jobs/featured
exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .sort('-createdAt')
      .limit(6)
      .populate('recruiterId', 'name company');
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
