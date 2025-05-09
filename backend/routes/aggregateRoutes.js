const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/aggregateController');

router.use(protect);
router.get('/dashboard', getDashboardData);

module.exports = router;