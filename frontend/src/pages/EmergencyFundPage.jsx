import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const EmergencyFundPage = () => {
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthsCovered, setMonthsCovered] = useState(0);
  const [isGoalMet, setIsGoalMet] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Fetch emergency fund details from the backend
  useEffect(() => {
    const fetchEmergencyFund = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/emergency-fund', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setTargetAmount(response.data.targetAmount);
          setCurrentAmount(response.data.currentAmount);
          setMonthsCovered(response.data.monthsCovered);
          setIsGoalMet(response.data.isGoalMet);
        }
      } catch (err) {
        setError('Failed to fetch emergency fund details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyFund();
  }, []);

  // Handle updating the emergency fund goal
  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/emergency-fund',
        { targetAmount, currentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTargetAmount(response.data.targetAmount);
      setShowGoalForm(false);
    } catch (err) {
      setError('Failed to update emergency fund goal. Please try again.');
    }
  };

  // Handle adding money to the fund
  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const newCurrentAmount = parseFloat(currentAmount) + parseFloat(amountToAdd);
      const response = await axios.post(
        'http://localhost:8080/api/emergency-fund',
        { targetAmount, currentAmount: newCurrentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentAmount(response.data.currentAmount);
      setMonthsCovered(response.data.monthsCovered);
      setIsGoalMet(response.data.isGoalMet);
      setAmountToAdd('');
      setShowAddMoneyForm(false);
    } catch (err) {
      setError('Failed to add money. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg font-medium p-4 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Emergency Fund
            </span>
            <span className="block mt-2 text-lg font-normal text-gray-600">Financial Safety Net</span>
          </h1>

          {/* Emergency Fund Status Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                <p className="text-2xl font-bold text-gray-800">${targetAmount}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm text-gray-600 mb-1">Current Amount</p>
                <p className="text-2xl font-bold text-gray-800">${currentAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Months Covered</p>
                <p className="text-2xl font-bold text-gray-800">{monthsCovered} months</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                isGoalMet ? 'bg-green-50/50 border-green-200' : 'bg-yellow-50/50 border-yellow-200'
              }`}>
                <p className="text-sm text-gray-600 mb-1">Goal Status</p>
                <p className={`text-2xl font-bold ${
                  isGoalMet ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isGoalMet ? 'Goal Achieved 🎉' : 'Goal in Progress'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-right">
                {progressPercentage.toFixed(1)}% of goal reached
              </p>
            </div>
          </div>

          {/* Management Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fund Management</h2>
            
            <div className="flex gap-4 mb-6">
              {!showGoalForm && !showAddMoneyForm && (
                <>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Update Goal
                  </button>
                  <button
                    onClick={() => setShowAddMoneyForm(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Add Money
                  </button>
                </>
              )}
            </div>

            {showGoalForm && (
              <form onSubmit={handleUpdateGoal} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Target Amount ($)</label>
                  <input
                    type="number"
                    placeholder="Enter target amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Update Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {showAddMoneyForm && (
              <form onSubmit={handleAddMoney} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Amount to Add ($)</label>
                  <input
                    type="number"
                    placeholder="Enter amount to add"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Add Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMoneyForm(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyFundPage;