const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addInsurance,
  getInsurances,
  updateInsurance,
  deleteInsurance
} = require('../controllers/insuranceController');

router.use(protect); // Protect all routes

router.route('/')
  .post(addInsurance)
  .get(getInsurances);

router.route('/:id')
  .put(updateInsurance)
  .delete(deleteInsurance);

module.exports = router;