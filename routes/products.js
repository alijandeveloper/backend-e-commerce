const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // Import the upload middleware
const { uploadProduct, getProducts } = require('../controllers/products');

// Change from upload.single('image') to upload.array('image', 3) to allow multiple images
router.post('/upload', upload, uploadProduct); // Allow up to 3 images

router.get('/', getProducts); // Get all products route

module.exports = router;
