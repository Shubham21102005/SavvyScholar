const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  income: { 
    type: Number, 
    default: 0 
  },
  expenses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expense' 
  }],
  // New: Budget settings for each category
  budgets: [{
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Healthcare', 'Other']
    },
    limit: {
      type: Number,
      required: true,
      min: 0
    },
    month: {  // Track budgets per month (e.g., "2023-10" for October 2023)
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/  // Format: YYYY-MM
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);