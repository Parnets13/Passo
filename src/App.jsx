import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import WorkerRegistration from './pages/WorkerRegistration';
import Register from './pages/Register';
import Login from './pages/Login';
import ComingSoon from './pages/ComingSoon';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Workers from './pages/Workers';
import Categories from './pages/Categories';
import Pricing from './pages/Pricing';
import Featured from './pages/Featured';
import Payments from './pages/Payments';
import PaymentManagement from './pages/PaymentManagement';
import Complaints from './pages/Complaints';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import CMS from './pages/CMS';

// Component to handle login redirect
const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Login />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/category/:serviceName" element={<ServiceDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/worker-registration" element={<WorkerRegistration />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginRoute />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="workers" element={<Workers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="featured" element={<Featured />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payment-management" element={<PaymentManagement />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="cms" element={<CMS />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;