import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ProductList } from './pages/Products/ProductList';
import { ProductForm } from './pages/Products/ProductForm';
import { PartyList } from './pages/Parties/PartyList';
import { PartyForm } from './pages/Parties/PartyForm';
import { SalesList } from './pages/Sales/SalesList';
import { SalesForm } from './pages/Sales/SalesForm';
import { PurchasesList } from './pages/Purchases/PurchasesList';
import { PurchasesForm } from './pages/Purchases/PurchasesForm';
import { VouchersList } from './pages/Vouchers/VouchersList';
import { VouchersForm } from './pages/Vouchers/VouchersForm';
import { SalaryList } from './pages/Salary/SalaryList';
import { SalaryForm } from './pages/Salary/SalaryForm';
import { BalanceTransferList } from './pages/BalanceTransfer/BalanceTransferList';
import { BalanceTransferForm } from './pages/BalanceTransfer/BalanceTransferForm';
import { Reports } from './pages/Reports/Reports';
import { UsersList } from './pages/Users/UsersList';
import { UsersForm } from './pages/Users/UsersForm';
import { Settings } from './pages/Settings/Settings';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Products */}
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                
                {/* Parties */}
                <Route path="parties" element={<PartyList />} />
                <Route path="parties/new" element={<PartyForm />} />
                <Route path="parties/:id/edit" element={<PartyForm />} />
                
                {/* Sales */}
                <Route path="sales" element={<SalesList />} />
                <Route path="sales/new" element={<SalesForm />} />
                <Route path="sales/:id/edit" element={<SalesForm />} />
                
                {/* Purchases */}
                <Route path="purchases" element={<PurchasesList />} />
                <Route path="purchases/new" element={<PurchasesForm />} />
                <Route path="purchases/:id/edit" element={<PurchasesForm />} />
                
                {/* Vouchers */}
                <Route path="vouchers" element={<VouchersList />} />
                <Route path="vouchers/new" element={<VouchersForm />} />
                <Route path="vouchers/:id/edit" element={<VouchersForm />} />
                
                {/* Salary */}
                <Route path="salary" element={<SalaryList />} />
                <Route path="salary/new" element={<SalaryForm />} />
                <Route path="salary/:id/edit" element={<SalaryForm />} />
                
                {/* Balance Transfer */}
                <Route path="balance-transfer" element={<BalanceTransferList />} />
                <Route path="balance-transfer/new" element={<BalanceTransferForm />} />
                <Route path="balance-transfer/:id/edit" element={<BalanceTransferForm />} />
                
                {/* Reports */}
                <Route path="reports" element={<Reports />} />
                
                {/* Users */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/new" element={<UsersForm />} />
                <Route path="users/:id/edit" element={<UsersForm />} />
                
                {/* Settings */}
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;