const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const taskSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  category: {
    type: String,
    enum: ['shopping', 'pharmacy', 'pickup-delivery', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  pickupLocation: {
    address: {
      type: String,
      required: true,
    },
    landmark: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  deliveryLocation: {
    address: {
      type: String,
      required: true,
    },
    landmark: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  urgency: {
    type: String,
    enum: ['asap', 'scheduled'],
    required: true,
  },
  scheduledTime: {
    type: Date,
    default: null,
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 30,
  },
  budget: {
    type: Number,
    required: true,
    min: 5,
    max: 1000,
  },
  serviceFee: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
  }],
  attachments: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'document'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Acceptance tracking
  acceptanceDeadline: Date,
  rejectedHelpers: [{
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: Date,
    reason: String,
  }],
  
  // Completion details
  completedAt: Date,
  completionProof: {
    photos: [String],
    notes: String,
    submittedAt: Date,
  },
  
  // Cancellation details
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Payment reference
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  
  // Rating references
  requesterRating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  },
  helperRating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0,
  },
  distance: Number, // in km
  actualDuration: Number, // in minutes
}, {
  timestamps: true,
});

// Create geospatial indexes
taskSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
taskSchema.index({ 'deliveryLocation.coordinates': '2dsphere' });

// Create compound indexes for efficient queries
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ requester: 1, status: 1 });
taskSchema.index({ helper: 1, status: 1 });
taskSchema.index({ category: 1, status: 1 });

// Pre-save middleware to calculate total amount
taskSchema.pre('save', function(next) {
  if (this.isModified('budget')) {
    this.serviceFee = Math.round(this.budget * 0.15); // 15% service fee
    this.totalAmount = this.budget + this.serviceFee;
  }
  
  // Set acceptance deadline for ASAP tasks
  if (this.isNew && this.urgency === 'asap') {
    this.acceptanceDeadline = new Date(Date.now() + 90 * 1000); // 90 seconds
  }
  
  next();
});

// Instance methods
taskSchema.methods.addStatusUpdate = function(status, userId, reason = null) {
  this.statusHistory.push({
    status,
    changedBy: userId,
    reason,
  });
  this.status = status;
};

taskSchema.methods.calculateDistance = function() {
  // Simple Haversine formula for distance calculation
  const R = 6371; // Earth's radius in km
  const lat1 = this.pickupLocation.coordinates.coordinates[1];
  const lon1 = this.pickupLocation.coordinates.coordinates[0];
  const lat2 = this.deliveryLocation.coordinates.coordinates[1];
  const lon2 = this.deliveryLocation.coordinates.coordinates[0];
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  this.distance = Math.round(distance * 10) / 10; // Round to 1 decimal
  return this.distance;
};

// Static methods
taskSchema.statics.findNearbyTasks = async function(location, maxDistance = 5000, filters = {}) {
  const query = {
    status: 'pending',
    'pickupLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
    ...filters,
  };
  
  return this.find(query)
    .populate('requester', 'firstName lastName rating profilePicture')
    .sort({ urgency: -1, createdAt: -1 });
};

// Virtual for time remaining (for ASAP tasks)
taskSchema.virtual('timeRemaining').get(function() {
  if (this.urgency === 'asap' && this.status === 'pending' && this.acceptanceDeadline) {
    const remaining = this.acceptanceDeadline - new Date();
    return Math.max(0, Math.floor(remaining / 1000)); // in seconds
  }
  return null;
});

// Add pagination plugin
taskSchema.plugin(mongoosePaginate);

// Ensure virtuals are included in JSON
taskSchema.set('toJSON', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;