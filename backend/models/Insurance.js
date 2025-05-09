const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['Health', 'Life'] 
  },
  provider: { 
    type: String, 
    required: true,
    trim: true 
  },
  coverageAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  premium: { 
    type: Number, 
    required: true,
    min: 0 
  },
  renewalDate: { 
    type: Date, 
    required: true 
  }
});

module.exports = mongoose.model('Insurance', insuranceSchema);