const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


// File storage setup
const DATA_FILE = path.join(__dirname, 'resumes.json');
let resumes = [];
let nextId = 1;

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Server is running!', 
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`🚀 Resume Backend running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   POST /api/resumes - Create new resume`);
});

// Load resumes from file on startup
const loadResumes = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(data);
            resumes = parsed.resumes || [];
            nextId = parsed.nextId || 1;
            console.log(`📁 Loaded ${resumes.length} resumes from file`);
        } else {
            console.log('📁 No existing data file found, starting fresh');
        }
    } catch (error) {
        console.error('Error loading resumes:', error);
        resumes = [];
        nextId = 1;
    }
};

// save resumes to file
const saveResumes = () => {
    try {
        const data = {
            resumes: resumes,
            nextId : nextId,
            lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log(`Saved ${resumes.length} resumes to file`);
    } catch (error) {
        console.error('Error saving resumes:', error);
    }
};

// load resumes on startup
loadResumes();

// Create new resume
app.post('/api/resumes', (req, res) => {
   try {
    const { generalInfo, educationInfo, experienceInfo } = req.body;
        
        // Basic validation
        if (!generalInfo || !educationInfo || !experienceInfo) {
            return res.status(400).json({
                success: false,
                message: 'Missing required sections: generalInfo, educationInfo, experienceInfo'
            });
        }
        
        // Create complete resume object
        const newResume = {
            id: nextId++,
            generalInfo,
            educationInfo,
            experienceInfo,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // add to array
        resumes.push(newResume);

        // save to file
        saveResumes();
        
        res.status(201).json({
            success: true,
            message: 'Resume saved successfully!',
            data: newResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
});

