import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      // Login logic
      if (!email || !password) {
        setMessage('Please enter your credentials');
        return;
      }

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
          setMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 800);
        } else {
          setMessage(data.message || 'Login failed. Please try again.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setMessage('Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Registration logic
      if (!name || !email || !password || !confirmPassword) {
        setMessage('Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }

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
          setMessage('Registration successful! Redirecting...');
          setTimeout(() => navigate('/'), 800);
        } else {
          setMessage(data.message || 'Registration failed. Please try again.');
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
    <div style={{ maxWidth: 800, margin: '80px auto', padding: 60, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
              style={{ width: '100%', padding: 10, marginBottom: 12, display: 'block' }}
            />
          </>
        )}

        <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: '100%', padding: 10, marginBottom: 12, display: 'block' }}
        />

        <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ width: '100%', padding: 10, marginBottom: 12, display: 'block' }}
        />

        {!isLogin && (
          <>
            <label style={{ display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: 10, marginBottom: 16, display: 'block' }}
            />
          </>
        )}

        <button type="submit" disabled={submitting} style={{ width: '110%', padding: 12, background: '#7077c6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {submitting ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Register')}
        </button>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setName('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1565c0', 
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: 'inherit'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
