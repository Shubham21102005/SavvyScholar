import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Import Header
import LoginForm from './components/LoginForm'; // Import LoginForm
import RegisterForm from './components/RegisterForm'; // Import RegisterForm
import HomePage from './pages/HomePage'; // Import HomePage
import InvestmentsPage from './pages/InvestmentsPage'; // Import InvestmentsPage
import InsurancePage from './pages/InsurancePage'; // Import InsurancePage
import EmergencyFundPage from './pages/EmergencyFundPage'; // Import EmergencyFundPage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AddExpensePage from './pages/AddExpensePage'; // Import AddExpensePage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AddExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <InvestmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance"
          element={
            <ProtectedRoute>
              <InsurancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/savings"
          element={
            <ProtectedRoute>
              <EmergencyFundPage />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;