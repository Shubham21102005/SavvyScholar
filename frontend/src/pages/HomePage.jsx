import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [newBudget, setNewBudget] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch expenses and budget from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [expensesResponse, budgetResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/expenses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/budgets', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setExpenses(expensesResponse.data);
        setBudget(budgetResponse.data.budget);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total expenditure
  const totalExpenditure = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  // Process data for pie chart
  const getChartData = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#E7E9ED', '#8B5CF6'
    ];

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 2,
      }]
    };
  };

  // Handle adding a new budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/budgets',
        { budget: parseFloat(newBudget) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(response.data.budget);
      setNewBudget('');
      setShowBudgetInput(false);
    } catch (err) {
      setError('Failed to update budget. Please try again.');
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
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
        <div className="text-red-600 text-lg font-medium p-4 bg-red-50 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Expense Dashboard
            <span className="block mt-1 text-lg font-normal text-gray-600">Track your spending effortlessly</span>
          </h1>

          {/* Budget Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Budget Overview
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-800">${budget.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalExpenditure.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                totalExpenditure > budget 
                ? 'bg-red-50/50 border-red-200' 
                : 'bg-green-50/50 border-green-200'
              }`}>
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className={`text-2xl font-bold ${
                  totalExpenditure > budget ? 'text-red-700' : 'text-green-700'
                }`}>
                  ${(budget - totalExpenditure).toFixed(2)}
                </p>
              </div>
            </div>

            {!showBudgetInput ? (
              <button
                onClick={() => setShowBudgetInput(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Update Budget
              </button>
            ) : (
              <form onSubmit={handleAddBudget} className="flex flex-col sm:flex-row gap-4 mt-4">
                <input
                  type="number"
                  placeholder="Enter new budget amount"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Save Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBudgetInput(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Expense Distribution Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense Categories</h2>
            <div className="max-w-xs mx-auto md:max-w-md">
              {expenses.length > 0 ? (
                <Pie 
                  data={getChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 15,
                          padding: 20
                        }
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-gray-500 text-center">No expenses to display</p>
              )}
            </div>
          </div>

          {/* Add Expense Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => navigate('/add-expense')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Expense
            </button>
          </div>

          {/* Expense List */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Expenses</h2>
            
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No expenses recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Title', 'Amount', 'Category', 'Date', 'Actions'].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">{expense.title}</td>
                        <td className="px-6 py-4 text-red-600 font-medium">${expense.amount}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;