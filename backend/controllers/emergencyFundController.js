const EmergencyFund = require('../models/EmergencyFund');

// @desc    Create/update emergency fund
// @route   POST /api/emergency-fund
const updateEmergencyFund = async (req, res) => {
  const { targetAmount, currentAmount } = req.body;

  try {
    let fund = await EmergencyFund.findOne({ userId: req.user._id });

    if (!fund) {
      // Create new fund
      fund = new EmergencyFund({
        userId: req.user._id,
        targetAmount,
        currentAmount: currentAmount || 0,
      });
    } else {
      // Update existing fund
      fund.targetAmount = targetAmount || fund.targetAmount;
      fund.currentAmount = currentAmount || fund.currentAmount;
    }

    await fund.save();
    res.json(fund);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get emergency fund details
// @route   GET /api/emergency-fund
const getEmergencyFund = async (req, res) => {
  try {
    const fund = await EmergencyFund.findOne({ userId: req.user._id });
    res.json(fund);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateEmergencyFund, getEmergencyFund };