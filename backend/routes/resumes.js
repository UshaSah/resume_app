const express = require('express');
const { getCollection } = require('../database');
const { ObjectId } = require('mongodb');
const router = express.Router();

// READ - Get all resumes
router.get('/', async (req, res) => {
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

// CREATE - Create new resume
router.post('/', async (req, res) => {
    try {
        const resumeData = req.body;
        
        // Add timestamp
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

// UPDATE - Update existing resume
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

// DELETE - Delete resume
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
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
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
