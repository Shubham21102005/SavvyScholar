const mongoose = require('mongoose');

const emergencyFundSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Target amount (6-12 months of user's expenses)
  targetAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  // Current saved amount
  currentAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  // Auto-calculated field (updated via middleware)
  monthsCovered: {
    type: Number,
    default: function() {
      return this.targetAmount > 0 
        ? Math.floor(this.currentAmount / (this.targetAmount / 12)) 
        : 0;
    }
  },
  // Flags
  isGoalMet: { 
    type: Boolean, 
    default: false 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Update `monthsCovered` and `isGoalMet` before saving
emergencyFundSchema.pre('save', function(next) {
  this.monthsCovered = this.targetAmount > 0 
    ? Math.floor(this.currentAmount / (this.targetAmount / 12)) 
    : 0;
  
  this.isGoalMet = this.currentAmount >= this.targetAmount;
  next();
});

module.exports = mongoose.model('EmergencyFund', emergencyFundSchema);