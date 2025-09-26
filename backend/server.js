const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');

// Serve static files from React build
const frontendPath = path.join(__dirname, '../resume_app/dist');
app.use(express.static(frontendPath));

// Health check endpoint (reports mongoose connection status)
app.get('/api/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const state = states[mongoose.connection.readyState] || 'unknown';
    res.json({
        success: true,
        message: 'Server is healthy',
        dbState: state,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Serve React app for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(0);
});


// Connect to MongoDB with Mongoose, then start server
async function start() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://usha_db:q6B3GxlQeGLGhnOB@cluster0.3kjtlxz.mongodb.net/resume_app?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(MONGODB_URI, { dbName: 'resume_app' });
        console.log('✅ Mongoose connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
            // console.log('Frontend: http://localhost:5173');
        });
    } catch (err) {
        console.error('❌ Failed to connect Mongoose:', err);
        process.exit(1);
    }
}

start();

module.exports = app;