import { useState, useEffect, createContext, useContext } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error) {
      console.error('Auth check error:', error);
      setError(error.message);
      // Clear invalid tokens on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    updateUser,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Loading component
export function AuthLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#6c757d', margin: 0 }}>Loading...</p>
    </div>
  );
}
