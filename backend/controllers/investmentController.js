const Investment = require('../models/Investment');

// @desc    Add a new investment
// @route   POST /api/investments
const addInvestment = async (req, res) => {
  const { type, amount, tenure, interestRate, startDate, fundType } = req.body;

  try {
    // Validate required fields based on investment type
    if ((type === 'FD' || type === 'PPF') && !tenure) {
      return res.status(400).json({ message: 'Tenure is required for FD/PPF' });
    }

    const investment = await Investment.create({
      userId: req.user._id,
      type,
      amount,
      tenure,
      interestRate,
      startDate: startDate || Date.now(),
      fundType // For SIPs (e.g., "Large Cap")
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all investments for the user
// @route   GET /api/investments
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an investment
// @route   PUT /api/investments/:id
const updateInvestment = async (req, res) => {
  const { type, amount, tenure, interestRate, fundType } = req.body;

  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { type, amount, tenure, interestRate, fundType },
      { new: true }
    );

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an investment
// @route   DELETE /api/investments/:id
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json({ message: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addInvestment, getInvestments, updateInvestment, deleteInvestment };