import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../lib/auth';

export default function ProtectedRoute({ children }) {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}
