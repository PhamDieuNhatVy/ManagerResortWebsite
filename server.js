import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize express app
const app = express();
const port = 5000;

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',  // Your React app's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials if needed
}));

// Image upload setup
const upload = multer({ dest: 'uploads/' }); // Adjust according to your needs

// Sample image upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    // Here you'd upload to your cloud provider (e.g., Cloudinary, AWS)
    const fileUrl = 'http://localhost:5000/uploads/' + req.file.filename;  // For testing, replace with actual file URL
    res.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Static file serving for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
