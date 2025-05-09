const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

// Protect all routes with JWT middleware
router.use(protect);

router.route('/')
  .post(addExpense)
  .get(getExpenses);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;