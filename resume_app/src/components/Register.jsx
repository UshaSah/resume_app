import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update mode and clear form when route changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setMessage('');
    setErrors({});
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    // Client-side validation
    const clientErrors = {};
    
    if (isLogin) {
      // Login validation
      if (!email || email.trim().length === 0) {
        clientErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        clientErrors.email = 'Please enter a valid email address';
      }
      
      if (!password || password.length === 0) {
        clientErrors.password = 'Password is required';
      }
    } else {
      // Registration validation
      if (!name || name.trim().length === 0) {
        clientErrors.name = 'Name is required';
      } else if (name.trim().length < 2) {
        clientErrors.name = 'Name must be at least 2 characters long';
      } else if (name.trim().length > 50) {
        clientErrors.name = 'Name must be less than 50 characters';
      }
      
      if (!email || email.trim().length === 0) {
        clientErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        clientErrors.email = 'Please enter a valid email address';
      }
      
      if (!password || password.length === 0) {
        clientErrors.password = 'Password is required';
      } else if (password.length < 6) {
        clientErrors.password = 'Password must be at least 6 characters long';
      } else if (password.length > 128) {
        clientErrors.password = 'Password must be less than 128 characters';
      }
      
      if (!confirmPassword || confirmPassword.length === 0) {
        clientErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        clientErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // If client-side validation fails, show errors and return
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    if (isLogin) {
      // Login logic
      try {
        setSubmitting(true);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
          updateUser(data.data.user); // Update auth context
          setMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 800);
        } else {
          // Handle validation errors (422) or other errors
          if (response.status === 422 && data.errors) {
            const serverErrors = {};
            data.errors.forEach(error => {
              serverErrors[error.field] = error.message;
            });
            setErrors(serverErrors);
          } else {
            setMessage(data.message || 'Login failed. Please try again.');
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        setMessage('Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Registration logic

      try {
        setSubmitting(true);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token', data.data.token);
          updateUser(data.data.user); // Update auth context
          setMessage('Registration successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 800);
        } else {
          // Handle validation errors (422) or other errors
          if (response.status === 422 && data.errors) {
            const serverErrors = {};
            data.errors.forEach(error => {
              serverErrors[error.field] = error.message;
            });
            setErrors(serverErrors);
          } else {
            setMessage(data.message || 'Registration failed. Please try again.');
          }
        }
      } catch (err) {
        console.error('Registration error:', err);
        setMessage('Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '80px auto', padding: 80, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, textAlign: 'center' }}>{isLogin ? 'Sign In' : 'Create Account'}</h2>

      {message && (
        <div style={{
          padding: 12,
          margin: '12px 0',
          backgroundColor: '#e3f2fd',
          color: '#1565c0',
          borderRadius: 4,
          border: '1px solid #bbdefb',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{ 
                width: '100%', 
                padding: 10, 
                marginBottom: errors.name ? 4 : 12, 
                display: 'block',
                border: errors.name ? '2px solid #e74c3c' : '1px solid #ddd',
                borderRadius: 4
              }}
            />
            {errors.name && (
              <div style={{ color: '#e74c3c', fontSize: '12px', marginBottom: 8 }}>
                {errors.name}
              </div>
            )}
          </>
        )}

        <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ 
            width: '100%', 
            padding: 10, 
            marginBottom: errors.email ? 4 : 12, 
            display: 'block',
            border: errors.email ? '2px solid #e74c3c' : '1px solid #ddd',
            borderRadius: 4
          }}
        />
        {errors.email && (
          <div style={{ color: '#e74c3c', fontSize: '12px', marginBottom: 8 }}>
            {errors.email}
          </div>
        )}

        <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ 
            width: '100%', 
            padding: 10, 
            marginBottom: errors.password ? 4 : 12, 
            display: 'block',
            border: errors.password ? '2px solid #e74c3c' : '1px solid #ddd',
            borderRadius: 4
          }}
        />
        {errors.password && (
          <div style={{ color: '#e74c3c', fontSize: '12px', marginBottom: 8 }}>
            {errors.password}
          </div>
        )}

        {!isLogin && (
          <>
            <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: 10, 
                marginBottom: errors.confirmPassword ? 4 : 16, 
                display: 'block',
                border: errors.confirmPassword ? '2px solid #e74c3c' : '1px solid #ddd',
                borderRadius: 4
              }}
            />
            {errors.confirmPassword && (
              <div style={{ color: '#e74c3c', fontSize: '12px', marginBottom: 8 }}>
                {errors.confirmPassword}
              </div>
            )}
          </>
        )}

        <button type="submit" disabled={submitting} style={{ width: '110%', padding: 12, background: '#7077c6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {submitting ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Register')}
        </button>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link 
            to={isLogin ? "/register" : "/login"}
            style={{ 
              color: '#1565c0', 
              textDecoration: 'none'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Link>
          
          {isLogin && (
            <div style={{ marginTop: 8 }}>
              <Link 
                to="/forgot-password"
                style={{ 
                  color: '#1565c0', 
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Register;
