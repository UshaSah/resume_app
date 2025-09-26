const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/User');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation errors array
    const errors = [];

    // Required field validation
    if (!name || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (name.trim().length > 50) {
      errors.push({ field: 'name', message: 'Name must be less than 50 characters' });
    }

    if (!email || email.trim().length === 0) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
    }

    if (!password || password.length === 0) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    } else if (password.length > 128) {
      errors.push({ field: 'password', message: 'Password must be less than 128 characters' });
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create and save user (password hashed by schema pre-save)
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
        token,
      },
    });
  } catch (error) {
    // Handle duplicate key error for unique email
    if (error && error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation errors array
    const errors = [];

    if (!email || email.trim().length === 0) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
    }

    if (!password || password.length === 0) {
      errors.push({ field: 'password', message: 'Password is required' });
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
