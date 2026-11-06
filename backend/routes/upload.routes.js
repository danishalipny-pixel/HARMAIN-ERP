const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure upload directory exists
if (!fs.existsSync(config.UPLOADS_DIR)) {
  fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, 'harmain-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPG, PNG, WEBP, SVG) and PDFs are allowed'));
  }
});

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    // Check if base64 image data was sent
    if (req.body && req.body.base64Data) {
      try {
        const matches = req.body.base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'png';
          const filename = 'harmain-b64-' + Date.now() + '.' + ext;
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync(path.join(config.UPLOADS_DIR, filename), buffer);
          return res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: `/uploads/${filename}`,
            filename
          });
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid base64 image payload' });
      }
    }
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

module.exports = router;
