const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['requester', 'helper'],
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  
  // Helper specific fields
  helperProfile: {
    governmentId: {
      type: String,
      default: null,
    },
    idVerificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    idVerificationDocument: {
      type: String,
      default: null,
    },
    vehicleType: {
      type: String,
      enum: ['bicycle', 'motorbike', 'car', 'walking'],
      default: 'walking',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      accountHolderName: String,
      ifscCode: String,
    },
  },

  // Settings
  notificationPreferences: {
    taskRequests: { type: Boolean, default: true },
    taskUpdates: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
  },
  
  // Security
  refreshToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  deviceTokens: [String], // For push notifications
  
  // Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
  suspensionReason: String,
  deletedAt: Date,
}, {
  timestamps: true,
});

// Create geospatial index for helper location
userSchema.index({ 'helperProfile.currentLocation': '2dsphere' });

// Create text index for search
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.__v;
  return user;
};

// Static methods
userSchema.statics.findNearbyHelpers = async function(location, maxDistance = 5000) {
  return this.find({
    role: 'helper',
    'helperProfile.isAvailable': true,
    'helperProfile.idVerificationStatus': 'verified',
    status: 'active',
    'helperProfile.currentLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  });
};

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;