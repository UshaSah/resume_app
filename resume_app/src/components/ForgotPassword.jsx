import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    try {
      setSubmitting(true);
      
      // TODO: Implement forgot password API call
      // const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // For now, just simulate success
      setTimeout(() => {
        setMessage('Password reset instructions have been sent to your email.');
        setSubmitting(false);
      }, 1000);

    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage('Failed to send reset instructions. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '80px auto', padding: 60, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, textAlign: 'center' }}>Forgot Password</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      {message && (
        <div style={{
          padding: 12,
          margin: '12px 0',
          backgroundColor: message.includes('sent') ? '#e8f5e8' : '#ffeaea',
          color: message.includes('sent') ? '#2e7d32' : '#c62828',
          borderRadius: 4,
          border: `1px solid ${message.includes('sent') ? '#c8e6c9' : '#ffcdd2'}`,
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{display: 'block', marginBottom: 6, textAlign: 'left', marginLeft: 0, paddingLeft: 0 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: '100%', padding: 10, marginBottom: 16, display: 'block' }}
        />

        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 6, background: '#7077c6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {submitting ? 'Sending...' : 'Send Reset Instructions'}
        </button>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#1565c0', textDecoration: 'none' }}>
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
