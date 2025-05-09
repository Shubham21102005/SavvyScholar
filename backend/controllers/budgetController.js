const User = require('../models/User');

// @desc    Get the budget for the logged-in user
// @route   GET /api/budgets
const getBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ budget: user.income || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update the budget for the logged-in user
// @route   POST /api/budgets
const updateBudget = async (req, res) => {
  const { budget } = req.body;

  try {
    const user = await User.findById(req.user._id);
    user.income = budget;
    await user.save();
    res.json({ budget: user.income });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBudget, updateBudget };