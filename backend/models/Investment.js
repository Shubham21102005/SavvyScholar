const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['FD', 'PPF', 'SIP', 'Digital Gold'] 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  tenure: {  // In months
    type: Number, 
    required: function() { 
      return this.type === 'FD' || this.type === 'PPF'; 
    } 
  },
  interestRate: {  // Applicable for FD/PPF
    type: Number, 
    min: 0,
    max: 100 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Investment', investmentSchema);