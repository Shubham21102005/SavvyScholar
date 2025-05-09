const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getBudget, updateBudget } = require('../controllers/budgetController');

router.use(protect);

router.route('/')
  .get(getBudget)
  .post(updateBudget);

module.exports = router;