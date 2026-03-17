import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import styles from './App.module.css';

const Login    = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Profile  = lazy(() => import('./pages/Profile/Profile'));
const Tariffs  = lazy(() => import('./pages/Contracts/Contracts'));
const Payments = lazy(() => import('./pages/Payments/Payments'));

function AnimatedRoutes() {
  const location = useLocation();
  // Ключ меняется только при смене секции (login / register / app)
  // Не ре-маунтит Layout при переходе между вкладками
  const routeKey = location.pathname.split('/')[1] === 'login' ||
                   location.pathname.split('/')[1] === 'register'
    ? location.pathname.split('/')[1]
    : 'app';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routeKey}>
        <Route path='/login'    element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path='/profile'  element={<Profile />} />
          <Route path='/tariffs'  element={<Tariffs />} />
          <Route path='/payments' element={<Payments />} />
          <Route path='*'         element={<Navigate to='/profile' replace />} />
        </Route>
        <Route path='/' element={<Navigate to='/login' replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className={styles.fallback} />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

