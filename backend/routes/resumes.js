const express = require('express');
const { getCollection } = require('../database');
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// READ - Get all resumes for the authenticated user
router.get('/', async (req, res) => {
    try {
        const collection = await getCollection();
        // Filter resumes by userId
        const resumes = await collection.find({ userId: req.user._id }).toArray();

        res.json({
            success: true,
            data: resumes,
            count: resumes.length,
            message: 'User resumes retrieved successfully'
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

// READ - Get single resume (only if owned by user)
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const collection = await getCollection();
        // Find resume by ID AND userId to ensure user owns it
        const resume = await collection.findOne({ 
            _id: new ObjectId(id),
            userId: req.user._id 
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found or access denied'
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

// CREATE - Create new resume
router.post('/', async (req, res) => {
    try {
        const resumeData = req.body;
        
        // Add user association and timestamps
        resumeData.userId = req.user._id;
        resumeData.createdAt = new Date();
        resumeData.updatedAt = new Date();

        const collection = await getCollection();
        const result = await collection.insertOne(resumeData);

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: {
                id: result.insertedId,
                ...resumeData
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

// UPDATE - Update existing resume (only if owned by user)
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        // Add updated timestamp
        updateData.updatedAt = new Date();

        const collection = await getCollection();
        // Update only if resume belongs to the user
        const result = await collection.updateOne(
            { 
                _id: new ObjectId(id),
                userId: req.user._id 
            },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Resume updated successfully',
            data: {
                id: id,
                ...updateData
            }
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

// DELETE - Delete resume (only if owned by user)
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resume ID format'
            });
        }

        const collection = await getCollection();
        // Delete only if resume belongs to the user
        const result = await collection.deleteOne({ 
            _id: new ObjectId(id),
            userId: req.user._id 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Resume deleted successfully'
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

module.exports = router;
