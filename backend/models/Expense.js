const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0  // Ensure amount isn't negative
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Healthcare', 'Other']  // Allowed categories
  },
  description: { 
    type: String, 
    trim: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Expense', expenseSchema);