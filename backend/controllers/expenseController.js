const Expense = require('../models/Expense');

// @desc    Add a new expense
// @route   POST /api/expenses
const addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body; // Include title

  try {
    const expense = await Expense.create({
      userId: req.user._id, // From auth middleware
      title, // Save title
      amount,
      category,
      date: date || Date.now(), // Use current date if not provided
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort('-date');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  const { title, amount, category, date } = req.body; // Include title

  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id, // Ensure user owns the expense
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.title = title || expense.title; // Update title
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // Ensure user owns the expense
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };