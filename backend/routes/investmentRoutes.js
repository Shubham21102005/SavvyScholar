const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investmentController');

router.use(protect); // Protect all routes

router.route('/')
  .post(addInvestment)
  .get(getInvestments);

router.route('/:id')
  .put(updateInvestment)
  .delete(deleteInvestment);

module.exports = router;