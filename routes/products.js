const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadProduct, getProducts } = require('../controllers/products');

router.post('/upload', upload.single('image'), uploadProduct); // Upload product route
router.get('/', getProducts); // Get all products route

module.exports = router;
