const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: 5000
  },
  company: {
    name: { type: String, required: true },
    logo: String,
    website: String
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'remote', 'contract'],
    default: 'full-time'
  },
  category: { type: String, trim: true },
  skillsRequired: [{ type: String, trim: true }],
  responsibilities: [{ type: String }],
  qualifications: [{ type: String }],
  benefits: [{ type: String }],
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'paused'],
    default: 'open'
  },
  deadline: { type: Date },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
jobSchema.index({ location: 1, jobType: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
