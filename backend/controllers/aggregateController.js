const Expense = require('../models/Expense');
const Investment = require('../models/Investment');
const EmergencyFund = require('../models/EmergencyFund');
const User = require('../models/User');

// @desc    Get consolidated financial data
// @route   GET /api/aggregate/dashboard
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Total Expenses (Current Month)
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          $expr: { $eq: [{ $dateToString: { format: "%Y-%m", date: "$date" } }, currentMonth] }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 2. Investment Summary
    const investments = await Investment.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    // 3. Emergency Fund Progress
    const emergencyFund = await EmergencyFund.findOne({ userId });

    // 4. Budget vs Actual Spending (Current Month)
    const user = await User.findById(userId).populate('expenses');
    const currentBudgets = user.budgets.filter(b => b.month === currentMonth);
    const budgetStatus = currentBudgets.map(budget => {
      const actual = user.expenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        category: budget.category,
        limit: budget.limit,
        actual,
        progress: (actual / budget.limit * 100).toFixed(2)
      };
    });

    res.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      investments,
      emergencyFund,
      budgetStatus
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardData };