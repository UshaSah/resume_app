import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Page.css';
import Dashboard from './components/Dashboard';
import ResumeForm from './components/ResumeForm';
// import ResumeDetails from './components/ResumeDetails';
// import VersionHistory from './components/VersionHistory';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import { AuthProvider, useAuth, AuthLoader } from './hooks/useAuth.jsx';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <AuthLoader />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <AuthLoader />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Main App Routes Component
function AppRoutes() {
  const { loading } = useAuth();
  
  if (loading) {
    return <AuthLoader />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/form" 
        element={
          <ProtectedRoute>
            <ResumeForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/form/:id" 
        element={
          <ProtectedRoute>
            <ResumeForm />
          </ProtectedRoute>
        } 
      />
      {/* <Route path="/resume/:id" element={user ? <ResumeDetails user={user} /> : <Navigate to="/login" />} />
      <Route path="/versions/:id" element={user ? <VersionHistory user={user} /> : <Navigate to="/login" />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
export default App;
