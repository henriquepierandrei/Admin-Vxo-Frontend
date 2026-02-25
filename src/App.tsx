import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const Payments = lazy(() => import('./pages/Payments'));
const StoreItems = lazy(() => import('./pages/StoreItems'));
const Vouchers = lazy(() => import('./pages/Vouchers'));
const EmailLogs = lazy(() => import('./pages/EmailLogs'));
const UserLogs = lazy(() => import('./pages/UserLogs'));
const Inventory = lazy(() => import('./pages/Inventory'));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:slug" element={<UserDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="store" element={<StoreItems />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="logs/email" element={<EmailLogs />} />
          <Route path="logs/users" element={<UserLogs />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}