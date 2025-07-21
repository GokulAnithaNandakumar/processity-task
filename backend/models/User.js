const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // GDPR Compliance fields
  deletionRequested: {
    type: Boolean,
    default: false
  },
  deletionRequestDate: {
    type: Date,
    default: null
  },
  deletionReason: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'pending_deletion', 'deleted'],
    default: 'active'
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  dataProcessingConsent: {
    type: Boolean,
    default: true
  },
  marketingConsent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
