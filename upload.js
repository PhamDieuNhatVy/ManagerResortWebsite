import express from 'express';
import multer from 'multer';
import uploader from './cloudinary.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ fileUrl: result.secure_url });
  }).end(file.buffer);
});

export default router;
