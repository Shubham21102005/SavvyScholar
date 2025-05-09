const Insurance = require('../models/Insurance');

// @desc    Add a new insurance policy
// @route   POST /api/insurance
const addInsurance = async (req, res) => {
  const { type, provider, coverageAmount, premium, renewalDate } = req.body;

  try {
    const insurance = await Insurance.create({
      userId: req.user._id,
      type,
      provider,
      coverageAmount,
      premium,
      renewalDate
    });

    res.status(201).json(insurance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all insurance policies for the user
// @route   GET /api/insurance
const getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find({ userId: req.user._id });
    res.json(insurances);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an insurance policy
// @route   PUT /api/insurance/:id
const updateInsurance = async (req, res) => {
  const { type, provider, coverageAmount, premium, renewalDate } = req.body;

  try {
    const insurance = await Insurance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Ensure user owns the policy
      { type, provider, coverageAmount, premium, renewalDate },
      { new: true } // Return updated document
    );

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance policy not found' });
    }

    res.json(insurance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an insurance policy
// @route   DELETE /api/insurance/:id
const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!insurance) {
      return res.status(404).json({ message: 'Insurance policy not found' });
    }

    res.json({ message: 'Insurance policy deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addInsurance, getInsurances, updateInsurance, deleteInsurance };