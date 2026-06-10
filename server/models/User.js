const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['seeker', 'recruiter', 'admin'],
    default: 'seeker'
  },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String, trim: true }],
  experience: [{
    title: String,
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: { type: Boolean, default: false },
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    from: Date,
    to: Date,
    description: String
  }],
  resume: { type: String }, // file path
  profilePicture: { type: String },
  portfolio: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  // Recruiter-specific fields
  company: {
    name: String,
    description: String,
    logo: String,
    website: String,
    size: String,
    industry: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
