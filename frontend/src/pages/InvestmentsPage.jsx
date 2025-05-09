import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [showAddInvestmentForm, setShowAddInvestmentForm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch investments from the backend (original logic preserved)
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/investments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(response.data);
      } catch (err) {
        setError('Failed to fetch investments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Calculate total return (original logic preserved)
  const calculateTotalReturn = (amount, interestRate, tenure) => {
    const monthlyRate = interestRate / 100;
    return (amount * (1 + monthlyRate) ** tenure - amount).toFixed(2);
  };

  // Handle adding new investment (original logic preserved)
  const handleAddInvestment = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/investments',
        { type, amount, tenure, interestRate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvestments([...investments, response.data]);
      setType('');
      setAmount('');
      setTenure('');
      setInterestRate('');
      setShowAddInvestmentForm(false);
    } catch (err) {
      setError('Failed to add investment. Please try again.');
    }
  };

  // Handle delete investment (original logic preserved)
  const handleDeleteInvestment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestments(investments.filter((investment) => investment._id !== id));
    } catch (err) {
      setError('Failed to delete investment. Please try again.');
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
            Investment Portfolio
            <span className="block mt-2 text-lg font-normal text-gray-600">Grow your wealth strategically</span>
          </h1>

          {/* Add Investment Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
            {!showAddInvestmentForm ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddInvestmentForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  + New Investment
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddInvestment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Investment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="FD">Fixed Deposit</option>
                      <option value="PPF">Public Provident Fund</option>
                      <option value="SIP">Systematic Investment Plan</option>
                      <option value="Digital Gold">Digital Gold</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tenure (months)</label>
                    <input
                      type="number"
                      placeholder="Enter tenure"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                    <input
                      type="number"
                      placeholder="Enter rate"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddInvestmentForm(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Add Investment
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Investment List */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Investments</h2>
            
            {investments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No investments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Type', 'Principal', 'Tenure', 'Rate', 'Return', 'Actions'].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {investments.map((investment) => (
                      <tr key={investment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium">{investment.type}</td>
                        <td className="px-6 py-4 text-green-600 font-medium">${investment.amount}</td>
                        <td className="px-6 py-4 text-gray-600">{investment.tenure} months</td>
                        <td className="px-6 py-4 text-blue-600">{investment.interestRate}%</td>
                        <td className="px-6 py-4 font-bold text-purple-600">
                          ${calculateTotalReturn(investment.amount, investment.interestRate, investment.tenure)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteInvestment(investment._id)}
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

export default InvestmentsPage;