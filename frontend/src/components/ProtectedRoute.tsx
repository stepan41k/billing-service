import { Navigate } from 'react-router-dom';

interface Props { children: React.ReactNode }

export function ProtectedRoute({ children }: Props) {
  const isAuth = Boolean(sessionStorage.getItem('token'));
  return isAuth ? <>{children}</> : <Navigate to='/login' replace />;
}
