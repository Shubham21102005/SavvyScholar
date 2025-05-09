const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateEmergencyFund, getEmergencyFund } = require('../controllers/emergencyFundController');

router.use(protect);

router.route('/')
  .post(updateEmergencyFund)
  .get(getEmergencyFund);

module.exports = router;