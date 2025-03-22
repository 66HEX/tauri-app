import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { isAuthenticated } from './api';

type AuthContextType = {
  isLoggedIn: boolean;
  checkingAuth: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  checkingAuth: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      setCheckingAuth(false);
    };
    
    checkAuth();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, checkingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!checkingAuth && !isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate({ to: '/login' });
    }
  }, [isLoggedIn, checkingAuth, navigate, location.pathname]);
  
  // While checking authentication status, return null or a loading indicator
  if (checkingAuth) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return <>{children}</>;
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // If user is not logged in and trying to access a protected route, show only the children (login/register page)
  if (!isLoggedIn && isAuthPage) {
    return <>{children}</>;
  }
  
  // If user is logged in but still on auth pages, redirect to dashboard (handled in ProtectedRoute)
  // If user is logged in and on a protected route, show the children with layout
  return <>{children}</>;
};