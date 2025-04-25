const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;  // Or any other port you prefer

const domain = "https://x1nfvip.xyz"; // Your custom domain

// Set up multer storage with a unique filename (UUID)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where uploaded images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname); // Generate unique filename
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

// Serve static files (images and frontend)
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve the uploaded files

// Serve the HTML frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        // Custom URL for your domain
        const imageUrl = `${domain}/uploads/${req.file.filename}`;

        // Return the image URL (formatted for embedding)
        res.json({
            imageUrl: imageUrl, // The full URL of the uploaded image
            embedCode: `<img src="${imageUrl}" alt="Uploaded Image">` // Embed code for sharing
        });
    } else {
        res.status(400).send('No file uploaded');
    }
});

// Change listen method to listen on 0.0.0.0 (accessible externally)
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at ${domain}:${port}`);
});
