// Auth loader utility for React Router
export const authLoader = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { user: null, isAuthenticated: false };
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
      return { user: null, isAuthenticated: false };
    }

    const data = await response.json();
    return { 
      user: data.data.user, 
      isAuthenticated: true,
      token: token
    };
  } catch (error) {
    console.error('Auth loader error:', error);
    // Clear invalid tokens on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { user: null, isAuthenticated: false };
  }
};

// Loader for protected routes
export const protectedLoader = async () => {
  const authData = await authLoader();
  
  if (!authData.isAuthenticated) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  return authData;
};

// Loader for public routes (redirect if authenticated)
export const publicLoader = async () => {
  const authData = await authLoader();
  
  if (authData.isAuthenticated) {
    throw new Response('Redirect to dashboard', { status: 302, headers: { Location: '/dashboard' } });
  }
  
  return authData;
};
