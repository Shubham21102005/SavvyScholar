import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const InsurancePage = () => {
  const [insurances, setInsurances] = useState([]);
  const [type, setType] = useState('');
  const [provider, setProvider] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [premium, setPremium] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [showAddInsuranceForm, setShowAddInsuranceForm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch insurance policies from the backend
  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/insurance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInsurances(response.data);
      } catch (err) {
        setError('Failed to fetch insurance policies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  // Handle adding a new insurance policy
  const handleAddInsurance = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/insurance',
        { type, provider, coverageAmount, premium, renewalDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInsurances([...insurances, response.data]);
      setType('');
      setProvider('');
      setCoverageAmount('');
      setPremium('');
      setRenewalDate('');
      setShowAddInsuranceForm(false); // Hide the form after submission
    } catch (err) {
      setError('Failed to add insurance policy. Please try again.');
    }
  };

  // Handle deleting an insurance policy
  const handleDeleteInsurance = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/insurance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInsurances(insurances.filter((insurance) => insurance._id !== id));
    } catch (err) {
      setError('Failed to delete insurance policy. Please try again.');
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
            Insurance Management
            <span className="block mt-2 text-lg font-normal text-gray-600">Secure your future with confidence</span>
          </h1>

          {/* Add Insurance Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
            {!showAddInsuranceForm ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddInsuranceForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  + New Policy
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddInsurance} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Insurance Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Health">Health Insurance</option>
                      <option value="Life">Life Insurance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Provider</label>
                    <input
                      type="text"
                      placeholder="Insurance provider"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Coverage Amount</label>
                    <input
                      type="number"
                      placeholder="Enter coverage amount"
                      value={coverageAmount}
                      onChange={(e) => setCoverageAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Premium</label>
                    <input
                      type="number"
                      placeholder="Enter premium amount"
                      value={premium}
                      onChange={(e) => setPremium(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Renewal Date</label>
                    <input
                      type="date"
                      value={renewalDate}
                      onChange={(e) => setRenewalDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddInsuranceForm(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Save Policy
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Insurance List */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Insurance Policies</h2>
            
            {insurances.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No insurance policies found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Type', 'Provider', 'Coverage', 'Premium', 'Renewal Date', 'Actions'].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {insurances.map((insurance) => (
                      <tr key={insurance._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800 font-medium">{insurance.type}</td>
                        <td className="px-6 py-4 text-blue-600">{insurance.provider}</td>
                        <td className="px-6 py-4 text-green-600 font-medium">${insurance.coverageAmount}</td>
                        <td className="px-6 py-4 text-purple-600 font-medium">${insurance.premium}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(insurance.renewalDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteInsurance(insurance._id)}
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

export default InsurancePage;