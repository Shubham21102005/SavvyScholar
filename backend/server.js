const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors')
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const emergencyFundRoutes = require('./routes/emergencyFundRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const aggregateRoutes = require('./routes/aggregateRoutes');

dotenv.config();

const app = express(); //

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/emergency-fund', emergencyFundRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/aggregate', aggregateRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App is listening on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error(err));