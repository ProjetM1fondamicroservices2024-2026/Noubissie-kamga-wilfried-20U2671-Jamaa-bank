import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import authService from './services/authService';

// Pages existantes
import Dashboard from './pages/dashboard/Dashboard';
import UsersList from './pages/users/UsersList';
import UserDetails from './pages/users/UserDetails';
import AccountsList from './pages/accounts/AccountsList';
import AccountDetails from './pages/accounts/AccountDetails';
import AccountRequests from './pages/accounts/AccountRequests';
import Dashboard2 from './pages/dashboard/dashboard2';

// Nouvelles pages Transactions - Vérifiez que ces imports fonctionnent
import TransactionsList from './pages/transactions/TransactionsList';
import TransactionDetails from './pages/transactions/TransactionDetails';
import TransactionHistory from './pages/transactions/TransactionHistory';
import BankServicePage from './pages/banks/BankServicePage';
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page non trouvée</p>
      <a href="/" className="text-blue-600 hover:text-blue-800">
        Retour au Dashboard
      </a>
    </div>
  </div>
);

// HOC de protection des routes
function RequireAuth({ children }) {
  const location = useLocation();
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  // Ajout de la classe overflow-x-hidden au body
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);
  return (
    <Router>
      <Routes>
        {/* Route login non protégée */}
        <Route path="/login" element={<LoginPage />} />
        {/* Toutes les autres routes protégées */}
        <Route path="*" element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/super-admin/dashboard" element={<Dashboard2 />} />
                <Route path="/bank-service" element={<BankServicePage />} />
                <Route path="accounts">
                  <Route index element={<AccountsList />} />
                  <Route path="requests" element={<AccountRequests />} />
                  <Route path=":id" element={<AccountDetails />} />
                </Route>
                <Route path="/transactions" element={<TransactionsList />} />
                <Route path="/transactions/:id" element={<TransactionDetails />} />
                <Route path="/transactions/history" element={<TransactionHistory />} />
                <Route path="/transactions/history/:userId" element={<TransactionHistory />} />
                {/* Routes futures - Redirection temporaire vers Dashboard */}
                <Route path="/users/:id/edit" element={<Dashboard />} />
                <Route path="/accounts/create" element={<Dashboard />} />
                <Route path="/accounts/:id/edit" element={<Dashboard />} />
                <Route path="/transactions/create" element={<Dashboard />} />
                <Route path="/transfers" element={<Dashboard />} />
                <Route path="/transfers/create" element={<Dashboard />} />
                <Route path="/transfers/:id" element={<Dashboard />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/reports/financial" element={<Dashboard />} />
                <Route path="/reports/users" element={<Dashboard />} />
                <Route path="/reports/transactions" element={<Dashboard />} />
                <Route path="/profile" element={<Dashboard />} />
                <Route path="/profile/edit" element={<Dashboard />} />
                <Route path="/profile/security" element={<Dashboard />} />
                <Route path="/notifications" element={<Dashboard />} />
                <Route path="/notifications/:id" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
                <Route path="/settings/general" element={<Dashboard />} />
                <Route path="/settings/security" element={<Dashboard />} />
                <Route path="/settings/notifications" element={<Dashboard />} />
                <Route path="/help" element={<Dashboard />} />
                <Route path="/help/faq" element={<Dashboard />} />
                <Route path="/help/contact" element={<Dashboard />} />
                <Route path="/help/tickets" element={<Dashboard />} />
                <Route path="/register" element={<Dashboard />} />
                <Route path="/forgot-password" element={<Dashboard />} />
                <Route path="/reset-password/:token" element={<Dashboard />} />
                <Route path="/audit" element={<Dashboard />} />
                <Route path="/security" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;