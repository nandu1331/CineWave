// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('access_token');
    
    return isAuthenticated ? children : <Navigate to="/login" />;
    return children
}

export default ProtectedRoute;
