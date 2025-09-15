
// step 1: import Dependencies
const express =  require('express');
const cors = require('cors');
const path = require('path');
const { getCollection, testConnection, closeConnection } = require('./database');

// step 2: create Express App
const app = express();
const PORT = process.env.PORT || 80;

// step 3: middleware Setup
app.use(cors());
app.use(express.json());

// Step 4: Health check Endpoint
app.get('/get/health', async (req, res) => {
    try {
        const isDbConnected = await testConnection();

        res.json({
            message: 'Server is running!',
            status: 'healthy',
            database: isDbConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString
        });
    } catch (error) {
        res.json(500).json({
            message: 'Server error',
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// step 5: Create Resume(POST)

app.post('/api/resumes', async (req, res) => {
    try {
        const {generalInfo, educationInfo, experienceInfo } = req.body;

        if (!generalInfo || !educationInfo || !experienceInfo ) {
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
                id: result.insertId,
                ...newResume
            }
        });
    } catch (error) {
        console.error('Error creating resume: ', error);
        res.status(500).json({
            success: false,
            message: 'Error creating resume',
            error: error.message
        });
    }
});

app.get('api/resumes', async (req, res) => {
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
        console.log('Error retrieving resumes: ', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving resumes',
            error: error.message
        })
    }
});

app.get('api/resumes/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const collection = await getCollection()
        const resume = await collection.findOne({ _id: new ObjectId(id) });

        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Resume retrieved successfully"
            });
        }
    } catch (error) {
        console.error('Error retrieving resume:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving resume',
            error: error.message
        })
    }
});