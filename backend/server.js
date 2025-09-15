const express = require('express');
const cors = require('cors');
const path = require('path');
const { getCollection, testConnection, closeConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
const frontendPath = path.join(__dirname, '../resume_app/dist');
app.use(express.static(frontendPath));

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const isDbConnected = await testConnection();
        
        res.json({ 
            message: 'Server is running!', 
            status: 'healthy',
            database: isDbConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// CREATE - Add new resume
app.post('/api/resumes', async (req, res) => {
    try {
        const { generalInfo, educationInfo, experienceInfo } = req.body;

        if (!generalInfo || !educationInfo || !experienceInfo) {
            return res.status(400).json({
                success: false,
                message: 'Missing required sections'
            });
        }

        const collection = await getCollection();
        
        const newResume = {
            generalInfo,
            educationInfo,
            experienceInfo,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newResume);

        res.status(201).json({
            success: true,
            message: 'Resume created successfully!',
            data: {
                id: result.insertedId,
                ...newResume
            }
        });

    } catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating resume',
            error: error.message
        });
    }
});

// READ - Get all resumes
app.get('/api/resumes', async (req, res) => {
    try {
        const collection = await getCollection();
        const resumes = await collection.find({}).toArray();

        res.json({
            success: true,
            data: resumes,
            count: resumes.length,
            message: 'Resumes retrieved successfully'
        });
    } catch (error) {
        console.error('Error retrieving resumes:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving resumes',
            error: error.message
        });
    }
});

// READ - Get single resume
app.get('/api/resumes/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const collection = await getCollection();
        const resume = await collection.findOne({ _id: new ObjectId(id) });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            data: resume,
            message: 'Resume retrieved successfully'
        });

    } catch (error) {
        console.error('Error retrieving resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving resume',
            error: error.message
        });
    }
});

// UPDATE - Update resume
app.put('/api/resumes/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const { generalInfo, educationInfo, experienceInfo } = req.body;
        const collection = await getCollection();

        const updateData = {
            updatedAt: new Date()
        };

        if (generalInfo) updateData.generalInfo = generalInfo;
        if (educationInfo) updateData.educationInfo = educationInfo;
        if (experienceInfo) updateData.experienceInfo = experienceInfo;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        const updatedResume = await collection.findOne({ _id: new ObjectId(id) });

        res.json({
            success: true,
            message: 'Resume updated successfully!',
            data: updatedResume
        });

    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating resume',
            error: error.message
        });
    }
});

// DELETE - Delete resume
app.delete('/api/resumes/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const collection = await getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            message: 'Resume deleted successfully!',
            deletedId: id
        });

    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting resume',
            error: error.message
        });
    }
});

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
    await closeConnection();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await closeConnection();
    process.exit(0);
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Resume App running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  / - Frontend (React App)`);
    console.log(`   POST /api/resumes - Create new resume`);
    console.log(`   GET  /api/resumes - Get all resumes`);
    console.log(`   GET  /api/resumes/:id - Get single resume`);
    console.log(`   PUT  /api/resumes/:id - Update resume`);
    console.log(`   DELETE /api/resumes/:id - Delete resume`);
    console.log(`   GET  /api/health - Health check`);
    
    // Test database connection on startup
    console.log('🔌 Testing database connection...');
    const isConnected = await testConnection();
    if (isConnected) {
        console.log('✅ Database connection successful!');
    } else {
        console.log('❌ Database connection failed!');
    }
});
