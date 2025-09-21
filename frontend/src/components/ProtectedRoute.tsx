import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (user.role || '').toLowerCase().trim();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [token, userRole, allowedRoles, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;