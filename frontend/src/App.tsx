import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import Layout from '@/components/Layout/Layout';

const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Register/Register'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const Contracts = lazy(() => import('@/pages/Contracts/Contracts'));
const Payments = lazy(() => import('@/pages/Payments/Payments'));
const Support = lazy(() => import('@/pages/Support/Support'));
const SpeedTest = lazy(() => import('@/pages/SpeedTest/SpeedTest'));
const NetworkStatus = lazy(() => import('@/pages/NetworkStatus/NetworkStatus'));
const Notifications = lazy(() => import('@/pages/Notifications/Notifications'));

function AnimatedRoutes() {
  const location = useLocation();
  const segment = location.pathname.split('/')[1];
  const routeKey =
    segment === 'login' || segment === 'register' ? segment : 'app';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routeKey}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/tariffs" element={<Contracts />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/support" element={<Support />} />
          <Route path="/speedtest" element={<SpeedTest />} />
          <Route path="/network" element={<NetworkStatus />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
